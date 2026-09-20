import { ENV } from '@/lib/env';
import Stripe from 'stripe';

export const stripeClient = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
});
