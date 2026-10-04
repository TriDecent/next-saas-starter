'use client';

import { catchError, type ErrorInfo } from 'next/error';
import { ErrorBlock, type ErrorBlockProps } from '../ErrorBlock';

export const ErrorBoundary = catchError(
  ({ message, title, action }: ErrorBlockProps, errorInfo: ErrorInfo) => {
    const displayMessage =
      message ??
      (errorInfo?.error instanceof Error ? errorInfo.error.message : null) ??
      'An unexpected error has occurred';

    const handleRetry = () => {
      if (action?.type !== 'button') return;

      // reset TanStack Query cache status
      action.onClick();

      // clear React error state and re-render subtree
      errorInfo.retry();
    };

    const resolvedAction =
      action?.type === 'link'
        ? action
        : {
            type: 'button' as const,
            onClick: handleRetry,
            text: action?.text ?? 'Try again',
          };

    return (
      <ErrorBlock
        title={title}
        message={displayMessage}
        action={resolvedAction}
      />
    );
  }
);
