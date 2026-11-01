'use client';

import { useController } from 'react-hook-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../ui/client';

type FieldLayoutProps = {
  id: string;
  labelText: React.ReactNode;
  description?: React.ReactNode;
  error?: ReturnType<typeof useController>['fieldState']['error'];
  disabled?: boolean;
  children: React.ReactNode;
};

export function FieldLayout({
  id,
  labelText,
  description,
  error,
  disabled = false,
  children,
}: FieldLayoutProps) {
  return (
    <Field
      // place data-invalid and data-disabled props on the Field component, and aria-invalid on the Input, Textarea, or other form fields
      data-invalid={!!error}
      data-disabled={disabled}
      orientation={'responsive'}
    >
      <FieldLabel htmlFor={id} className='max-w-28 md:max-w-full'>
        {labelText}
      </FieldLabel>

      <FieldContent>
        {children}

        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}

        {error ? <FieldError errors={[error]} /> : null}
      </FieldContent>
    </Field>
  );
}
