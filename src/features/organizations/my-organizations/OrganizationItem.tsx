import type { OrganizationWithRole } from '@/infrastructure/repositories/organization';
import {
  Badge,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { cn } from '@/shared/utils';
import { format } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { FaUserFriends } from 'react-icons/fa';

export type OrganizationRow = Omit<
  OrganizationWithRole,
  'memberCounts' | 'currentUserRole' | 'stripeCustomerId'
> & {
  memberCounts?: number;
  currentUserRole?: string;
  isActive: boolean;
};

export function OrganizationItem({
  organization,
  renderActions,
}: {
  organization: OrganizationRow;
  renderActions?: React.ReactNode;
}) {
  return (
    <Item
      variant='outline'
      className={cn(
        'group shadow transition-colors duration-300',
        organization.isActive
          ? 'border-emerald-400 bg-emerald-400/5 hover:bg-emerald-400/10'
          : 'hover:bg-muted/40'
      )}
    >
      <ItemMedia
        variant='image'
        className='relative overflow-hidden rounded-lg shadow'
      >
        {organization.logo ? (
          <Image
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            src={organization.logo}
            alt={organization.name}
            className='rounded-lg object-cover'
          />
        ) : (
          <div className='bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg text-xs font-bold'>
            {initials(organization.name)}
          </div>
        )}
      </ItemMedia>

      <ItemContent>
        <ItemTitle className='min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='truncate'>{organization.name}</span>

            {organization.isActive ? (
              <Badge variant={'success'}>
                <CheckCircle2 />
                Active
              </Badge>
            ) : null}
          </div>
        </ItemTitle>

        <ItemDescription className='flex flex-wrap items-center gap-x-3 gap-y-1'>
          <span className='truncate'>/{organization.slug}</span>

          <span className='hidden sm:inline'>•</span>

          <span>Created {formatDate(organization.createdAt)}</span>

          {organization.memberCounts ? (
            <>
              <span className='hidden sm:inline'>•</span>

              <span className='inline-flex items-center gap-1 whitespace-nowrap'>
                <FaUserFriends className='size-3.5' />
                {organization.memberCounts}
              </span>
            </>
          ) : null}

          {organization.currentUserRole ? (
            <>
              <span className='hidden sm:inline'>•</span>

              <Badge variant='outline' className='text-muted-foreground'>
                {organization.currentUserRole}
              </Badge>
            </>
          ) : null}
        </ItemDescription>
      </ItemContent>

      <ItemActions className='ml-auto'>{renderActions}</ItemActions>
    </Item>
  );
}

function formatDate(date: Date) {
  return format(date, 'MMM dd, yyyy');
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return 'OO';

  const a = parts[0][0] ?? 'O';
  const b = parts[1]?.[0] ?? parts[0][1] ?? '';

  return (a + b).toUpperCase();
}
