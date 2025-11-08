import { ErrorBlock } from '@/features/shared/components';
import z from 'zod';

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  const parsedResult = paramsSchema.safeParse(await searchParams);

  return (
    <section className='flex justify-center'>
      {parsedResult.success ? (
        <ErrorBlock
          message={parsedResult.data.message}
          action={{
            type: 'link',
            href: parsedResult.data.callbackUrl,
            text: 'Go back',
          }}
        />
      ) : (
        <ErrorBlock message='Please try again' />
      )}
    </section>
  );
}

const paramsSchema = z.object({ message: z.string(), callbackUrl: z.string() });
