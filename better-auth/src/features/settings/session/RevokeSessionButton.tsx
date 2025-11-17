'use client';
import { ActionButton } from '@/shared/components';
import type { Session } from 'better-auth';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { revokeSessionAction } from './revoke-session-action';

export function RevokeSessionButton({ token }: { token: Session['token'] }) {
  return (
    <ActionButton
      variant={'destructive'}
      size={'icon-sm'}
      action={() => revokeSessionAction(token)}
      onSuccess={() =>
        toast.success('Session revoked', {
          description: 'The session was successfully revoked.',
        })
      }
      onError={error =>
        toast.error('Failed to revoke session', {
          description:
            error instanceof Error
              ? error.message
              : 'An error occurred while revoking the session.',
        })
      }
    >
      <Trash2 />
    </ActionButton>
  );
}
