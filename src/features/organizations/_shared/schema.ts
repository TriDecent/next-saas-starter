import type { CreateOrgInput } from '@/features/organizations/server';
import { z } from 'zod';

export const orgSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .transform(v => v.toLowerCase())
    .refine(v => /^[a-z0-9-]+$/.test(v), {
      error:
        'Slug can only contain lowercase letters, numbers, and hyphens (-)',
    })
    .refine(v => !v.startsWith('-') && !v.endsWith('-'), {
      error: 'Slug cannot start or end with a hyphen (-)',
    })
    .refine(v => !v.includes('--'), {
      error: 'Slug cannot contain consecutive hyphens (--)',
    }),
  logo: z.url().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  keepCurrentActiveOrganization: z.boolean().optional(),
}) satisfies z.ZodType<CreateOrgInput>;

export type OrgSchema = z.infer<typeof orgSchema>;
