'use cache';

import { AuthCardSelection } from '@/features/auth/client';
import { MiniLoader, SectionHeader } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { Suspense } from 'react';
import { GiBorderedShield } from 'react-icons/gi';

export const metadata: Metadata = ROUTES.auth.metadata;

export default async function AuthPage() {
  cacheLife('weeks');

  return (
    <section className='space-y-8'>
      <SectionHeader
        icon={GiBorderedShield}
        title='Authentication'
        description='Sign in to your account or create a new one to get started'
      />

      <Suspense fallback={<MiniLoader />}>
        <AuthCardSelection />
      </Suspense>
    </section>
  );
}
