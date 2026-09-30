'use client';

import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { useBreakpoint } from '../hooks/use-break-point';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/client';

type DrawerOpenerProps = {
  title: string;
  description: string;
  trigger: ReactElement;
  action?: ReactNode;
  children: ReactNode;
} & ComponentProps<typeof Drawer>;

export function DrawerOpener(props: DrawerOpenerProps) {
  const breakpoint = useBreakpoint();

  return (
    <Drawer
      {...props}
      showSwipeHandle={true}
      swipeDirection={breakpoint === 'sm' ? 'down' : 'right'}
    >
      <DrawerTrigger render={props.trigger} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>{props.description}</DrawerDescription>
        </DrawerHeader>

        <div className='flex-1 overflow-y-auto p-4'>{props.children}</div>

        {props.action ? <DrawerFooter>{props.action}</DrawerFooter> : null}
      </DrawerContent>
    </Drawer>
  );
}
