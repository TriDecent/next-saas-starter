import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  name: z.string().min(3).max(50).trim(),
  favoriteNumber: z.coerce.number().positive().max(1000),
});

export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
