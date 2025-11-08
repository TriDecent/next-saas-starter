'use client';

import { ErrorBlock } from '@/features/shared/components';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBlock
      message={error.message}
      action={{ type: 'button', onClick: reset, text: 'Try again' }}
    />
  );
}
