import {
  type BotOptions,
  type EmailOptions,
  type SlidingWindowRateLimitOptions,
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

export const emailSettings = {
  mode: arcjetMode,
  deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
} as const satisfies EmailOptions;
