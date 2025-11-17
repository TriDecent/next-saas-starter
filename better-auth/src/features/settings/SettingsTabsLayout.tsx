'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { FaLink } from 'react-icons/fa6';
import { IoKey, IoPerson, IoShield, IoTrashBin } from 'react-icons/io5';

const SETTINGS_ROUTES = [
  { path: ROUTES.settings.nested.profile.href, icon: <IoPerson /> },
  { path: ROUTES.settings.nested.security.href, icon: <IoShield /> },
  { path: ROUTES.settings.nested.sessions.href, icon: <IoKey /> },
  { path: ROUTES.settings.nested.accounts.href, icon: <FaLink /> },
  { path: ROUTES.settings.nested.danger.href, icon: <IoTrashBin /> },
] as const;

export function SettingsTabsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <Tabs
      defaultValue={
        SETTINGS_ROUTES.some(route => route.path === pathname)
          ? pathname
          : '/profile'
      }
      className='min-h-screen items-center gap-y-4'
    >
      <TabsList className='w-full max-w-xl'>
        {SETTINGS_ROUTES.map(route => (
          <TabsTrigger key={route.path} value={route.path} asChild>
            <Link href={route.path}>{route.icon}</Link>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent
        value={
          SETTINGS_ROUTES.some(route => route.path === pathname)
            ? pathname
            : '/profile'
        }
        className='mx-auto w-full max-w-xl'
      >
        {children}
      </TabsContent>
    </Tabs>
  );
}
