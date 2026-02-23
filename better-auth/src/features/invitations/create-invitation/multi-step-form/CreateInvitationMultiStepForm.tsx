'use client';

import { MiniLoader } from '@/shared/components';
import {
  Button,
  Card,
  CardContent,
  FieldDescription,
  FieldSet,
  FieldTitle,
} from '@/shared/components/ui';
import { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { HiOfficeBuilding, HiUser, HiUserGroup } from 'react-icons/hi';
import { BaseCreateInvitationForm } from '../_shared';
import { InvitationStepContent } from './InvitationStepContent';
import { InvitationStepFooter } from './InvitationStepFooter';
import { InvitationStepHeader } from './InvitationStepHeader';

export function CreateInvitationMultiStepForm() {
  const { step, isFirst, isLast, next, back } = useInvitationSteps();
  const meta = INVITATION_STEPS[step];

  return (
    <Card>
      <BaseCreateInvitationForm
        shouldRenderSubmitButton={false}
        renderActions={
          isLast
            ? isPending => (
                <div className='flex px-6 sm:justify-end'>
                  <SubmitButton isPending={isPending} />
                </div>
              )
            : undefined
        }
      >
        <InvitationStepHeader
          step={step}
          total={INVITATION_STEPS.length}
          isLast={isLast}
        />

        <CardContent>
          <FieldSet>
            <FieldTitle>{meta.title}</FieldTitle>
            <FieldDescription>{meta.description}</FieldDescription>

            <InvitationStepContent step={step} />
          </FieldSet>
        </CardContent>

        <InvitationStepFooter
          isFirst={isFirst}
          isLast={isLast}
          onBack={back}
          onNext={next}
        />
      </BaseCreateInvitationForm>
    </Card>
  );
}

function useInvitationSteps() {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const isFirst = step === 0;
  const isLast = step === 2;

  const next = () => setStep(s => Math.min(2, s + 1) as 0 | 1 | 2);
  const back = () => setStep(s => Math.max(0, s - 1) as 0 | 1 | 2);

  return { step, isFirst, isLast, next, back };
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button
      disabled={isPending}
      type='submit'
      className='w-full min-w-32 sm:w-fit'
    >
      {isPending ? (
        <MiniLoader />
      ) : (
        <>
          Send invitation <FaArrowRight />
        </>
      )}
    </Button>
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
