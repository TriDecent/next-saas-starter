import { ORG_ROLES } from '@/features/authorization';
import { UserSchema } from '@/features/user/schema';
import { z } from 'zod';

export const CreateInvitationSchema = z.object({
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
      createdAt: z.coerce.date(),
      metadata: z.string().nullable(),
    })
    .optional(),

  selectedRecipient: UserSchema.optional(),
});

export type CreateInvitationSchemaType = z.infer<typeof CreateInvitationSchema>;
