'use client';

import { useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 125,
    damping: 30,
  });

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', v => {
      setProgress(v * 100);
    });

    return unsubscribe;
  }, [smoothProgress]);

  return progress;
}
