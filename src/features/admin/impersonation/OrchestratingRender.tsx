'use client';

import { Variants } from '@/shared/animation';
import { useScrollDirection } from '@/shared/hooks/client';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function OrchestratingRender({
  first,
  second,
}: {
  first: ReactNode;
  second: ReactNode;
}) {
  const scrollDirection = useScrollDirection();

  return (
    <AnimatePresence>
      {scrollDirection !== 'down' ? (
        <motion.div
          variants={Variants.slide.variant(0, -30)}
          initial={Variants.slide.key.hidden}
          animate={Variants.slide.key.visible}
          exit={Variants.slide.key.safelyHidden}
          transition={{ type: 'spring' }}
          key='first'
          className='fixed inset-x-0 top-20 z-9999'
        >
          {first}
        </motion.div>
      ) : null}

      {scrollDirection !== 'down' ? (
        <motion.div
          variants={Variants.slide.variant(0, 30)}
          initial={Variants.slide.key.hidden}
          animate={Variants.slide.key.visible}
          exit={Variants.slide.key.safelyHidden}
          transition={{ type: 'spring' }}
          key='second'
          className='fixed inset-x-0 bottom-6 z-9999'
        >
          {second}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
