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
