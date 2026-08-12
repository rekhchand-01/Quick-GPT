import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { buildSocialPostPrompt } from "../prompts/socialPostPrompt";
import { openRouter } from "../config/openRouter";
import sql from "../config/db";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { cloudinary } from "../config/cloudinary";
import dotenv from "dotenv";
import { generateGeminiEmbedding } from "../utils/geminiEmbedding";
dotenv.config();
const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY;

export const generateSocialPost = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.auth().userId;

        const { prompt, platform, tone, length, includeHashtags, generateImage = true } =
            req.body;

        const plan: string | undefined = req.plan;
        const free_usage: number | undefined = req.free_usage;

        // Premium user check
        if (plan !== "premium") {
            response(res, 403, "This feature is only available for premium users.");
            return;
        }

        // Build AI prompt for social post caption
        const formattedPrompt = buildSocialPostPrompt({
            prompt,
            platform,
            tone,
            length,
            includeHashtags,
        });

        // Generate social post caption via AI
        const aiResponse = await openRouter.post("/chat/completions", {
            model: "xiaomi/mimo-v2-flash:free",
            messages: [{ role: "user", content: formattedPrompt }],
            temperature: 0.7,
            max_tokens: 300,
        });

        let content = aiResponse.data?.choices?.[0]?.message?.content?.trim();
        if (!content) content = prompt;

        if (generateImage && plan === "premium" && CLIPDROP_API_KEY) {
            try {
                const form = new FormData();
                form.append("prompt", prompt);

                const apiResponse = await axios.post(
                    "https://clipdrop-api.co/text-to-image/v1",
                    form,
                    {
                        headers: {
                            "x-api-key": CLIPDROP_API_KEY,
                        },
                        responseType: "arraybuffer",
                    }
                );

                const base64Image = Buffer.from(apiResponse.data).toString("base64");
                const dataUri = `data:image/png;base64,${base64Image}`;

                const uploadResult = await cloudinary.uploader.upload(dataUri, {
                    folder: "quickGPT/generated_images",
                });

                // Append image URL to content
                content = `${content} ${uploadResult.secure_url}`;
            } catch (imgError) {
                console.error("Image generation failed:", imgError);
            }

        }

        const embedding = await generateGeminiEmbedding(prompt);


        // Save creation to DB
        await sql`
      INSERT INTO creations (user_id, prompt, content, type, embedding)
      VALUES (
        ${userId},
        ${prompt},
        ${content},
        'social-post'
        ${embedding}
      )
    `;

        // Update free usage
        if (plan !== "premium") {
        }

        response(res, 200, "Success", content);
    } catch (error: any) {
        console.error(error);
        response(res, 500, "Something went wrong", error.message);
    }
};
export const getSocialPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId: string = req.auth().userId;

        const posts = await sql`
      SELECT id, prompt, content, created_at
      FROM creations
      WHERE user_id = ${userId}
        AND type = 'social-post'
      ORDER BY created_at DESC
    `;

        response(res, 200, "Social posts fetched successfully", posts);
    } catch (error: any) {
        console.error(error.message);
        response(res, 500, "Failed to fetch social posts");
    }
};

export const deleteSocialPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId: string = req.auth().userId;
        const { id } = req.params;

        if (!id) {
            response(res, 400, "Social post ID is required");
            return;
        }

        // Ownership check
        const [post] = await sql`
      SELECT id FROM creations
      WHERE id = ${id}
        AND user_id = ${userId}
        AND  = 'social-post'
    `;

        if (!post) {
            response(res, 404, "Social post not found or unauthorized");
            return;
        }

        await sql`
      DELETE FROM creations
      WHERE id = ${id}
    `;

        response(res, 200, "Social post deleted successfully");
    } catch (error: any) {
        console.error(error.message);
        response(res, 500, "Failed to delete social post");
    }
};