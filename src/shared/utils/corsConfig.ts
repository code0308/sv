// utils/corsConfig.ts
import cors from 'cors';

export const corsConfig = cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // frontend permitido
  credentials: true, // habilita envío de cookies y headers personalizados
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
