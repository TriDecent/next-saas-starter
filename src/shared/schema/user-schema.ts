import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string(),
  role: z.string(),
  name: z.string(),
  id: z.string(),
  createdAt: z.date(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  updatedAt: z.date(),
  welcomeSent: z.boolean(),
  favoriteNumber: z.number(),
  twoFactorEnabled: z.boolean().nullable(),
  banned: z.boolean().nullable(),
  banReason: z.string().nullable(),
  banExpires: z.date().nullable(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
