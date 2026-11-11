export const ERROR_DEFINITION = defineErrors({
  RATE_LIMITED: {
    code: 'RATE_LIMITED',
    title: 'Too many requests',
    description: 'Please wait a moment before trying again.',
  },
  BOT_DETECTED: {
    code: 'BOT_DETECTED',
    title: 'Request blocked',
    description: 'This request could not be verified.',
  },

  SOCIAL_SIGN_IN_FAILED: {
    code: 'SOCIAL_SIGN_IN_FAILED',
    title: 'Social sign-in failed',
    description:
      'We could not sign you in with that provider. Please try again.',
  },

  INVALID_EMAIL: {
    code: 'INVALID_EMAIL',
    title: 'Invalid email address',
    description: 'Check the email address format and try again.',
  },
  DISPOSABLE_EMAIL: {
    code: 'DISPOSABLE_EMAIL',
    title: 'Email address not allowed',
    description: 'Please use a non-disposable email address.',
  },
  FREE_EMAIL: {
    code: 'FREE_EMAIL',
    title: 'Free email provider not allowed',
    description: 'Please use a business or corporate email address.',
  },
  NO_MX_RECORDS: {
    code: 'NO_MX_RECORDS',
    title: 'Unverifiable email domain',
    description: 'The email domain does not have valid mail exchange records.',
  },
  NO_GRAVATAR: {
    code: 'NO_GRAVATAR',
    title: 'Profile not found',
    description: 'No associated profile could be found for this email address.',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    title: 'Request not allowed',
    description: 'You do not have permission to complete this request.',
  },

  GENERAL: {
    code: 'GENERAL',
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.',
  },
} as const);

type ErrorItem<TCode> = { code: TCode; [key: string]: unknown };

function defineErrors<T extends Record<string, ErrorItem<keyof T>>>(
  definitions: T & { [K in keyof T]: { code: K } }
) {
  return definitions;
}

export const getErrorDefinition = (error: keyof typeof ERROR_DEFINITION) =>
  ERROR_DEFINITION[error];

type ErrorDef = typeof ERROR_DEFINITION;
export type AppErrorCode = ErrorDef[keyof ErrorDef]['code'];
