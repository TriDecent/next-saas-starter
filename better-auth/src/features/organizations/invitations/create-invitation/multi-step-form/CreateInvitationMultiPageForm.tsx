'use client';

import { useOrgContext } from '@/features/organizations/[slug]/context';
import { OrganizationItem } from '@/features/organizations/my-organizations';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  FieldDescription,
  FieldSet,
  FieldTitle,
  Progress,
} from '@/shared/components/ui';
import { useMemo, useState } from 'react';
import {
  HiCheckCircle,
  HiOfficeBuilding,
  HiUser,
  HiUserGroup,
} from 'react-icons/hi';
import { SelectRecipientField, SelectRoleField } from '../_shared';
import { BaseCreateInvitationForm } from '../_shared/CreateInvitationForm';

export function CreateInvitationMultiPageForm() {
  const selectedOrg = useOrgContext();
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const stepMeta = useMemo(
    () =>
      [
        {
          title: 'Organization',
          description: 'Confirm the organization to send invitation from.',
          icon: <HiOfficeBuilding className='size-4' />,
        },
        {
          title: 'Recipient',
          description: 'Choose who should receive this invitation.',
          icon: <HiUser className='size-4' />,
        },
        {
          title: 'Role',
          description: 'Set the access level for the invited user.',
          icon: <HiUserGroup className='size-4' />,
        },
      ] as const,
    []
  );

  const isFirst = step === 0;
  const isLast = step === 2;
  const progress = ((step + 1) / stepMeta.length) * 100;

  const STEPS = useMemo(
    () =>
      ({
        0: (
          <OrganizationItem
            organization={{
              ...selectedOrg,
              logo: selectedOrg.logo ?? null,
              metadata: selectedOrg.metadata ?? null,
            }}
          />
        ),
        1: <SelectRecipientField recipients={[]} />,
        2: <SelectRoleField />,
      }) as const,
    [selectedOrg]
  );

  return (
    <BaseCreateInvitationForm shouldRenderSubmitButton={isLast}>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <Badge variant='secondary' className='gap-1'>
              {stepMeta[step].icon}
              Step {step + 1}/{stepMeta.length}
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

        <CardContent>
          <FieldSet>
            <FieldTitle className='text-base'>
              {stepMeta[step].title}
            </FieldTitle>
            <FieldDescription className='text-muted-foreground text-sm'>
              {stepMeta[step].description}
            </FieldDescription>

            {STEPS[step]}
          </FieldSet>
        </CardContent>

        <CardFooter className='flex items-center justify-between gap-2'>
          <Button
            type='button'
            variant='outline'
            disabled={isFirst}
            onClick={() => setStep(s => Math.max(0, s - 1) as 0 | 1 | 2)}
          >
            Back
          </Button>

          {!isLast ? (
            <Button
              type='button'
              onClick={() => setStep(s => Math.min(2, s + 1) as 0 | 1 | 2)}
            >
              Next
            </Button>
          ) : (
            <p className='text-muted-foreground text-xs'>
              Review once, then submit invitation.
            </p>
          )}
        </CardFooter>
      </Card>
    </BaseCreateInvitationForm>
  );
}
