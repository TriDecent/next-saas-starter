import type { Organization } from '@/generated/prisma/client';
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Separator,
} from '@/shared/components/ui';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import {
  FaBuilding,
  FaCog,
  FaLink,
  FaPlus,
  FaUserFriends,
} from 'react-icons/fa';

type OrganizationRow = Organization & {
  membersCount?: number;
  roleLabel?: string;
};

export function MyOrganizations({
  organizations,
}: {
  organizations: OrganizationRow[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-end gap-x-2'>
          <span>Your organizations</span>
          <Badge variant={'outline'}>5</Badge>
        </CardTitle>

        <CardDescription>
          Switch between orgs, manage members, and permissions.
        </CardDescription>

        <CardAction>
          <Button asChild>
            <Link href='/organizations/new' className='gap-2'>
              <FaPlus className='size-4' />
              Create
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent className='pt-6'>
        {organizations.length === 0 ? (
          <EmptyOrganization />
        ) : (
          <ItemGroup className='gap-3'>
            {organizations.map(organization => (
              <OrganizationDisplay
                key={organization.id}
                organization={organization}
              />
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyOrganization() {
  return (
    <Empty className='border'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <FaBuilding className='text-primary size-5' />
        </EmptyMedia>
        <EmptyTitle>No organizations yet</EmptyTitle>
        <EmptyDescription>
          Create your first organization to invite members and manage access.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href='/organizations/new' className='gap-2'>
            <FaPlus className='size-4' />
            Create organization
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function OrganizationDisplay({
  organization,
}: {
  organization: OrganizationRow;
}) {
  const href = `/organizations/${organization.slug}`;
  const settingsHref = `/organizations/${organization.slug}/settings`;

  return (
    <Item
      key={organization.id}
      variant='outline'
      className='group hover:bg-muted/40 shadow transition-colors duration-300'
    >
      <ItemMedia variant='image' className='overflow-hidden rounded-lg shadow'>
        {organization.logo ? (
          <Image
            fill
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
          <span className='truncate'>{organization.name}</span>
        </ItemTitle>

        <ItemDescription className='flex flex-wrap items-center gap-x-3 gap-y-1'>
          <span className='truncate'>/{organization.slug}</span>

          <span className='hidden sm:inline'>•</span>

          <span>Created {formatDate(organization.createdAt)}</span>

          <span className='hidden sm:inline'>•</span>

          <span className='inline-flex items-center gap-1 whitespace-nowrap'>
            <FaUserFriends className='size-3.5' />
            {organization.membersCount}
          </span>

          <span className='hidden sm:inline'>•</span>

          <Badge variant={'outline'} className='text-muted-foreground'>
            {organization.roleLabel}
          </Badge>
        </ItemDescription>
      </ItemContent>

      <ItemActions className='ml-auto'>
        <Button variant='outline' size='sm' asChild>
          <Link href={settingsHref} className='gap-2'>
            <FaCog className='size-4' />
            Settings
          </Link>
        </Button>

        <Button variant='outline' size='sm' asChild>
          <Link href={href} className='gap-2'>
            <FaLink className='size-4' />
            Open
          </Link>
        </Button>
      </ItemActions>
    </Item>
  );
}

function formatDate(date: Date) {
  return format(date, 'MMM dd, yyyy');
}

function initials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(part => part);

  const a = parts[0][0] ?? 'O';
  const b = parts[1][0] ?? parts[0][1] ?? '';
  return (a + b).toUpperCase();
}
