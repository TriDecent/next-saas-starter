import { Home } from '@/features/home';
import { MiniLoader, SectionHeader } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = ROUTES.home.metadata;

export default async function HomePage() {
  return (
    <section className='flex min-h-screen flex-col items-center gap-y-8'>
      <SectionHeader
        icon={Sparkles}
        title='Welcome to Identity Hub'
        description='Explore authentication features and security settings'
      />

      <Suspense fallback={<MiniLoader />}>
        <Home />
      </Suspense>
    </section>
  );
}
