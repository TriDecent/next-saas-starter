'use server';

import {
  ajLaxAnonymous,
  ajRestrictiveAuthenticated,
  handleDeniedInServerAction,
} from '@/lib';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { z } from 'zod';
import { credentialsSchema } from '../auth/action';
import { refresh } from 'next/cache';

const updateProfileSchema = credentialsSchema.omit({ password: true });

type UpdateProfile = z.infer<typeof updateProfileSchema>;
type UpdateProfileInput = Partial<UpdateProfile>;
type UpdateProfileError = Partial<
  Record<keyof UpdateProfileInput, string[]>
> & {
  unexpected?: string;
};
export type UpdateProfileResponse = ActionResponse<
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
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) redirect(ROUTES.auth.href, RedirectType.replace);

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
    await auth.api.updateUser({
      body: {
        name: profileData.name,
        favoriteNumber: profileData.favoriteNumber,
      },
      headers: headersList,
    });
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

  refresh();

  return {
    type: 'success',
    payload: {
      userEntered: null,
      errors: null,
    },
  };
}
