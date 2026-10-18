'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { useBreakpoint } from '@/shared/hooks/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { BsCreditCardFill } from 'react-icons/bs';
import { FaLink } from 'react-icons/fa6';
import { IoKey, IoPerson, IoShield, IoTrashBin } from 'react-icons/io5';

const SETTINGS_ROUTES = [
  { path: ROUTES.settings.nested.profile.href, icon: <IoPerson /> },
  { path: ROUTES.settings.nested.security.href, icon: <IoShield /> },
  { path: ROUTES.settings.nested.sessions.href, icon: <IoKey /> },
  { path: ROUTES.settings.nested.accounts.href, icon: <FaLink /> },
  {
    path: ROUTES.settings.nested.subscription.href,
    icon: <BsCreditCardFill />,
  },
  { path: ROUTES.settings.nested.danger.href, icon: <IoTrashBin /> },
] as const;

export function SettingsTabsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const breakpoint = useBreakpoint();

  return (
    <Tabs
      value={
        SETTINGS_ROUTES.some(route => route.path === pathname)
          ? pathname
          : ROUTES.settings.nested.profile.href
      }
      orientation={
        breakpoint !== 'sm' && breakpoint !== 'md' ? 'vertical' : 'horizontal'
      }
      className='min-h-screen flex-col items-center gap-y-4 lg:flex-row lg:items-start'
    >
      <TabsList className='w-full max-w-3xl flex-row shadow lg:sticky lg:top-32 lg:order-2 lg:w-fit lg:flex-col'>
        {SETTINGS_ROUTES.map(route => (
          <TabsTrigger
            key={route.path}
            value={route.path}
            nativeButton={false}
            className='lg:w-full lg:flex-none lg:justify-start'
            render={<Link href={route.path}>{route.icon}</Link>}
          />
        ))}
      </TabsList>

      <div className='h-full w-full flex-1'>
        <TabsContent
          value={
            SETTINGS_ROUTES.some(route => route.path === pathname)
              ? pathname
              : ROUTES.settings.nested.profile.href
          }
          className='mx-auto w-full max-w-3xl lg:order-1'
        >
          {children}
        </TabsContent>
      </div>
    </Tabs>
  );
}
