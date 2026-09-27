'use client';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/shared/components/ui/client';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Controller, useFormContext } from 'react-hook-form';

export function TotpField({ isPending }: { isPending: boolean }) {
  const methods = useFormContext();

  return (
    <Controller
      name='code'
      control={methods.control}
      render={({ field, fieldState }) => (
        <Field orientation='responsive' data-invalid={fieldState.invalid}>
          <FieldLabel className='max-w-40' htmlFor='code'>
            TOTP
          </FieldLabel>
          <FieldContent>
            <InputOTP
              {...field}
              id='code'
              disabled={isPending}
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              aria-invalid={fieldState.invalid}
              containerClassName='justify-center'
              autoComplete='false'
            >
              <InputOTPGroup>
                {[0, 1, 2].map(idx => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                {[3, 4, 5].map(idx => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
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
  );
}
