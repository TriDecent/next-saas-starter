import {
  type BotOptions,
  type EmailOptions,
  type SlidingWindowRateLimitOptions,
} from '@arcjet/next';

const arcjetMode = process.env.NODE_ENV === 'development' ? 'DRY_RUN' : 'LIVE';

export const botSettings: BotOptions = {
  mode: arcjetMode,
  allow: [],
};

export const restrictiveRateLimitSettings: SlidingWindowRateLimitOptions<[]> = {
  mode: arcjetMode,
  max: 10,
  interval: '10m',
};

export const extremeRestrictiveRateLimitSettings: SlidingWindowRateLimitOptions<
  []
> = {
  mode: arcjetMode,
  max: 3,
  interval: '1h',
};

export const laxRateLimitSettings: SlidingWindowRateLimitOptions<[]> = {
  mode: arcjetMode,
  max: 30,
  interval: '1m',
};

export const emailSettings: EmailOptions = {
  mode: arcjetMode,
  deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
};
