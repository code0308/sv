import { z } from 'zod';

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-z]/, { message: 'Must include at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Must include at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Must include at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Must include at least one special character' }),
});
