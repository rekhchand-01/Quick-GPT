import { Request, Response } from "express";
import { openRouter } from "../config/openRouter";
import sql from "../config/db";
import { response } from "../utils/responseHandler";
import { buildArticlePrompt } from "../prompts/articlePrompt";
import { generateGeminiEmbedding } from "../utils/geminiEmbedding";

const buildFallbackArticle = (prompt: string, length: number): string => {
    const title = prompt.trim().replace(/\s+/g, " ");
    const intro = `Artificial intelligence is becoming an everyday tool for creators, teams, and professionals. In this article, we explore how ${title.toLowerCase()} can make work faster, more organized, and more effective.`;
    const body = `When used thoughtfully, AI helps people reduce repetitive work and focus on higher-value tasks. It can support planning, content creation, research, and decision-making while keeping teams moving with less friction. A practical approach is to use AI as a collaborator rather than a replacement, combining human judgment with machine speed.`;

    const content = `# ${title}\n\n${intro}\n\n${body}`;

    return length > 400 ? content : content.slice(0, Math.max(120, length));
};

export const generateArticle = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.auth().userId;
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage ?? 0;

        if (plan !== "premium" && free_usage >= 10) {
            response(res, 403, "Limit Reached. Upgrade to continue.");
            return;
        }

        const hasAiConfig = Boolean(process.env.OPENROUTER_API_KEY && process.env.GEMINI_API_KEY);

        if (!hasAiConfig) {
            const fallbackContent = buildFallbackArticle(prompt, length);
            response(res, 200, "Success", fallbackContent);
            return;
        }

        const formattedPrompt = buildArticlePrompt({ title: prompt, length });

        const aiResponse = await openRouter.post("/chat/completions", {
            model: "google/gemma-4-31b-it:free",
            messages: [{ role: "user", content: formattedPrompt }],
            temperature: 0.7,
            max_tokens: Math.min(length * 1.3, 1200),
        });

        const content = aiResponse.data.choices?.[0]?.message?.content ?? "";

        if (process.env.DATABASE_URL) {
            const embedding = await generateGeminiEmbedding(content);

            await sql`
              INSERT INTO creations(user_id, prompt, content, type, embedding)
              VALUES(${userId}, ${prompt}, ${content}, 'article', ${embedding})
              RETURNING id
            `;
        }

        response(res, 200, "Success", content);
    } catch (error: any) {
        console.error(error.response?.data || error.message);
        response(res, 500, "Something went wrong");
    }
};



export const getArticles = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.auth().userId;

        const articles = await sql`
            SELECT id, prompt, content, created_at FROM creations WHERE user_id = ${userId} AND type = 'article'
            ORDER BY created_at DESC
            `;

        response(res, 200, "Articles fetched successfully", articles);
    } catch (error: any) {
        console.error(error.message);
        response(res, 500, "Failed to fetch articles");
    }
};

export const deleteArticle = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.auth().userId;
        const { id } = req.params;

        if (!id) {
            response(res, 400, "Article ID is required");
            return;
        }

        // Ensure article belongs to user
        const [article] = await sql`
            SELECT id FROM creations
            WHERE id = ${id}
            AND user_id = ${userId}
            AND type = 'article'
        `;

        if (!article) {
            response(res, 404, "Article not found or unauthorized");
            return;
        }

        await sql`
            DELETE FROM creations
            WHERE id = ${id}
        `;

        response(res, 200, "Article deleted successfully");
    } catch (error: any) {
        console.error(error.message);
        response(res, 500, "Failed to delete article");
    }
};
