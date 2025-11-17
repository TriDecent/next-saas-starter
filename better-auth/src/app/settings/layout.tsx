'use cache';
import { SettingsTabsLayout } from '@/features/settings';
import { Loading } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { Suspense, type ReactNode } from 'react';
import { CgProfile } from 'react-icons/cg';

export const metadata: Metadata = ROUTES.settings.metadata;

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  cacheLife('weeks');

  return (
    <section className='space-y-8'>
      <h2 className='flex items-center gap-2 text-2xl font-semibold tracking-wider'>
        <CgProfile className='text-primary text-3xl' />
        <span>My settings</span>
      </h2>

      <Suspense fallback={<Loading />}>
        <SettingsTabsLayout>{children}</SettingsTabsLayout>
      </Suspense>
    </section>
  );
}
