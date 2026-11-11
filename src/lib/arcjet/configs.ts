import {
  type BotOptions,
  type EmailOptions,
  type ProtectSignupOptions,
  type SlidingWindowRateLimitOptions,
  type TokenBucketRateLimitOptions,
} from '@arcjet/next';

export const arcjetMode =
  process.env.NODE_ENV === 'development' ? 'DRY_RUN' : 'LIVE';

export const botSettings = {
  mode: arcjetMode,
  allow: [
    'CATEGORY:SEARCH_ENGINE',
    'CATEGORY:GOOGLE',
    'CATEGORY:MICROSOFT',
    'CATEGORY:PREVIEW',
    'CATEGORY:SOCIAL',
    'CATEGORY:FEEDFETCHER',
    'CATEGORY:YAHOO',
    'CATEGORY:WEBHOOK',
  ],
} as const satisfies BotOptions;

export const restrictiveRateLimitSettings = {
  mode: arcjetMode,
  max: 10,
  interval: '10m',
} as const satisfies SlidingWindowRateLimitOptions<[]>;

export const extremeRestrictiveRateLimitSettings = {
  mode: arcjetMode,
  max: 3,
  interval: '1h',
} as const satisfies SlidingWindowRateLimitOptions<[]>;

export const laxRateLimitSettings = {
  mode: arcjetMode,
  max: 30,
  interval: '1m',
} as const satisfies SlidingWindowRateLimitOptions<[]>;

const emailSettings = {
  mode: arcjetMode,
  deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
} as const satisfies EmailOptions;

export const signupOptions = {
  email: emailSettings,
  bots: botSettings,
  rateLimit: restrictiveRateLimitSettings,
} as const satisfies ProtectSignupOptions<[]>;

export const tokenBucketOptions = {
  mode: arcjetMode,
  capacity: 3,
  refillRate: 1,
  interval: '1h',
  // Why emailId?
  // It keeps yelling
  /*
       ✦Aj ERROR Failure running rule: RATE_LIMIT due to unable 
       to generate fingerprint: error generating identifier - 
       requested a user-defined `email` characteristic but the 
       `email` value was empty */
  characteristics: ['emailId'],
} as const satisfies TokenBucketRateLimitOptions<['emailId']>;
