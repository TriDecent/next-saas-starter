import { z } from 'zod';

export const CredentialsSchema = z.object({
  name: z.string().min(3).max(50).trim(),
  email: z.email(),
  password: z.string().min(8).max(64).trim(),
  favoriteNumber: z.coerce.number().positive().max(1000),
});

export const SignInSchema = CredentialsSchema.pick({
  email: true,
  password: true,
}).extend({ trustDevice: z.coerce.boolean().optional() });

export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const SignUpSchema = CredentialsSchema.extend({
  confirmedPassword: z.string(),
}).refine(data => data.password === data.confirmedPassword, {
  path: ['confirmedPassword'],
  error: 'Password does not match',
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
