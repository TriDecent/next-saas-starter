'use server';
import type { ActionResponse } from '@/features/shared/types';

// TODO: Replace with actual action
type ResetPasswordInput = {
  email: string | null;
};

type ResetPasswordError = Partial<
  Record<keyof ResetPasswordInput, string[]>
> & {
  unexpected?: string;
};

export type ResetPasswordResponse = ActionResponse<
  ResetPasswordInput,
  ResetPasswordError
>;

export type ErrorResetPasswordResponse = Extract<
  ResetPasswordResponse,
  { type: 'error' }
>;

export type SuccessResetPasswordResponse = Extract<
  ResetPasswordResponse,
  { type: 'success' }
>;

// TODO: Implement actual server action
export async function resetPasswordAction(
  state: ResetPasswordResponse,
  formData: FormData
): Promise<ResetPasswordResponse> {
  'use server';

  // Placeholder - replace with your actual logic
  const email = formData.get('email') as string;

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    type: 'success',
    payload: {
      userEntered: null,
      errors: null,
    },
  };
}
