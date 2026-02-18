import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/components/ui';

export function InvitationApproval() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Actions</CardTitle>
        <CardDescription>
          Accept or decline the invitation to join this organization.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Button className='w-full' disabled>
          Approve Invitation
        </Button>
        <Button variant='secondary' className='w-full' disabled>
          Request Changes
        </Button>
        <Button variant='destructive' className='w-full' disabled>
          Reject Invitation
        </Button>

        <Separator />

        <p className='text-muted-foreground text-center text-xs'>
          Some actions may be irreversible.
        </p>
      </CardContent>
    </Card>
  );
}
