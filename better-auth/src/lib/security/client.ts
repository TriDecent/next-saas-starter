import arcjet, {
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
  tokenBucket,
} from '@arcjet/next';
import {
  botSettings,
  emailSettings,
  extremeRestrictiveRateLimitSettings,
  laxRateLimitSettings,
  restrictiveRateLimitSettings,
} from './configs';

const arcjetMode = process.env.NODE_ENV === 'development' ? 'DRY_RUN' : 'LIVE';

// Authenticated users - track by userId only
const ajAuthenticated = arcjet({
  key: arcjetMode!,
  characteristics: ['userId', 'action'],
  rules: [shield({ mode: arcjetMode })],
});

// Anonymous users - track by IP only
const ajAnonymous = arcjet({
  key: arcjetMode,
  characteristics: ['ip.src', 'action'],
  rules: [shield({ mode: arcjetMode })],
});

export const ajLaxAuthenticated = ajAuthenticated
  .withRule(detectBot(botSettings))
  .withRule(slidingWindow(laxRateLimitSettings));

export const ajRestrictiveAuthenticated = ajAuthenticated
  .withRule(detectBot(botSettings))
  .withRule(slidingWindow(restrictiveRateLimitSettings));

export const ajExtremeRestrictiveAuthenticated = ajAuthenticated
  .withRule(detectBot(botSettings))
  .withRule(slidingWindow(extremeRestrictiveRateLimitSettings));

export const ajLaxAnonymous = ajAnonymous
  .withRule(detectBot(botSettings))
  .withRule(slidingWindow(laxRateLimitSettings));

export const ajRestrictiveAnonymous = ajAnonymous
  .withRule(detectBot(botSettings))
  .withRule(slidingWindow(restrictiveRateLimitSettings));

export const ajSignup = ajAnonymous.withRule(
  protectSignup({
    email: emailSettings,
    bots: botSettings,
    rateLimit: restrictiveRateLimitSettings,
  })
);

export const ajEmailSend = ajAnonymous
  .withRule(detectBot(botSettings))
  .withRule(
    tokenBucket({
      mode: 'LIVE',
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
  );
