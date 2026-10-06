import type { CreateOrgInput } from '@/features/organizations/server';
import { z } from 'zod';

export const OrgSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .transform(value => value.toLowerCase())
    .refine(value => /^[a-z0-9-]+$/.test(value), {
      error:
        'Slug can only contain lowercase letters, numbers, and hyphens (-)',
    })
    .refine(value => !value.startsWith('-') && !value.endsWith('-'), {
      error: 'Slug cannot start or end with a hyphen (-)',
    })
    .refine(value => !value.includes('--'), {
      error: 'Slug cannot contain consecutive hyphens (--)',
    }),
  logo: z.url().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  keepCurrentActiveOrganization: z.boolean().optional(),
}) satisfies z.ZodType<CreateOrgInput>;

export type OrgSchemaType = z.infer<typeof OrgSchema>;
