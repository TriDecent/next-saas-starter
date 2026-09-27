import { cn } from '@/shared/utils';
import { type FieldError as FieldErrorType } from 'react-hook-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../ui/client';

type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';

export type BaseFieldProps = {
  id: string;
  name: string;
  labelText: string;
  labelClassName?: string;
  description?: React.ReactNode;
  orientation?: FieldOrientation;
  addons?: React.ReactNode;
};

type FieldWrapperProps = BaseFieldProps & {
  error?: FieldErrorType;
  disabled: boolean;
  children: React.ReactNode;
};

export const FieldWrapper = Object.assign(() => {}, {
  Root: FieldWrapperRoot,
  Label: FieldWrapperLabel,
  Content: FieldWrapperContent,
});

function FieldWrapperRoot({
  orientation,
  error,
  disabled,
  children,
}: Pick<FieldWrapperProps, 'orientation' | 'error' | 'disabled' | 'children'>) {
  return (
    <Field
      orientation={orientation}
      data-invalid={!!error}
      data-disabled={disabled}
    >
      {children}
    </Field>
  );
}

function FieldWrapperLabel({
  id,
  labelClassName,
  labelText,
}: Pick<BaseFieldProps, 'id' | 'labelClassName' | 'labelText'>) {
  return (
    <FieldLabel htmlFor={id} className={cn('max-w-40', labelClassName)}>
      {labelText}
    </FieldLabel>
  );
}

function FieldWrapperContent({
  children,
  description,
  error,
}: Pick<FieldWrapperProps, 'children' | 'description' | 'error'>) {
  return (
    <FieldContent>
      {children}

      {description ? <FieldDescription>{description}</FieldDescription> : null}

      {error ? <FieldError errors={[error]} /> : null}
    </FieldContent>
  );
}
