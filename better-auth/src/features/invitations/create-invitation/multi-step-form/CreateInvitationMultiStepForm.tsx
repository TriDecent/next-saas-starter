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
import { FaArrowRight } from 'react-icons/fa6';
import { BaseCreateInvitationForm } from '../_shared';
import { INVITATION_STEPS } from './constants';
import { InvitationStepContent } from './InvitationStepContent';
import { InvitationStepFooter } from './InvitationStepFooter';
import { InvitationStepHeader } from './InvitationStepHeader';
import { useInvitationSteps, type Step } from './use-invitation-steps';

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
