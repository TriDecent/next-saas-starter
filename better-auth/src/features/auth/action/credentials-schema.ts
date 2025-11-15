import z from 'zod';

export const credentialsSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.email(),
  password: z.string().min(6).max(64),
  favoriteNumber: z.coerce.number().positive().max(1000),
});
