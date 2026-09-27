import type { User } from '@/generated/prisma/client';
import { UserSummary } from '@/shared/components';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { cn, getInitials } from '@/shared/utils';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { GoOrganization } from 'react-icons/go';
import {
  MdInsertInvitation,
  MdOutlineAdminPanelSettings,
} from 'react-icons/md';
import { SignOutButton } from './SignOutButton';

export function UserDropdownNav({
  user,
  size = 'normal',
  align = 'center',
}: {
  user: User;
  size?: 'sm' | 'normal';
  align?: 'center' | 'start' | 'end' | undefined;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant='ghost'
            className={cn(
              'border-border ring-primary/50 relative size-14 rounded-full border shadow transition-all hover:ring-2',
              size === 'sm' ? 'size-10' : ''
            )}
          />
        }
      >
        <Avatar className={cn('size-14', size === 'sm' ? 'size-10' : '')}>
          <AvatarImage src={user.image ?? ''} alt={user.name} />
          <AvatarFallback
            className={cn(
              'text-xl font-bold',
              size === 'sm' ? 'text-base' : ''
            )}
          >
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className={'w-full'}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <UserSummary
              name={user.name}
              email={user.email}
              image={user.image}
            />
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <NavItem href={ROUTES.settings.href}>
            <CgProfile />
            Profile
          </NavItem>

          <NavItem href={ROUTES.admin.href}>
            <MdOutlineAdminPanelSettings />
            Admin
          </NavItem>

          <NavItem href={ROUTES.organizations.href}>
            <GoOrganization />
            Organizations
          </NavItem>

          <NavItem href={ROUTES.invitations.href}>
            <MdInsertInvitation />
            Invitations
          </NavItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className='cursor-pointer p-0'
          nativeButton={false}
          render={<SignOutButton />}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuItem
      className='cursor-pointer'
      nativeButton={false}
      render={<Link href={href}>{children}</Link>}
    />
  );
}
