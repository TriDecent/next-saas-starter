'use server';

import { getUserService } from '@/infrastructure/service';
import type { GeneralUserResponse } from '@/infrastructure/service/user';
import {
  ajLaxAnonymous,
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { ROUTES } from '@/shared/constants';
import { updateProfileSchema } from '@/shared/schema';
import { request } from '@arcjet/next';

export type UpdateProfileResponse = GeneralUserResponse | { type: 'initial' };

export async function updateProfileAction(
  state: UpdateProfileResponse,
  input: unknown
): Promise<UpdateProfileResponse> {
  const service = await getUserService(ROUTES.settings.nested.profile.href);

  const parsedResult = updateProfileSchema.safeParse(input);

  if (!parsedResult.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const req = await request();
  const inputDecision = await ajLaxAnonymous.protect(req, {
    action: 'sa-update-profile-input-check',
  });

  if (inputDecision.isDenied()) handleDeniedInServerAction(inputDecision);

  const profileData = parsedResult.data;

  const updateProfileDecision = await ajRestrictiveAuthenticated.protect(req, {
    userId: service.actor.id,
    action: 'sa-update-profile',
  });

  if (updateProfileDecision.isDenied())
    handleDeniedInServerAction(updateProfileDecision);

  return service.updateProfile(
    profileData,
    ROUTES.settings.nested.profile.href
  );
}
