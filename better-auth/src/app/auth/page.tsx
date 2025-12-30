import { AuthCardSelection } from '@/features/auth';
import { SectionHeader } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { GiBorderedShield } from 'react-icons/gi';

export const metadata: Metadata = ROUTES.auth.metadata;

export default function AuthPage() {
  return (
    <section className='space-y-8'>
      <SectionHeader
        icon={GiBorderedShield}
        title='Authentication'
        description='Sign in to your account or create a new one to get started'
      />

      <AuthCardSelection />
    </section>
  );
}
