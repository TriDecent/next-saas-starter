'use client';

import { Modal, type ModalHandle } from '@/shared/components';
import { useRef } from 'react';

export function RenderModal({
  children,
  renderTrigger,
}: {
  children: React.ReactNode;
  renderTrigger: React.ReactNode;
}) {
  const modalRef = useRef<ModalHandle | null>(null);

  return (
    <>
      <div onClick={() => modalRef.current?.open()} className='contents'>
        {renderTrigger}
      </div>
      <Modal ref={modalRef}>{children}</Modal>
    </>
  );
}
