import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './modules/public/public.route';
import authRoutes from './modules/auth/auth.route';
import publicRoutes from './modules/public/public.route';
import privateRoutes from './modules/private/private.route';
import { errorHandler } from './shared/middlewares/error.middleware';

const app = express();

// 🔧 Middlewares globales
app.use(express.json());
app.use(cookieParser());

// 📦 Rutas API
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Rutas públicas
app.use('/api/public', publicRoutes);

// Rutas privadas para admin
app.use('/api/private', privateRoutes);

// 🧯 Manejo centralizado de errores
app.use(errorHandler);

export { app };
