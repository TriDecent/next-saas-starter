import type { User } from '@/generated/prisma/client';
import { getAuthService } from '@/infrastructure/service';
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
import { getInitials } from '@/shared/utils';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { GoOrganization } from 'react-icons/go';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { SignOutButton } from './SignOutButton';

export async function Home() {
  const actor = (await getAuthService()).actor;

  return actor ? (
    <div className='mx-auto space-y-3'>
      <p className='text-muted-foreground'>
        You are signed in as{' '}
        <span className='text-foreground font-semibold'>{actor.name}</span>
      </p>

      <div className='flex flex-col items-center gap-2'>
        <UserDropdownNav user={actor} />
        <span className='text-muted-foreground text-xs'>
          Click on the avatar to open the menu
        </span>
      </div>
    </div>
  ) : (
    <Button variant={'default'} size={'lg'} asChild>
      <Link href={ROUTES.auth.href}>Sign In / Sign Up</Link>
    </Button>
  );
}

function UserDropdownNav({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='border-border ring-primary/50 relative size-14 rounded-full border shadow transition-all hover:ring-2'
        >
          <Avatar className='size-14'>
            <AvatarImage src={user.image ?? ''} alt={user.name} />
            <AvatarFallback className='text-lg font-bold'>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='center'>
        <DropdownMenuLabel>
          <UserSummary name={user.name} email={user.email} image={user.image} />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
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
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className='cursor-pointer p-0'>
          <SignOutButton />
        </DropdownMenuItem>
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
    <DropdownMenuItem asChild className='cursor-pointer'>
      <Link href={href}>{children}</Link>
    </DropdownMenuItem>
  );
}
