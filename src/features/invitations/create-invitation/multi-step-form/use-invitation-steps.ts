'use client';

import { useMultiStepContext } from '@/shared/context';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { CreateInvitationSchemaType } from '../schema';
import { INVITATION_STEPS } from './constants';

export function useInvitationSteps() {
  const { trigger } = useFormContext<CreateInvitationSchemaType>();
  const currentStep = useMultiStepContext(state => state.currentStep);
  const { next: moveNext, back } = useMultiStepContext(state => state.actions);

  const isFirst = currentStep === 0;
  const isLast = currentStep === INVITATION_STEPS.length - 1;

  const next = useCallback(async () => {
    const isStepValid = await trigger(INVITATION_STEPS[currentStep].field, {
      shouldFocus: true,
    });
    if (!isStepValid) return;

    moveNext();
  }, [trigger, currentStep, moveNext]);

  return { step: currentStep, isFirst, isLast, next, back };
}
