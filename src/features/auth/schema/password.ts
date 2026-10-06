import { z } from 'zod';
import { CredentialsSchema } from './auth';

export const UpdatePasswordSchema = CredentialsSchema.pick({ password: true })
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    token: z.string().min(1, 'Invalid reset token'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type UpdatePasswordSchemaType = z.infer<typeof UpdatePasswordSchema>;

export const ResetPasswordSchema = CredentialsSchema.pick({ email: true });
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z
  .object({
    newPassword: z.string().min(6),
    currentPassword: z.string(),
    confirmPassword: z.string(),
    revokeOtherSessions: z.coerce.boolean().optional(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
