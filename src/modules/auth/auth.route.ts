import { Router } from 'express';
import { registerHandler, loginHandler, forgotPasswordHandler, resetPasswordHandler, refreshTokenHandler, logoutHandler } from './auth.controller';
import { validate } from '../../shared/middlewares/validate';
import { loginSchema } from '../../shared/libs/zod/login.schema';
import { registerSchema } from '../../shared/libs/zod/register.schema';
import { forgotPasswordSchema } from '../../shared/libs/zod/forgot-pw.schema';
import { resetPasswordSchema } from '../../shared/libs/zod/reset-pw.schema';

const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), registerHandler);
authRoutes.post('/login', validate(loginSchema), loginHandler);
authRoutes.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordHandler);
authRoutes.post('/reset-password', validate(resetPasswordSchema), resetPasswordHandler);
authRoutes.post('/refresh-token', refreshTokenHandler);
authRoutes.post('/logout', logoutHandler);

export default authRoutes;
