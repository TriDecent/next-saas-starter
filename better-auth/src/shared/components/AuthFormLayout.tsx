import { Button, FieldGroup } from '@/shared/components/ui';
import type { ReactNode, RefObject } from 'react';
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';
import { GiConfirmed } from 'react-icons/gi';

interface AuthFormLayoutProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  error?: string;
  animationRef?: RefObject<HTMLFormElement>;
  isPending: boolean;
  submitLabel?: string;
  className?: string;
}

export function AuthFormLayout<T extends FieldValues>({
  methods,
  onSubmit,
  error,
  animationRef,
  isPending,
  children,
  submitLabel = 'Confirm',
  className,
}: AuthFormLayoutProps<T>) {
  return (
    <FormProvider {...methods}>
      <form
        ref={animationRef}
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
      >
        <FieldGroup className='mx-auto max-w-xl px-4 pb-8'>
          {children}

          <Button
            disabled={isPending}
            type='submit'
            className='mx-auto w-full min-w-32 sm:w-fit'
          >
            <GiConfirmed className='mr-2' /> {submitLabel}
          </Button>

          {error ? (
            <p className='text-destructive mt-2 text-center text-sm'>{error}</p>
          ) : null}
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
