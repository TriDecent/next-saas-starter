import { ResetPasswordCard } from '@/features/auth/reset-password';
import { UpdatePasswordCard } from '@/features/auth/reset-password/UpdatePasswordCard';
import { Loading, SectionHeader } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { KeyRound } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import z from 'zod';

export const metadata: Metadata = ROUTES.auth.nested['reset-password'].metadata;

const searchParamsSchema = z.object({ token: z.string() });

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  return (
    <section className='space-y-8'>
      <SectionHeader icon={KeyRound} title='Reset Your Password' />

      <div className='mx-auto max-w-xl'>
        <Suspense fallback={<Loading />}>
          <Wrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}

async function Wrapper({ searchParams }: { searchParams: Promise<unknown> }) {
  const parsedSearchParamsResult = searchParamsSchema.safeParse(
    await searchParams
  );

  return parsedSearchParamsResult.success ? (
    <UpdatePasswordCard token={parsedSearchParamsResult.data.token} />
  ) : (
    <ResetPasswordCard />
  );
}
