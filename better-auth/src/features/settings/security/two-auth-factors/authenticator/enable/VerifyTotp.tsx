import { authClient } from '@/lib/auth-client';
import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useTransition } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { FaRegCheckCircle } from 'react-icons/fa';
import { toast } from 'sonner';
import z from 'zod';

const totpSchema = z.object({
  code: z.string().regex(new RegExp(REGEXP_ONLY_DIGITS)).min(6).max(6),
});

export function VerifyTotp({
  onVerifySuccess,
}: {
  onVerifySuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const methods = useForm({
    resolver: zodResolver(totpSchema),
    defaultValues: { code: '' },
  });

  const handleSubmit: SubmitHandler<z.infer<typeof totpSchema>> = data => {
    methods.reset();
    startTransition(async () => {
      await authClient.twoFactor.verifyTotp(
        { code: data.code },
        {
          onSuccess: () => {
            toast.success('2FA code verified', {
              description:
                'Two-factor authentication has been successfully verified.',
            });
            onVerifySuccess();
          },
          onError: error => {
            toast.error('An error has occurred', {
              description: error.error.message,
            });
          },
        }
      );
    });
  };

  return (
    <form onSubmit={methods.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          name='code'
          control={methods.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldContent>
                <InputOTP
                  {...field}
                  disabled={isPending}
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  containerClassName='justify-center'
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>

                  <InputOTPSeparator />

                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                <FieldDescription>
                  Enter the 6-digit code from your authenticator app.
                </FieldDescription>

                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />

        <Button disabled={isPending}>
          <FaRegCheckCircle /> Verify
        </Button>
      </FieldGroup>
    </form>
  );
}
