import { Home } from '@/features/home';
import { ROUTES } from '@/features/shared/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = ROUTES.home.metadata;

export default function HomePage() {
  return (
    <section className='flex flex-col items-center gap-y-8'>
      <h2 className='text-xl font-medium tracking-wider'>
        Welcome to Better Auth Demo
      </h2>
      <Home />
    </section>
  );
}
