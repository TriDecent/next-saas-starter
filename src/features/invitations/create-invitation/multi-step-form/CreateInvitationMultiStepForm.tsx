'use client';

import { useOrgContext } from '@/features/organizations';
import { MiniLoader } from '@/shared/components';
import { Button, Card, CardContent } from '@/shared/components/ui';
import {
  FieldDescription,
  FieldSet,
  FieldTitle,
} from '@/shared/components/ui/client';
import { MultiStepProvider, useMultiStepContext } from '@/shared/context';
import { FaArrowRight } from 'react-icons/fa6';
import { BaseCreateInvitationForm } from '../_shared/client';
import { INVITATION_STEPS } from './constants';
import { InvitationStepContent } from './InvitationStepContent';
import { InvitationStepFooter } from './InvitationStepFooter';
import { InvitationStepHeader } from './InvitationStepHeader';
import { useInvitationSteps } from './use-invitation-steps';

export function CreateInvitationMultiStepForm() {
  return (
    <Card>
      <MultiStepProvider stepCount={INVITATION_STEPS.length}>
        <MultiStepFormLayout />
      </MultiStepProvider>
    </Card>
  );
}

function MultiStepFormLayout() {
  const selectedOrg = useOrgContext();
  const currentStep = useMultiStepContext(state => state.currentStep);
  const isLast = currentStep === INVITATION_STEPS.length - 1;

  return (
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
      organizationId={selectedOrg.id}
    >
      <StepContentRenderer />
    </BaseCreateInvitationForm>
  );
}

function StepContentRenderer() {
  const { step, isFirst, isLast, next, back } = useInvitationSteps();
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
