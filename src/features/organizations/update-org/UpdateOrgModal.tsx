import { RenderModal } from '@/shared/components/client';
import type React from 'react';
import { UpdateOrgCard } from './UpdateOrgCard';

export function UpdateOrgModal({
  renderTrigger,
}: {
  renderTrigger: React.ReactNode;
}) {
  return (
    <RenderModal renderTrigger={renderTrigger}>
      <UpdateOrgCard />
    </RenderModal>
  );
}
