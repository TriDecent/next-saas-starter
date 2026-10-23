import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = ROUTES['not-found'].metadata;

export const instant = false;

export default async function OtherSettingsPages() {
  return notFound();
}
