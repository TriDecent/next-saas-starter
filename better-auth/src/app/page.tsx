import { Home } from '@/features/home';
import { MiniLoader } from '@/features/shared/components';
import { ROUTES } from '@/features/shared/constants';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = ROUTES.home.metadata;

export default async function HomePage() {
  return (
    <section className='flex flex-col items-center gap-y-8'>
      <h2 className='text-xl font-medium tracking-wider'>
        Welcome to Better Auth Demo
      </h2>
      <Suspense fallback={<MiniLoader />}>
        <Home />
      </Suspense>
    </section>
  );
}
