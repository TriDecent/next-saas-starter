// TODO: move feature-specific schemas to their respective modules.
// for now, nearly all schemas are kept here.

import z from 'zod';

export const credentialsSchema = z.object({
  name: z.string().min(3).max(50).trim(),
  email: z.email(),
  password: z.string().min(8).max(64).trim(),
  favoriteNumber: z.coerce.number().positive().max(1000),
});

export const signInSchema = credentialsSchema.pick({
  email: true,
  password: true,
});
export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = credentialsSchema
  .extend({
    confirmedPassword: z.string(),
  })
  .refine(data => data.password === data.confirmedPassword, {
    path: ['confirmedPassword'],
    error: 'Password does not match',
  });
export type SignUpInput = z.infer<typeof signUpSchema>;

export const updatePasswordSchema = credentialsSchema
  .pick({ password: true })
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    token: z.string().min(1, 'Invalid reset token'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

export const resetPasswordSchema = credentialsSchema.pick({ email: true });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = credentialsSchema.omit({ password: true });
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
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

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
