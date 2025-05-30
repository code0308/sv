import express from 'express';

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
