'use server';

import type { ActionResponse } from '@/features/shared/types';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { z } from 'zod';

const signupSchema = z
  .object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    confirmedPassword: z.string(),
  })
  .refine(data => data.password === data.confirmedPassword, {
    path: ['confirmedPassword'],
  });

type Signup = z.infer<typeof signupSchema>;
type SignupInput = Partial<Signup>;
type SignupError = Partial<Record<keyof SignupInput, string[]>> & {
  unexpected?: string;
};
export type SignupResponse = ActionResponse<SignupInput, SignupError>;

export async function signupAction(
  state: SignupResponse,
  formData: FormData
): Promise<SignupResponse> {
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

  try {
    await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        name: signupCredentials.name,
        email: signupCredentials.email,
        password: signupCredentials.password,
      },
    });
  } catch (error) {
    return {
      type: 'error',
      payload: {
        userEntered: signupCredentials,
        errors: { unexpected: (error as Error)?.message },
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
