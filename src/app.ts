import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './modules/public/public.route';
import authRoutes from './modules/auth/auth.route';
import publicRoutes from './modules/public/public.route';
import privateRoutes from './modules/private/private.route';
import { errorHandler } from './shared/middlewares/error.middleware';
import { helmetConfig } from './shared/utils/helmetConfig';
import { corsConfig } from './shared/utils/corsConfig';
import { registerMiddlewares } from './shared/utils/middleware';
import { authLimiter } from './shared/utils/rateLimitConfig';

const app = express();
registerMiddlewares(app);

// Seguridad
app.use(helmetConfig);
app.use(corsConfig);
app.use(cookieParser());

// 🔧 Middlewares globales
app.use(express.json());

// 📦 Rutas API
app.use('/api/users', userRoutes);
app.use('/api/auth', authLimiter, authRoutes);

// Rutas públicas
app.use('/api/public', publicRoutes);

// Rutas privadas para admin
app.use('/api/private', privateRoutes);

// 🧯 Manejo centralizado de errores
app.use(errorHandler);

export { app };
