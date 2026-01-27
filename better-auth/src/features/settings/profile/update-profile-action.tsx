'use server';

import { getUserService } from '@/infrastructure/service';
import type { GeneralUserResponse } from '@/infrastructure/service/user';
import { ensureSession } from '@/lib/auth';
import {
  ajLaxAnonymous,
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib/security';
import { ROUTES } from '@/shared/constants';
import { updateProfileSchema } from '@/shared/schema';
import { request } from '@arcjet/next';
import { headers } from 'next/headers';

export type UpdateProfileResponse = GeneralUserResponse | { type: 'initial' };

export async function updateProfileAction(
  state: UpdateProfileResponse,
  input: unknown
): Promise<UpdateProfileResponse> {
  const headersList = await headers();
  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.profile.href
  );

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
    userId: session.user.id,
    action: 'sa-update-profile',
  });

  if (updateProfileDecision.isDenied())
    handleDeniedInServerAction(updateProfileDecision);

  const service = await getUserService(ROUTES.settings.nested.profile.href);

  return service.updateProfile(
    profileData,
    ROUTES.settings.nested.profile.href
  );
}
