'use client';

import { ActionButton } from '@/shared/components/client';
import type { Session } from 'better-auth';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { revokeSessionAction } from './revoke-session-action';

export function RevokeSessionButton({
  token,
  onRevoke,
}: {
  token: Session['token'];
  onRevoke?: () => void;
}) {
  return (
    <ActionButton
      variant={'destructive'}
      size={'icon-lg'}
      action={async () => {
        onRevoke?.();
        toast.loading('Revoking session...', {
          id: `revoke-${token}`,
          description: 'Please wait while the session is being revoked.',
        });
        await revokeSessionAction(token);
      }}
      confirm={{
        message: 'Are you sure you want to revoke this session?',
        description: 'This action cannot be undone.',
      }}
      onSuccess={() => {
        toast.success('Session revoked', {
          id: `revoke-${token}`,
          description: 'The session has been successfully revoked.',
        });
      }}
      onError={() => {
        toast.error('Failed to revoke session', {
          id: `revoke-${token}`,
          description: 'An error occurred while revoking the session.',
        });
      }}
    >
      <Trash2 />
    </ActionButton>
  );
}
