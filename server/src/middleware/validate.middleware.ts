import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { AppError } from "./errorHandler.js";

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues[0]?.message ?? "Validation failed",
        400
      );
    }

    req.body = parsed.data;

    next();
  };
}