import { ORG_ROLES } from '@/lib/auth/constants';
import { userSchema } from '@/shared/schema';
import { z } from 'zod';

export const createInvitationSchema = z.object({
  organizationId: z.string().nonempty(),
  email: z.email(),
  teamId: z.union([z.string(), z.array(z.string())]).optional(),
  resend: z.boolean().optional(),
  role: z.enum(Object.values(ORG_ROLES)),

  selectedOrganization: z
    .object({
      name: z.string(),
      id: z.string(),
      slug: z.string(),
      logo: z.string().nullable(),
      createdAt: z.date(),
      metadata: z.string().nullable(),
    })
    .optional(),

  selectedRecipient: userSchema.optional(),
});

export type CreateInvitationSchema = z.infer<typeof createInvitationSchema>;
