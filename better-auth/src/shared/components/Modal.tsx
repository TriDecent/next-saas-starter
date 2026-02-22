'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useImperativeHandle, useState, type Ref } from 'react';
import { createPortal } from 'react-dom';
import { Variants } from '../animation';

export type ModalHandle = Readonly<{
  open: () => void;
  close: () => void;
}>;

type ModalProps = Readonly<{
  onClose?: () => void;
  children: React.ReactNode;
  ref: Ref<ModalHandle>;
}>;

export function Modal({ children, onClose, ref }: ModalProps) {
  const [shouldOpen, setShouldOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleClose = () => {
    setShouldOpen(false);
    onClose?.();
  };

  useImperativeHandle(ref, () => ({
    open: () => setShouldOpen(true),
    close: handleClose,
  }));

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!shouldOpen) return;
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [shouldOpen]);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {shouldOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className='fixed inset-0 bg-black/60'
            aria-hidden='true'
          />

          <motion.div
            role='dialog'
            aria-modal='true'
            variants={Variants.slide.variant(0, 50)}
            initial={Variants.slide.key.hidden}
            animate={Variants.slide.key.visible}
            exit={Variants.slide.key.safelyHidden}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className='relative z-10 mx-auto my-auto w-4/5 max-w-2xl rounded-lg bg-transparent p-4 select-none'
          >
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.getElementById('modal')!
  );
}
