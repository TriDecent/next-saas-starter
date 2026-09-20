import { z } from 'zod';
import { orgSchema } from '../_shared';

export const createNewOrgSchema = orgSchema.omit({ id: true });

export type CreateNewOrg = z.infer<typeof createNewOrgSchema>;
