import z from 'zod';

export const ExportSchema = z.object({
  type: z.literal(['json', 'txt', 'csv']),
});
export type ExportType = z.infer<typeof ExportSchema>;
