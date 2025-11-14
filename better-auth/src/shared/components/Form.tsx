'use client';
import { useShakeError } from '@/shared/hooks';
import type { ActionResponse } from '@/shared/types';
import { cn } from '@/shared/utils';
import type { ClassValue } from 'clsx';
import { LoaderPinwheelIcon } from 'lucide-react';
import NextForm from 'next/form';
import { useActionState, useEffect, type ReactNode } from 'react';
import { Button } from './ui/button';
import { CardAction } from './ui/card';

interface FormProps<T> {
  readonly action: (state: T, formData: FormData) => Promise<T>;
  readonly initialState: Awaited<T>;
  readonly renderFields: (state: T, isPending: boolean) => ReactNode;
  readonly renderUnexpectedErrors: (state: T) => ReactNode;
  readonly onFormSuccess: (
    state: SuccessResponseFromGenericResponse<T>
  ) => void;
  readonly onFormError: (state: ErrorResponseFromGenericResponse<T>) => void;
  readonly onFormPending?: () => void;

  readonly submitNode: ReactNode;
  readonly className?: ClassValue;
}

type SuccessResponseFromGenericResponse<T> = Extract<T, { type: 'success' }>;
type ErrorResponseFromGenericResponse<T> = Extract<T, { type: 'error' }>;

type FormResponse = ActionResponse<unknown, unknown>;

export function Form<T extends FormResponse>({
  action,
  initialState,
  renderFields,
  renderUnexpectedErrors,
  onFormSuccess,
  onFormError,
  onFormPending,
  submitNode,
  className,
}: FormProps<T>) {
  const [state, dispatch, isPending] = useActionState(action, initialState);
  useForm(state, isPending, onFormSuccess, onFormError, onFormPending);
  const scope = useShakeError(state.payload.errors);

  return (
    <NextForm
      ref={scope}
      action={dispatch}
      className={cn('space-y-6', className)}
    >
      {renderFields(state, isPending)}

      <CardAction className='flex w-full flex-col gap-4 self-end md:w-fit md:flex-row'>
        <Button
          variant='ghost'
          type='reset'
          disabled={isPending}
          className='order-2 md:order-1'
        >
          Cancel
        </Button>
        <Button
          variant='secondary'
          type='submit'
          disabled={isPending}
          className='order-1 min-w-32 md:order-2'
        >
          {!isPending ? (
            submitNode
          ) : (
            <LoaderPinwheelIcon className='animate-spin' />
          )}
        </Button>
      </CardAction>

      {renderUnexpectedErrors?.(state)}
    </NextForm>
  );
}

const useForm = <T extends FormResponse>(
  state: T,
  isPending: boolean,
  onFormSuccess: (state: SuccessResponseFromGenericResponse<T>) => void,
  onFormFail: (state: ErrorResponseFromGenericResponse<T>) => void,
  onFormPending?: () => void
) => {
  useEffect(() => {
    if (state.type !== 'success') return;
    // TypeScript limitation: cannot narrow generic type T to Extract<T, { type: 'success' }>
    // even after checking state.type === 'success', so we need to use a type assertion here.
    onFormSuccess(state as SuccessResponseFromGenericResponse<T>);
  }, [onFormSuccess, state]);

  useEffect(() => {
    if (state.type !== 'error') return;
    // Same problem here
    onFormFail(state as ErrorResponseFromGenericResponse<T>);
  }, [onFormFail, state]);

  useEffect(() => {
    if (!isPending) return;
    onFormPending?.();
  }, [isPending, onFormPending]);
};
