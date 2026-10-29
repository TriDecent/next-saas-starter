'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from '@/shared/components/ui';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/client';
import { useBreakpoint } from '@/shared/hooks/client';
import React, { useState } from 'react';

export function DrawerDialog({
  title,
  description,
  content,
  trigger,
  className,
}: {
  trigger: React.ReactElement | string;
  title: string;
  description: string;
  content: React.ReactElement;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useBreakpoint() === 'sm';

  const renderTrigger =
    typeof trigger === 'string' ? (
      <Button variant='outline'>{title}</Button>
    ) : (
      trigger
    );

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen} showSwipeHandle={true}>
        <DrawerTrigger render={renderTrigger} className={className} />
        <DrawerContent>
          <DrawerHeader className='text-left'>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          <Separator className='mt-4' />

          <div className='p-4'>{content}</div>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={renderTrigger} className={className} />
      <DialogContent className='sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
}
