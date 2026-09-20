import { CreateInvitationModal } from '@/features/invitations';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/components/ui';
import { FaBuilding } from 'react-icons/fa6';
import { FiMail, FiPenTool, FiPlus } from 'react-icons/fi';
import { UpdateOrgModal } from '../update-org';

export function OrgQuickActions({ render }: { render?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm'>Quick actions</CardTitle>
        <CardDescription className='text-xs'>
          Perform common actions for your organization
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className='flex flex-col gap-3'>
        <UpdateOrgModal
          renderTrigger={
            <Button className='w-full justify-start' variant='outline'>
              <FiPenTool className='size-4' />
              Edit organization
            </Button>
          }
        />

        <CreateInvitationModal
          mode='multi-step'
          renderTrigger={
            <Button className='w-full justify-start' variant='outline'>
              <FiPlus className='size-4' />
              Add member
            </Button>
          }
        />

        <CreateInvitationModal
          mode='multi-step'
          renderTrigger={
            <Button className='w-full justify-start' variant='outline'>
              <FiMail className='size-4' />
              Send invitation
            </Button>
          }
        />

        {render}

        <Separator />

        <Button className='w-full justify-start' variant='outline'>
          <FaBuilding className='size-4' />
          Organization settings
        </Button>
      </CardContent>
    </Card>
  );
}
