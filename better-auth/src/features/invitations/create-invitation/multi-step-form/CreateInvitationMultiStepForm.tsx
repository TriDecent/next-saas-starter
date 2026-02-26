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
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaArrowRight } from 'react-icons/fa6';
import { HiOfficeBuilding, HiUser, HiUserGroup } from 'react-icons/hi';
import { BaseCreateInvitationForm, CreateInvitationSchema } from '../_shared';
import { InvitationStepContent } from './InvitationStepContent';
import { InvitationStepFooter } from './InvitationStepFooter';
import { InvitationStepHeader } from './InvitationStepHeader';

export function CreateInvitationMultiStepForm() {
  const [isLast, setIsLast] = useState(false);

  const handleChangeStep = useCallback((step: Step) => {
    if (step.position === 'last') {
      setIsLast(true);
      return;
    }
    setIsLast(false);
  }, []);

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
        <Wrapper onChangeStep={handleChangeStep} />
      </BaseCreateInvitationForm>
    </Card>
  );
}

function Wrapper({ onChangeStep }: { onChangeStep: (step: Step) => void }) {
  const { step, isFirst, isLast, next, back } =
    useInvitationSteps(onChangeStep);
  const meta = INVITATION_STEPS[step];

  return (
    <>
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
    </>
  );
}

type Step = { step: number; position: 'first' | 'last' | 'between' };

function useInvitationSteps(onChangeStep: (step: Step) => void) {
  const { trigger } = useFormContext<CreateInvitationSchema>();
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const isFirst = step === 0;
  const isLast = step === 2;

  const next = async () => {
    const isStepValid = await trigger(INVITATION_STEPS[step].field, {
      shouldFocus: true,
    });
    if (!isStepValid) return;

    const nextStep = Math.min(2, step + 1) as 0 | 1 | 2;

    setStep(nextStep);
    onChangeStep({
      step: nextStep,
      position: nextStep === 0 ? 'first' : nextStep === 2 ? 'last' : 'between',
    });
  };

  const back = () => {
    const prevStep = Math.max(0, step - 1) as 0 | 1 | 2;

    setStep(prevStep);
    onChangeStep({
      step: prevStep,
      position: prevStep === 0 ? 'first' : prevStep === 2 ? 'last' : 'between',
    });
  };

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
    field: 'organizationId',
  },
  {
    title: 'Recipient',
    description: 'Choose who should receive this invitation.',
    icon: HiUser,
    field: 'email',
  },
  {
    title: 'Role',
    description: 'Set the access level for the invited user.',
    icon: HiUserGroup,
    field: 'role',
  },
] as const;
