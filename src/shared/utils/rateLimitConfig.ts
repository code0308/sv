import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 2, // Máximo 10 requests por IP
  message: 'Too many attempts, try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
