import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

// Para extender Request y agregar user (opcional)
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: 'user' | 'admin';
      };
    }
  }
}

export const authenticateToken = ( req: Request, res: Response, next: NextFunction ): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return; // NO devolver res, solo cortar la ejecución
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next(); // llama al siguiente middleware o ruta
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return; // cortar ejecución
  }
};
