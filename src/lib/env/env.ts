import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.url(),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),

  // Arcjet
  ARCJET_KEY: z.string().min(1),

  // Social Providers
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),

  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  X_CLIENT_ID: z.string().min(1),
  X_CLIENT_SECRET: z.string().min(1),

  // Resend
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),

  // Metadata
  NEXT_PUBLIC_BASE_URL: z.url(),

  // JWT
  SUDO_CLIENT_ACTION_PUBLIC_KEY: z.string().min(1),
  SUDO_CLIENT_ACTION_PRIVATE_KEY: z.string().min(1),
  ISSUER: z.string().min(1),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),

  STRIPE_STANDARD_SUBSCRIPTION_MONTHLY_PRICE_ID: z.string().min(1),
  STRIPE_STANDARD_SUBSCRIPTION_YEARLY_PRICE_ID: z.string().min(1),

  STRIPE_PRO_SUBSCRIPTION_MONTHLY_PRICE_ID: z.string().min(1),
  STRIPE_PRO_SUBSCRIPTION_YEARLY_PRICE_ID: z.string().min(1),

  STRIPE_ENTERPRISE_SUBSCRIPTION_MONTHLY_PRICE_ID: z.string().min(1),
  STRIPE_ENTERPRISE_SUBSCRIPTION_YEARLY_PRICE_ID: z.string().min(1),

  // Passkey
  PASSKEY_RP_ID: z.string().min(1),
  PASSKEY_RP_NAME: z.string().min(1),
  PASSKEY_ORIGIN: z.string().min(1),
});

export const ENV = envSchema.parse(process.env);
