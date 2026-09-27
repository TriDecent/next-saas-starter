'use client';

import type { AuthSession } from '@/lib/auth';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
  ScrollBar,
  Separator,
} from '@/shared/components/ui';
import { useState } from 'react';
import { EditProfileForm } from './EditProfileForm';

export function EditProfileDialog({ user }: { user: AuthSession['user'] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant={'outline'}>Edit Profile</Button>}
      />
      <DialogContent className='sm:max-w-125'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className='flex justify-center py-4'>
          <Avatar className='h-12 w-12 border-2'>
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className='text-3xl'>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <Separator />

        <ScrollArea className='max-h-96'>
          <ScrollBar />
          <EditProfileForm user={user} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
