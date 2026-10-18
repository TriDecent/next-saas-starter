'use server';

import {
  UpdateProfileSchema,
  type UpdateProfile,
} from '@/features/user/schema';
import { getUserService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/client';
import { request } from '@arcjet/next';

export type UpdateProfileState = ActionState<void, { message: string }>;

export async function updateProfileFormAction(
  callbackURL: string,
  state: UpdateProfileState,
  input: unknown
): Promise<UpdateProfileState> {
  const parsedResult = UpdateProfileSchema.safeParse(input);

  if (!parsedResult.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const profileData = parsedResult.data;

  return updateProfileAction(profileData, callbackURL);
}

export async function updateProfileAction(
  profileData: UpdateProfile,
  callbackURL: string
) {
  const [req, service] = await Promise.all([
    request(),
    getUserService(callbackURL),
  ]);

  const updateProfileDecision = await ajRestrictiveAuthenticated.protect(req, {
    userId: service.actor.id,
    action: 'sa-update-profile',
  });

  if (updateProfileDecision.isDenied())
    handleDeniedInServerAction(updateProfileDecision);

  return service.updateProfile(profileData);
}
