import { ROLES } from '@/lib/auth/constants';
import { z } from 'zod';

export const createInvitationSchema = z.object({
  organizationId: z.string().nonempty(),
  email: z.email(),
  teamId: z.union([z.string(), z.array(z.string())]).optional(),
  resend: z.boolean().optional(),
  role: z.enum([
    ROLES['super-admin'],
    ROLES['admin'],
    ROLES['owner'],
    ROLES['member'],
  ]),

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

  selectedRecipient: z
    .object({
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
    })
    .optional(),
});

export type CreateInvitationSchema = z.infer<typeof createInvitationSchema>;
