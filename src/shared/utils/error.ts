import { APIError } from 'better-auth';

export function getErrorMessage(error: unknown) {
  return error instanceof APIError || error instanceof Error
    ? error.message
    : 'Unknown error';
}
