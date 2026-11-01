'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import { InputGroup, InputGroupInput } from '../../ui';
import { FieldLayout } from './FieldLayout';
import { useFieldController } from './use-field-controller';

type InputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<
  React.ComponentPropsWithoutRef<typeof InputGroupInput>,
  'name' | 'id'
> & {
  id: string;
  name: TName;
  labelText: React.ReactNode;
  description?: React.ReactNode;
  addons?: React.ReactNode;
};

export function InputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: InputFieldProps<TFieldValues, TName>) {
  const { id, name, labelText, description, disabled, addons, ...rest } = props;
  const { field, fieldState, isSubmitting } = useFieldController(name);

  return (
    <FieldLayout
      id={id}
      labelText={labelText}
      description={description}
      error={fieldState.error}
      disabled={disabled || isSubmitting}
    >
      <InputGroup>
        <InputGroupInput
          {...field}
          {...rest}
          id={id}
          disabled={disabled || isSubmitting}
          aria-invalid={fieldState.invalid}
          className='read-only:cursor-not-allowed'
        />

        {addons}
      </InputGroup>
    </FieldLayout>
  );
}
