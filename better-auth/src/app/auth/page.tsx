import { AuthCardSelection } from '@/features/auth';
import { ROUTES } from '@/features/shared/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = ROUTES.auth.metadata;

export default function AuthPage() {
  return (
    <section className='space-y-8'>
      <h2 className='text-xl font-medium'>Authentication page</h2>
      <AuthCardSelection />
    </section>
  );
}
