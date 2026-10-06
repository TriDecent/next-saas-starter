import { z } from 'zod';
import { OrgSchema } from '../schema';

export const CreateNewOrgSchema = OrgSchema.omit({ id: true });

export type CreateNewOrg = z.infer<typeof CreateNewOrgSchema>;
