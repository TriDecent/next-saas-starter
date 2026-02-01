'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { Variants } from '../animation';

export type ModalHandle = Readonly<{
  open: () => void;
}>;

type ModalProps = Readonly<{
  onClose?: () => void;
  children: React.ReactNode;
  ref: Ref<ModalHandle>;
}>;

export function Modal({ children, onClose, ref }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
  }));

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    document.addEventListener('click', handleClickOutsideModal, {
      signal: controller.signal,
    });
    document.body.classList.add('overflow-hidden');

    return () => {
      document.removeEventListener('click', handleClickOutsideModal);
      document.body.classList.remove('overflow-hidden');
    };

    function handleClickOutsideModal(e: MouseEvent): void {
      if (dialogRef.current !== e.target) return;
      setIsOpen(false);
      onClose?.();
    }
  }, [isOpen, onClose]);

  useEffect(() => setIsMounted(true), []);

  return isMounted
    ? createPortal(
        <AnimatePresence>
          {isOpen ? (
            <motion.dialog
              ref={dialogRef}
              variants={Variants.slide.variant(0, 50)}
              initial={Variants.slide.key.hidden}
              animate={Variants.slide.key.visible}
              exit={Variants.slide.key.safelyHidden}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              onAnimationStart={definition => {
                if (definition !== Variants.slide.key.visible) return;
                dialogRef.current?.showModal();
              }}
              onCancel={e => {
                e.preventDefault();
                setIsOpen(false);
                onClose?.();
              }}
              className='mx-auto my-auto w-4/5 max-w-2xl rounded-lg bg-transparent p-4 select-none backdrop:backdrop-blur-sm'
            >
              {children}
            </motion.dialog>
          ) : null}
        </AnimatePresence>,
        document.getElementById('modal')!
      )
    : null;
}
