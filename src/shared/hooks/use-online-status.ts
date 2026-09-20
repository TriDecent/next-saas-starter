'use client';

import { useSyncExternalStore } from 'react';

export function useOnlineStatus(): boolean {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );
  return isOnline;
}

function subscribe(onStoreChange: () => void) {
  const controller = new AbortController();
  window.addEventListener('online', onStoreChange, {
    signal: controller.signal,
  });
  window.addEventListener('offline', onStoreChange, {
    signal: controller.signal,
  });

  return () => {
    controller.abort();
  };
}
