'use cache';

import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { notFound } from 'next/navigation';

export const metadata: Metadata = ROUTES['not-found'].metadata;

export default async function OtherSettingsPages() {
  cacheLife('weeks');

  return notFound();
}
