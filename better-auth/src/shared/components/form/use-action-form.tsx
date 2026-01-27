'use client';

import { useActionState, useEffect, useEffectEvent, useRef } from 'react';
import { useForm, type FieldValues, type UseFormProps } from 'react-hook-form';
import { useShakeError } from './use-shake-error';

type ActionResponse<TSuccess, TError> = Readonly<
  | { type: 'success'; payload: TSuccess }
  | { type: 'error'; payload: TError }
  | { type: 'initial' }
>;

export function useActionForm<
  TResponse extends ActionResponse<unknown, unknown>,
  TPayload extends FieldValues,
>(params: {
  formConfiguration: UseFormProps<TPayload>;
  action: (state: Awaited<TResponse>, payload: TPayload) => Promise<TResponse>;
  initialState: Awaited<TResponse>;
  onFormSuccess: (s: Extract<TResponse, { type: 'success' }>) => void;
  onFormError: (s: Extract<TResponse, { type: 'error' }>) => void;
  onFormPending: () => void;
}) {
  const {
    formConfiguration,
    action,
    initialState,
    onFormSuccess,
    onFormError,
    onFormPending,
  } = params;

  const methods = useForm(formConfiguration);
  const [state, dispatch, isPending] = useActionState(action, initialState);
  const animationScope = useShakeError(methods.formState.errors);
  const hadPendingRef = useRef(false);

  const handleFormSuccess = useEffectEvent(onFormSuccess);
  const handleFormError = useEffectEvent(onFormError);
  const handleFormPending = useEffectEvent(onFormPending);

  useEffect(() => {
    if (isPending) {
      hadPendingRef.current = true;
      handleFormPending();
      return;
    }

    if (!hadPendingRef.current) return;

    if (state.type === 'success') {
      handleFormSuccess(state as Extract<TResponse, { type: 'success' }>); // Ts cannot infer in this case
    }

    if (state.type === 'error') {
      handleFormError(state as Extract<TResponse, { type: 'error' }>); // Ts cannot infer in this case
    }

    hadPendingRef.current = false;
  }, [isPending, state]);

  return {
    methods,
    state,
    isPending,
    dispatch,
    animationScope,
  };
}
