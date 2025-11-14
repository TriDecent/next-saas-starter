import { ResetPasswordCard } from '@/features/auth/reset-password';
import { UpdatePasswordCard } from '@/features/auth/reset-password/UpdatePasswordCard';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import z from 'zod';

export const metadata: Metadata = ROUTES.auth.nested['reset-password'].metadata;

const searchParamsSchema = z.object({ token: z.string() });

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  const parsedSearchParamsResult = searchParamsSchema.safeParse(
    await searchParams
  );

  return (
    <section className='space-y-8'>
      <h2 className='text-xl font-medium tracking-wider'>
        Reset your password
      </h2>
      <div className='mx-auto max-w-xl'>
        {parsedSearchParamsResult.success ? (
          <UpdatePasswordCard token={parsedSearchParamsResult.data.token} />
        ) : (
          <ResetPasswordCard />
        )}
      </div>
    </section>
  );
}
