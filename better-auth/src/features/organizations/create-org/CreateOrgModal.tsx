'use client';

import { Modal, type ModalHandle } from '@/shared/components';
import { useRef } from 'react';
import { CreateNewOrganization } from './CreateNewOrganization';

export function CreateOrgModal({ children }: { children: React.ReactNode }) {
  const modalRef = useRef<ModalHandle | null>(null);

  return (
    <>
      <div onClick={() => modalRef.current?.open()}>{children}</div>
      <Modal ref={modalRef}>
        <CreateNewOrganization />
      </Modal>
    </>
  );
}
