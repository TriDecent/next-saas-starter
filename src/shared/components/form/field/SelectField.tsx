'use client';

import { cn } from 'cn';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { InputGroup, Select, SelectTrigger, SelectValue } from '../../ui';
import { FieldLayout } from './FieldLayout';
import { useFieldController } from './use-field-controller';

type SelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<
  React.ComponentPropsWithoutRef<typeof Select>,
  'name' | 'id' | 'defaultValue'
> & {
  id: string;
  name: TName;
  labelText: React.ReactNode;
  description?: React.ReactNode;
  addons?: React.ReactNode;
  placeholder?: string;
};

export function SelectField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: SelectFieldProps<TFieldValues, TName>) {
  const {
    id,
    name,
    labelText,
    description,
    disabled,
    addons,
    placeholder,
    children,
    ...rest
  } = props;
  const { field, fieldState, isSubmitting } = useFieldController(name);
  const isDisabled = disabled || isSubmitting;

  return (
    <FieldLayout
      id={id}
      labelText={labelText}
      description={description}
      error={fieldState.error}
      disabled={isDisabled}
    >
      <Select
        {...field}
        {...rest}
        value={field.value}
        onValueChange={field.onChange}
        disabled={isDisabled}
      >
        <InputGroup>
          <SelectTrigger
            id={id}
            name={name}
            disabled={isDisabled}
            aria-invalid={fieldState.invalid}
            className={cn(
              'w-full border-0 bg-transparent!',
              fieldState.invalid ? 'error' : ''
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          {addons}
        </InputGroup>

        {children}
      </Select>
    </FieldLayout>
  );
}
