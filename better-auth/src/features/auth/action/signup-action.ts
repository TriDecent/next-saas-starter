'use server';

import { ajLaxAnonymous, ajSignup, handleDeniedInServerAction } from '@/lib';
import { auth } from '@/lib/auth';
import type { ActionResponse } from '@/shared/types';
import { request } from '@arcjet/next';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { z } from 'zod';
import { credentialsSchema } from './credentials-schema';

const signupSchema = credentialsSchema
  .extend({
    confirmedPassword: z.string(),
  })
  .refine(data => data.password === data.confirmedPassword, {
    path: ['confirmedPassword'],
    error: 'Password does not match',
  });

type Signup = z.infer<typeof signupSchema>;
type SignupInput = Partial<Signup>;
type SignupError = Partial<Record<keyof SignupInput, string[]>> & {
  unexpected?: string;
};
export type SignupResponse =
  ActionResponse<SignupInput, SignupError> extends infer U
    ? U extends { type: 'success' }
      ? U & {
          payload: {
            success: Awaited<ReturnType<typeof auth.api.signUpEmail>>;
          };
        }
      : U extends { type: 'error' }
        ? U & {
            payload: {
              errors: {
                auth?: APIError;
              };
            };
          }
        : U
    : never;

export type SuccessSignupResponse = Extract<
  SignupResponse,
  { type: 'success' }
>;

export type ErrorSignupResponse = Extract<SignupResponse, { type: 'error' }>;

export async function signupAction(
  state: SignupResponse,
  formData: FormData
): Promise<SignupResponse> {
  const req = await request();
  const decision = await ajLaxAnonymous.protect(req, {
    action: 'sa-signup-input-check',
  });

  if (decision.isDenied()) handleDeniedInServerAction(decision);

  const input = Object.fromEntries(formData.entries());

  const parsedResult = signupSchema.safeParse(input);

  if (!parsedResult.success) {
    return {
      type: 'error',
      payload: {
        userEntered: input,
        errors: z.flattenError(parsedResult.error).fieldErrors,
      },
    };
  }

  const signupCredentials = parsedResult.data;

  const signupDecision = await ajSignup.protect(req, {
    action: 'sa-signup',
    email: signupCredentials.email,
  });

  if (signupDecision.isDenied()) handleDeniedInServerAction(signupDecision);

  try {
    const signUpResult = await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        name: signupCredentials.name,
        email: signupCredentials.email,
        password: signupCredentials.password,
        welcomeSent: false,
      },
    });

    return {
      type: 'success',
      payload: {
        userEntered: null,
        errors: null,
        success: signUpResult,
      },
    };
  } catch (error) {
    if (!(error instanceof APIError))
      return {
        type: 'error',
        payload: {
          userEntered: signupCredentials,
          errors: { unexpected: (error as Error)?.message },
        },
      };

    return {
      type: 'error',
      payload: {
        userEntered: signupCredentials,
        errors: { auth: error },
      },
    };
  }
}
