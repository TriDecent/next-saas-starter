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
import { FiMail, FiPlus } from 'react-icons/fi';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm'>Quick actions</CardTitle>
        <CardDescription className='text-xs'>
          UI only. Wire actions later.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className='space-y-3'>
        <Button className='w-full justify-start' variant='outline'>
          <FiPlus className='size-4' />
          Add member
        </Button>
        <Button className='w-full justify-start' variant='outline'>
          <FiMail className='size-4' />
          Send invitation
        </Button>
        <Separator />
        <Button className='w-full justify-start' variant='outline'>
          <FaBuilding className='size-4' />
          Organization settings
        </Button>
      </CardContent>
    </Card>
  );
}
