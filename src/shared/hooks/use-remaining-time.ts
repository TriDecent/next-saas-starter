'use client';

import { useCallback, useSyncExternalStore } from 'react';

export function useRemainingTime({ expiresAtMs }: { expiresAtMs: number }) {
  const handleTick = useCallback((onStoreChange: () => void) => {
    const intervalId = setInterval(onStoreChange, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getSnapshot = useCallback(
    () => Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000)),
    [expiresAtMs]
  );

  const getServerSnapshot = useCallback(() => 0, []);

  const secondsRemaining = useSyncExternalStore(
    handleTick,
    getSnapshot,
    getServerSnapshot
  );

  return {
    secondsRemaining,
    formattedTime: formatDuration(secondsRemaining),
  };
}

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));

  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds % 3600) / 60);
  const second = seconds % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  return hour > 0
    ? `${hour}:${pad(minute)}:${pad(second)}`
    : `${pad(minute)}:${pad(second)}`;
}
