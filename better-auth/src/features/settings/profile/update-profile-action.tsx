'use server';

import { updateProfileSchema } from '@/features/_shared';
import {
  ajLaxAnonymous,
  ajRestrictiveAuthenticated,
  ensureSession,
  handleDeniedInServerAction,
} from '@/lib';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';

export type UpdateProfileResponse = ActionResponse<
  undefined,
  { message: string }
>;

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

  try {
    const promises = [
      auth.api.updateUser({
        body: {
          name: profileData.name,
          favoriteNumber: profileData.favoriteNumber,
        },
        headers: headersList,
      }),
    ];
    if (profileData.email !== session.user.email) {
      promises.push(
        auth.api.changeEmail({
          body: {
            newEmail: profileData.email,
            callbackURL: ROUTES.settings.href,
          },
          headers: headersList,
        })
      );
    }
    await Promise.all(promises);

    return { type: 'success', payload: undefined };
  } catch (error) {
    return {
      type: 'error',
      payload: {
        message:
          error instanceof Error || error instanceof APIError
            ? error.message
            : 'Unknown error',
      },
    };
  }
}
