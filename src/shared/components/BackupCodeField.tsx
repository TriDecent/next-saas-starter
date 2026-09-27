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
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { Controller, useFormContext } from 'react-hook-form';

export function BackupCodeField({ isPending }: { isPending: boolean }) {
  const methods = useFormContext();

  return (
    <Controller
      name='code'
      control={methods.control}
      render={({ field, fieldState }) => (
        <Field orientation='responsive' data-invalid={fieldState.invalid}>
          <FieldLabel className='max-w-40' htmlFor='code'>
            Backup Codes
          </FieldLabel>
          <FieldContent>
            <InputOTP
              {...field}
              id='code'
              disabled={isPending}
              maxLength={10}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              aria-invalid={fieldState.invalid}
              containerClassName='justify-center flex-col sm:flex-row'
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4].map(idx => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                {[5, 6, 7, 8, 9].map(idx => (
                  <InputOTPSlot key={idx} index={idx} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Enter the 10-character backup code.
            </FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  );
}
