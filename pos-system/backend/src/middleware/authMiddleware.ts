import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export interface AuthRequest extends Request {
  user?: { uid: string; role: string };
}

export const authMiddleware = (allowedRoles?: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
    if (!token) return next(createHttpError(401, "Unauthorized"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        uid: string;
        role: string;
      };
      req.user = decoded;

      if (
        allowedRoles &&
        !allowedRoles.includes(decoded.role) &&
        decoded.role !== "Admin"
      ) {
        return next(createHttpError(403, "Forbidden: Insufficient role"));
      }

      next();
    } catch {
      next(createHttpError(401, "Invalid or expired token"));
    }
  };
};
