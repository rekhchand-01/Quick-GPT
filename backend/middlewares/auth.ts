import { response } from "../utils/responseHandler";
import { NextFunction, Request, Response } from "express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const localUserId = "local-user";
        req.auth = () => ({ userId: localUserId, has: async () => false });
        req.has = async () => false;
        req.plan = "free";
        req.free_usage = 0;
        next();
    } catch (error: any) {
        response(res, 401, error?.message || "Authentication failed");
    }
};
