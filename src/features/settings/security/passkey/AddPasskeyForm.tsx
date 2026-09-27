'use client';

import { authClient } from '@/lib/auth/auth-client';
import { FormField, useShakeError } from '@/shared/components/form/client';
import { Button } from '@/shared/components/ui';
import { Field, FieldGroup } from '@/shared/components/ui/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
const schema = z.object({ passkeyName: z.string().min(3).max(64) });

export function AddPasskeyForm() {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: { passkeyName: '' },
    mode: 'onTouched',
  });

  const animationScope = useShakeError(methods.formState.errors);
  const { reset } = methods;

  const handleAddPasskey: SubmitHandler<z.infer<typeof schema>> = useCallback(
    async data => {
      const { error } = await authClient.passkey.addPasskey(
        { name: data.passkeyName },
        {
          onSuccess: () => {
            toast.success('Passkey added successfully', {
              description: `Passkey "${data.passkeyName}" has been added.`,
            });
            reset();
            router.refresh();
          },
          onError: error => {
            toast.error(`Failed to add passkey ${data.passkeyName}`, {
              description: error.error.message,
            });
          },
        }
      );

      if (!error) return;
      toast.error(`Failed to add passkey ${data.passkeyName}`, {
        description: error.message,
      });
    },
    [reset, router]
  );

  return (
    <form
      onSubmit={methods.handleSubmit(handleAddPasskey)}
      ref={animationScope}
      className='mx-auto w-full max-w-xl px-4 pb-6'
    >
      <FormProvider {...methods}>
        <FieldGroup>
          <FormField
            kind='input'
            id='passkeyName'
            name='passkeyName'
            labelText='Passkey name'
            description='Enter a name for your new passkey.'
          />

          <Field>
            <Button disabled={methods.formState.isSubmitting}>
              Add Passkey
            </Button>
          </Field>
        </FieldGroup>
      </FormProvider>
    </form>
  );
}
