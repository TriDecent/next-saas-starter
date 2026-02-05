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
});
