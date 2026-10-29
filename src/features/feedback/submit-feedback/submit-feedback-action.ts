'use server';

import {
  ajRestrictiveAnonymous,
  handleDeniedInServerAction,
} from '@/lib/arcjet';
import type { ActionState } from '@/shared/components/form/client';
import { request } from '@arcjet/next';
import type { CreateFeedbackInput } from '../repo';
import { getFeedbackService } from '../server/factory';
import { SubmitFeedbackSchema } from './schema';

type SubmitFeedbackState = ActionState<void, { message: string }>;

export async function submitFeedbackFormAction(
  state: SubmitFeedbackState,
  input: unknown
): Promise<SubmitFeedbackState> {
  const parsed = SubmitFeedbackSchema.safeParse(input);
  if (!parsed.success)
    return { type: 'error', payload: { message: 'Invalid input' } };

  const result = await submitFeedbackAction(parsed.data);

  return result.type === 'success' ? { ...result, payload: undefined } : result;
}

export async function submitFeedbackAction(input: CreateFeedbackInput) {
  const [service, req] = await Promise.all([getFeedbackService(), request()]);

  const decision = await ajRestrictiveAnonymous.protect(req, {
    action: 'submit-feedback-action',
  });
  if (decision.isDenied()) handleDeniedInServerAction(decision);

  return service.submitFeedback(input);
}
