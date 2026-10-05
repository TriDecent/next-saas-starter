import type { GetInvitationResponse } from '@/features/organizations/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { format } from 'date-fns';
import { Building2, CalendarClock, Mail, User2 } from 'lucide-react';
import type React from 'react';

type InvitationData = Extract<
  GetInvitationResponse,
  { type: 'success' }
>['payload'];

export function InvitationDetails({
  invitation,
}: {
  invitation: InvitationData;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation Details</CardTitle>
        <CardDescription>
          Details about who invited you and the organization you are being
          invited to join.
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4 sm:grid-cols-2'>
        <DetailItem
          icon={<Mail />}
          title='Invited Email'
          description={invitation.email}
        />

        <DetailItem
          icon={<User2 />}
          title='Inviter'
          description={invitation.inviterEmail}
        />

        <DetailItem
          icon={<Building2 />}
          title='Organization'
          description={
            <>
              <span className='text-muted-foreground block text-sm'>
                {invitation.organizationName}
              </span>
              <span className='text-muted-foreground block text-xs'>
                Slug: {invitation.organizationSlug}
              </span>
            </>
          }
        />

        <DetailItem
          icon={<CalendarClock />}
          title='Timeline'
          description={
            <>
              <span className='text-muted-foreground block text-xs'>
                Created: {formateDate(invitation.createdAt)}
              </span>
              <span className='text-muted-foreground block text-xs'>
                Expires: {formateDate(invitation.expiresAt)}
              </span>
            </>
          }
        />
      </CardContent>
    </Card>
  );
}

const formateDate = (date: Date) => format(date, 'MMM d, yyyy p (zzz)');

function DetailItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string | React.ReactNode;
}) {
  return (
    <Item
      className='border-border flex-nowrap rounded-md border shadow'
      size={'sm'}
    >
      <ItemMedia variant={'icon'} className='text-muted-foreground'>
        {icon}
      </ItemMedia>
      <ItemContent className='w-full min-w-0'>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription className='line-clamp-none truncate'>
          {description}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
