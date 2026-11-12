'use client';

import { cn } from 'cn';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useScrollProgress } from '../hooks/use-scroll-progress';
import { Button } from './ui';

export function BackToTopButton({ className }: { className?: string }) {
  const progress = useScrollProgress();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode='wait'>
      {progress > 5 ? (
        <Button
          variant='outline'
          size='icon-lg'
          onClick={handleBackToTop}
          render={
            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: 'spring' }}
              className='transition-none!'
            />
          }
          className={cn(
            `relative rounded-full p-5.5 backdrop-blur-xs`,
            className
          )}
        >
          <ArrowUp />

          <svg
            viewBox='0 0 100 100'
            className='pointer-events-none absolute inset-0 size-full -rotate-90'
          >
            <circle
              cx='50'
              cy='50'
              r='43'
              fill='none'
              stroke='currentColor'
              strokeWidth='5'
              className='text-muted-foreground/20'
            />

            <circle
              cx='50'
              cy='50'
              r='43'
              fill='none'
              stroke='currentColor'
              strokeWidth='5'
              pathLength='100'
              strokeDasharray='100'
              strokeDashoffset={100 - progress}
              strokeLinecap='round'
              className='text-foreground'
            />
          </svg>
        </Button>
      ) : null}
    </AnimatePresence>
  );
}
