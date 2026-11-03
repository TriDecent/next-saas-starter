import { ForbiddenError } from '@casl/ability';
import { APIError } from 'better-auth';

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error;

  return error instanceof APIError ||
    error instanceof ForbiddenError ||
    error instanceof Error
    ? error.message
    : 'Unknown error';
}
