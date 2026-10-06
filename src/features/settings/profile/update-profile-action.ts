'use server';

import {
  UpdateProfileSchema,
  type UpdateProfile,
} from '@/features/user/schema';
import type { GeneralUserResponse } from '@/features/user/server';
import { getUserService } from '@/infrastructure/composition/factory';
import {
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import { request } from '@arcjet/next';

export type UpdateProfileResponse = GeneralUserResponse | { type: 'initial' };

export async function updateProfileFormAction(
  callbackURL: string,
  state: UpdateProfileResponse,
  input: unknown
): Promise<UpdateProfileResponse> {
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
