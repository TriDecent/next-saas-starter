'use server';

import {
  ajLaxAnonymous,
  ajRestrictiveAuthenticated,
  ensureSession,
  handleDeniedInServerAction,
} from '@/lib';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { OldActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { z } from 'zod';
import { credentialsSchema } from '../../auth/action';

const updateProfileSchema = credentialsSchema.omit({ password: true });

type UpdateProfile = z.infer<typeof updateProfileSchema>;
type UpdateProfileInput = Partial<UpdateProfile>;
type UpdateProfileError = Partial<
  Record<keyof UpdateProfileInput, string[]>
> & {
  unexpected?: string;
};
export type UpdateProfileResponse = OldActionResponse<
  UpdateProfileInput,
  UpdateProfileError
>;
export type ErrorUpdateProfileResponse = Extract<
  UpdateProfileResponse,
  { type: 'error' }
>;
export type SuccessUpdateProfileResponse = Extract<
  UpdateProfileResponse,
  { type: 'success' }
>;

export async function updateProfileAction(
  state: UpdateProfileResponse,
  formData: FormData
): Promise<UpdateProfileResponse> {
  const headersList = await headers();
  const session = await ensureSession(
    headersList,
    ROUTES.settings.nested.profile.href
  );

  const req = await request();
  const inputDecision = await ajLaxAnonymous.protect(req, {
    action: 'sa-update-profile-input-check',
  });

  if (inputDecision.isDenied()) handleDeniedInServerAction(inputDecision);

  const input = Object.fromEntries(formData.entries());

  const parsedResult = updateProfileSchema.safeParse(input);

  if (!parsedResult.success)
    return {
      type: 'error',
      payload: {
        userEntered: input,
        errors: z.flattenError(parsedResult.error).fieldErrors,
      },
    };

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
  } catch (error) {
    return {
      type: 'error',
      payload: {
        userEntered: profileData,
        errors: {
          unexpected:
            error instanceof APIError
              ? error.body?.message || error.status.toString() || 'API error'
              : error instanceof Error
                ? error.message
                : 'Unknown error',
        },
      },
    };
  }

  return {
    type: 'success',
    payload: {
      userEntered: null,
      errors: null,
    },
  };
}
