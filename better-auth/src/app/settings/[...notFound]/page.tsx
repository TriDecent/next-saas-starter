import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = ROUTES['not-found'].metadata;

export default function OtherSettingsPages() {
  return notFound();
}
