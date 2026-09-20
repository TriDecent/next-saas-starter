'use client';

import { useScroll } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useScrollDirection(): 'up' | 'down' {
  const lastY = useRef<number>(0);
  const { scrollY } = useScroll();
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  const handleScroll = useCallback((y: number) => {
    setDirection(currentDirection => {
      if (y > lastY.current && currentDirection === 'up') return 'down';
      else if (y < lastY.current && currentDirection === 'down') return 'up';
      lastY.current = y;
      return currentDirection;
    });
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', handleScroll);
    return () => unsubscribe();
  }, [handleScroll, scrollY]);

  return direction;
}
