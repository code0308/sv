import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-z]/, { message: 'Must include at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Must include at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Must include at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Must include at least one special character' }),
  confirmPassword: z.string(),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });