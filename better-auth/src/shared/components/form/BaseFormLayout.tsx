'use client';

import { Button, FieldGroup } from '@/shared/components/ui';
import type { ReactNode, RefObject } from 'react';
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';
import { GiConfirmed } from 'react-icons/gi';
import { MiniLoader } from '../MiniLoading';

type BaseFormLayoutProps<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  error?: string;
  animationRef?: RefObject<HTMLFormElement>;
  isPending: boolean;
  submit?: ReactNode;
  className?: string;
};

export function BaseFormLayout<T extends FieldValues>({
  methods,
  onSubmit,
  error,
  animationRef,
  isPending,
  children,
  submit: submit = 'Confirm',
  className,
}: BaseFormLayoutProps<T>) {
  return (
    <FormProvider {...methods}>
      <form
        ref={animationRef}
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
      >
        <FieldGroup>
          {children}

          <div className='mt-2 flex flex-col gap-2 sm:ml-auto sm:flex-row'>
            <Button
              disabled={isPending}
              type='submit'
              className='order-1 w-full min-w-32 sm:order-2 sm:w-fit'
            >
              {isPending ? (
                <MiniLoader />
              ) : (
                (submit ?? (
                  <>
                    <GiConfirmed className='mr-2' /> Confirm
                  </>
                ))
              )}
            </Button>

            <Button
              type='reset'
              variant={'ghost'}
              disabled={isPending}
              onClick={() => methods.reset()}
              className='order-2 w-full sm:order-1 sm:w-fit'
            >
              Cancel
            </Button>
          </div>

          {error ? (
            <p className='text-destructive mt-2 text-center text-sm'>{error}</p>
          ) : null}
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
