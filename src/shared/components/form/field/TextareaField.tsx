'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import { InputGroup, InputGroupTextarea } from '../../ui';
import { FieldLayout } from './FieldLayout';
import { useFieldController } from './use-field-controller';

type TextareaFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<React.ComponentProps<typeof InputGroupTextarea>, 'name' | 'id'> & {
  id: string;
  name: TName;
  labelText: React.ReactNode;
  description?: React.ReactNode;
  addons?: React.ReactNode;
};

export function TextareaField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: TextareaFieldProps<TFieldValues, TName>) {
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
        <InputGroupTextarea
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
