import { Response } from "express";
import sql from "../config/db";
import { response } from "../utils/responseHandler";
import { openRouterForChatBot } from "../config/openRouter";
import { generateGeminiEmbedding } from "../utils/geminiEmbedding";
import { RATE_LIMIT_WINDOW_MS, MAX_REQUESTS, getRandomRateLimitMessage } from "../config/chatRateLimiter";
import { detectDashboardBotIntent } from "../utils/detectDashboardBotIntent";
import { DashboardBotIntent } from "../const/conts";
import { buildCapabilityResponse } from "../prompts/buildCapabilityResponse";
import { Creation } from "../types";
import { buildDashboardBotPrompt } from "../prompts/dashboardBotPrompt";
import { cosineSimilarity } from "../utils/cosineSimilarity";

export const generateDashboardBotResponse = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.auth().userId;
        const displayName = req.body.userFullName || "User";
        const { message } = req.body;

        if (!message?.trim()) {
            response(res, 400, "Message is required");
            return;
        }

        /* ------------------ Rate limiting ------------------ */
        if (!req.session) req.session = {};
        const now = Date.now();
        const requests = (req.session.dashboardRequests || []).filter(
            (t: number) => now - t < RATE_LIMIT_WINDOW_MS
        );

        if (requests.length >= MAX_REQUESTS) {
            response(res, 429, getRandomRateLimitMessage());
            return;
        }
        requests.push(now);
        req.session.dashboardRequests = requests;

        /* ------------------ Intent detection ------------------ */
        const intent = detectDashboardBotIntent(message);

        switch (intent) {
            case DashboardBotIntent.GREETING:
                response(res, 200, "Success", `Hey ${displayName}! 👋 How can I help you today?`);
                return;

            case DashboardBotIntent.IDENTITY:
                response(res, 200, "Success", "I'm your Dashboard AI Assistant. I analyze your creations and give you insights.");
                return;

            case DashboardBotIntent.USER_INFO:
                response(res, 200, "Success", `Your name is ${displayName}! 😊`);
                return;

            case DashboardBotIntent.THANKS:
                response(res, 200, "Success", `You're very welcome, ${displayName}! 🙌`);
                return;

            case DashboardBotIntent.CAPABILITY:
                response(res, 200, "Success", buildCapabilityResponse(displayName));
                return;

            case DashboardBotIntent.STATS:
                const stats = await sql`
          SELECT type, COUNT(*)::int AS count
          FROM creations
          WHERE user_id = ${userId}
          GROUP BY type
          ORDER BY count DESC
        `;
                if (!stats.length) {
                    response(res, 200, "Success", "You haven't created anything yet.");
                    return;
                }
                const total = stats.reduce((s: number, r: { count: number }) => s + r.count, 0);
                const breakdown = stats.map((r: { type: string; count: number }) => `• ${r.type}: ${r.count}`).join("\n");
                response(res, 200, "Success", `You’ve created **${total} items** in total.\n\nBreakdown by type:\n${breakdown}`);
                return;

            case DashboardBotIntent.CONTENT:
                /* ------------------ Fetch creations ------------------ */
                const creations: Creation[] = await sql`
          SELECT content, type, embedding
          FROM creations
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
        ` as Creation[];

                if (!creations.length) {
                    response(res, 200, "Success", `I couldn’t find any content yet, ${displayName}.`);
                    return;
                }

                /* ------------------ Generate embedding ------------------ */
                const messageEmbedding = await generateGeminiEmbedding(message);
                /* ------------------ Compute similarity ------------------ */
                const relevant = creations
                    .map(c => {
                        let vector: number[] = [];
                        if (Array.isArray(c.embedding)) vector = c.embedding;
                        else if (typeof c.embedding === "string") {
                            try { vector = JSON.parse(c.embedding); } catch { }
                        }
                        const sim = vector.length ? cosineSimilarity(messageEmbedding as [], vector) : 0;
                        return { ...c, similarity: sim };
                    })
                    .sort((a, b) => b.similarity - a.similarity)
                    .slice(0, 5);

                /* ------------------ Shorten for prompt ------------------ */
                const context = relevant.map(c => {
                    const short = c.content.length > 300 ? c.content.slice(0, 300) + "..." : c.content;
                    return `[${c.type}]: ${short}`;
                });

                /* ------------------ Build prompt ------------------ */
                const prompt = buildDashboardBotPrompt({
                    userContent: context,
                    question: message,
                    fullName: displayName
                });

                /* ------------------ Call AI ------------------ */
                const aiResponse = await openRouterForChatBot.post("/chat/completions", {
                    model: "nvidia/nemotron-3-nano-30b-a3b:free",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.6,
                    max_tokens: 300
                });

                const reply = aiResponse.data.choices?.[0]?.message?.content?.trim() ||
                    `I processed your request but couldn't generate a clear response.`;


                response(res, 200, "Success", reply);
                return;

            default:
                response(res, 200, "Success", `Hi ${displayName}! How can I assist you today?`);
                return;
        }

    } catch (error: any) {
        if (!res.headersSent) response(res, 500, "Internal server error");
    }
};
