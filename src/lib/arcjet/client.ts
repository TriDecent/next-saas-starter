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
  emailSettings,
  extremeRestrictiveRateLimitSettings,
  laxRateLimitSettings,
  restrictiveRateLimitSettings,
} from './configs';

const ARCJET_KEY = ENV.ARCJET_KEY;
// Authenticated users - track by userId only
const getAjAuthenticated = () =>
  arcjet({
    key: ARCJET_KEY,
    characteristics: ['userId', 'action'],
    rules: [shield({ mode: arcjetMode })],
  });

// Anonymous users - track by IP only
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
  getAjAnonymous().withRule(
    protectSignup({
      email: emailSettings,
      bots: botSettings,
      rateLimit: restrictiveRateLimitSettings,
    })
  )
);

export const ajEmailSend = lazySingleton(() =>
  getAjAnonymous()
    .withRule(detectBot(botSettings))
    .withRule(
      tokenBucket({
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
      })
    )
);
