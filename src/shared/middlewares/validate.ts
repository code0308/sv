import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await schema.parseAsync(req.body);
        next();
      } catch (error: any) {
        res.status(400).json({ error: error.errors });
      }
    };
