import { ENV } from '@/lib/env';
import arcjet, {
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
  tokenBucket,
} from '@arcjet/next';
import { lazySingleton } from '../utils';
import {
  arcjetMode,
  botSettings,
  extremeRestrictiveRateLimitSettings,
  laxRateLimitSettings,
  restrictiveRateLimitSettings,
  signupOptions,
  tokenBucketOptions,
} from './configs';

const ARCJET_KEY = ENV.ARCJET_KEY;
// Authenticated users - track by userId and action
const getAjAuthenticated = () =>
  arcjet({
    key: ARCJET_KEY,
    characteristics: ['userId', 'action'],
    rules: [shield({ mode: arcjetMode })],
  });

// Anonymous users - track by IP and action
const getAjAnonymous = () =>
  arcjet({
    key: ARCJET_KEY,
    characteristics: ['ip.src', 'action'],
    rules: [shield({ mode: arcjetMode })],
  });

export const ajLaxAuthenticated = lazySingleton(() =>
  getAjAuthenticated()
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
);

export const ajRestrictiveAuthenticated = lazySingleton(() =>
  getAjAuthenticated()
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(restrictiveRateLimitSettings))
);

export const ajExtremeRestrictiveAuthenticated = lazySingleton(() =>
  getAjAuthenticated()
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(extremeRestrictiveRateLimitSettings))
);

export const ajLaxAnonymous = lazySingleton(() =>
  getAjAnonymous()
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
);

export const ajRestrictiveAnonymous = lazySingleton(() =>
  getAjAnonymous()
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(restrictiveRateLimitSettings))
);

export const ajSignup = lazySingleton(() =>
  getAjAnonymous().withRule(protectSignup(signupOptions))
);

export const ajEmailSend = lazySingleton(() =>
  getAjAnonymous()
    .withRule(detectBot(botSettings))
    .withRule(tokenBucket(tokenBucketOptions))
);
