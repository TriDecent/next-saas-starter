import { ErrorBlock } from '@/shared/components';
import {
  ERROR_DEFINITION,
  getErrorDefinition,
  ROUTES,
} from '@/shared/constants';
import type { Metadata } from 'next';
import z from 'zod';

export const metadata: Metadata = ROUTES.error.metadata;

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parsedResult = paramsSchema.safeParse(await searchParams);
  const error = getErrorDefinition(
    parsedResult.success ? parsedResult.data.code : 'GENERAL'
  );

  return (
    <section className='flex justify-center'>
      <ErrorBlock
        title={parsedResult.data?.error || error.title}
        message={`${error.description} ${parsedResult.data?.details}`}
        action={{
          type: 'link',
          href: parsedResult.data?.callbackUrl ?? ROUTES.home.href,
          text: 'Go back',
        }}
      />
    </section>
  );
}

const paramsSchema = z
  .object({
    code: z
      .literal(Object.values(ERROR_DEFINITION).map(error => error.code))
      .default('GENERAL'),
    details: z.string().optional(),
    callbackUrl: z.string().default(ROUTES.home.href),

    // better auth errors
    error: z.string().optional(),
    error_description: z.string().optional(),
  })
  .transform(data => ({
    code: data.code,
    details: data.error_description ?? data.details,
    callbackUrl: data.callbackUrl,

    // better auth errors
    error: data.error,
  }));
