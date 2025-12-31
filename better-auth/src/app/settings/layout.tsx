'use cache';

import { SettingsTabsLayout } from '@/features/settings';
import { Loading, SectionHeader } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { Settings } from 'lucide-react';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { Suspense, type ReactNode } from 'react';

export const metadata: Metadata = ROUTES.settings.metadata;

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  cacheLife('weeks');

  return (
    <section className='space-y-8'>
      <SectionHeader
        icon={Settings}
        title='Settings'
        description='Manage your account settings and preferences'
      />

      <SettingsTabsLayout>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </SettingsTabsLayout>
    </section>
  );
}
