import z from 'zod';

export const EXPORT_TYPES = ['json', 'txt', 'csv'] as const;

export const ExportSchema = z.object({
  type: z.literal(EXPORT_TYPES),
});
export type ExportType = z.infer<typeof ExportSchema>;
