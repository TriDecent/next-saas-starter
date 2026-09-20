'use client';

import { Skeleton, Tabs, TabsList, TabsTrigger } from '@/shared/components/ui';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  if (!mounted) return <ThemeToggleSkeleton />;

  return (
    <Tabs value={theme} onValueChange={setTheme}>
      <TabsList>
        {themes.map(({ value, icon: Icon, label }) => (
          <TabsTrigger key={value} value={value} title={label}>
            <Icon className='size-4' />
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function ThemeToggleSkeleton() {
  return <Skeleton className='h-10 w-28 rounded-md' />;
}
