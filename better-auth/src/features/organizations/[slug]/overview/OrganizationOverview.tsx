import type { GetOrgResponse } from '@/infrastructure/service/organization';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/components/ui';
import { FaTrash } from 'react-icons/fa';
import { GrOverview } from 'react-icons/gr';
import { DeleteOrgAction } from '../delete-org';
import { OrgIdentity } from './OrgIdentity';
import { QuickActions } from './QuickActions';

export type OrgOverviewProps = NonNullable<
  Extract<GetOrgResponse, { type: 'success' }>['payload']
>;

export function OrganizationOverview({ org }: { org: OrgOverviewProps }) {
  const pendingInvites = org.invitations.filter(
    invitation => invitation.status === 'pending'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <GrOverview />
          Overview
        </CardTitle>
        <CardDescription>
          Organization details, members, and invitations.
        </CardDescription>

        <CardAction>
          <DeleteOrgAlert>
            <DeleteOrgAction organizationId={org.id} />
          </DeleteOrgAlert>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <OrgIdentity
            org={org}
            members={org.members}
            pendingInvitesCount={pendingInvites.length}
          />
        </div>

        <QuickActions />
      </CardContent>
    </Card>
  );
}

function DeleteOrgAlert({ children }: { children: React.ReactNode }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} size={'lg'}>
          <FaTrash />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
            <FaTrash />
          </AlertDialogMedia>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            organization from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={'destructive'} asChild>
            {children}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
