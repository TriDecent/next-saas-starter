'use client';

import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CreateInvitationSchema } from '../_shared';
import { INVITATION_STEPS } from './constants';

export type Step = { step: number; position: 'first' | 'last' | 'between' };

export function useInvitationSteps(onChangeStep: (step: Step) => void) {
  const { trigger } = useFormContext<CreateInvitationSchema>();
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const isFirst = step === 0;
  const isLast = step === 2;

  const next = useCallback(async () => {
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
  }, [onChangeStep, step, trigger]);

  const back = useCallback(() => {
    const prevStep = Math.max(0, step - 1) as 0 | 1 | 2;

    setStep(prevStep);
    onChangeStep({
      step: prevStep,
      position: prevStep === 0 ? 'first' : prevStep === 2 ? 'last' : 'between',
    });
  }, [onChangeStep, step]);

  return { step, isFirst, isLast, next, back };
}
