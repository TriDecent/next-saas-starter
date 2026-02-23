import { Badge, CardHeader, CardTitle, Progress } from '@/shared/components/ui';
import {
  HiCheckCircle,
  HiOfficeBuilding,
  HiUser,
  HiUserGroup,
} from 'react-icons/hi';

export function InvitationStepHeader({
  step,
  total,
  isLast,
}: {
  step: number;
  total: number;
  isLast: boolean;
}) {
  const meta = INVITATION_STEPS[step];
  const Icon = meta.icon;

  const progress = ((step + 1) / total) * 100;

  return (
    <CardHeader>
      <CardTitle className='flex items-center justify-between'>
        <Badge variant='secondary' className='gap-1'>
          <Icon className='size-4' />
          Step {step + 1}/{total}
        </Badge>

        {isLast ? (
          <Badge className='gap-1'>
            <HiCheckCircle className='size-4' />
            Ready to submit
          </Badge>
        ) : null}
      </CardTitle>

      <Progress value={progress} className='h-1.5' />
    </CardHeader>
  );
}

const INVITATION_STEPS = [
  {
    title: 'Organization',
    description: 'Confirm the organization to send invitation from.',
    icon: HiOfficeBuilding,
  },
  {
    title: 'Recipient',
    description: 'Choose who should receive this invitation.',
    icon: HiUser,
  },
  {
    title: 'Role',
    description: 'Set the access level for the invited user.',
    icon: HiUserGroup,
  },
] as const;
