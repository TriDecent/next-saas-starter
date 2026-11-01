'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import { RadioGroup } from '../../ui';
import { useFieldController } from './use-field-controller';

type RadioGroupFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<React.ComponentPropsWithoutRef<typeof RadioGroup>, 'name'> & {
  id: string;
  name: TName;
  renderItems: (state: {
    isError: boolean;
    isDisabled: boolean;
  }) => React.ReactNode;
};

export function RadioGroupField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: RadioGroupFieldProps<TFieldValues, TName>) {
  const { name, renderItems, disabled, ...rest } = props;
  const { field, fieldState, isSubmitting } = useFieldController(name);
  const isDisabled = disabled || isSubmitting;

  return (
    <RadioGroup
      {...rest}
      value={field.value}
      onValueChange={field.onChange}
      disabled={isDisabled}
    >
      {renderItems({
        isError: fieldState.invalid,
        isDisabled,
      })}
    </RadioGroup>
  );
}
