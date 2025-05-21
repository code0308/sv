import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (allowedRoles: ('user' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    next();
  };
};
