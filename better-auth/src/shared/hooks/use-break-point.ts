import { useSyncExternalStore } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const getBreakpoint = (): Breakpoint => {
  const w = window.innerWidth;
  if (w >= 1536) return '2xl';
  if (w >= 1280) return 'xl';
  if (w >= 1024) return 'lg';
  if (w >= 768) return 'md';
  return 'sm';
};

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

const getClientSnapshot = () => getBreakpoint();
const getServerSnapshot = () => 'sm';

export function useBreakpoint() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
