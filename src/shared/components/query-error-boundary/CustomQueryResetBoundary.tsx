'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from './ErrorBoundary';

export function CustomQueryErrorResetBoundary({
  title,
  children,
}: {
  title: string;
  children: React.ReactElement;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          title={title}
          action={{ type: 'button', onClick: reset, text: 'Try again' }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
