'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import { Combobox, ComboboxInput } from '../../ui';
import { FieldLayout } from './FieldLayout';
import { useFieldController } from './use-field-controller';

type ComboboxFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TItem,
> = Omit<
  React.ComponentPropsWithoutRef<typeof Combobox<TItem>>,
  'name' | 'value' | 'onValueChange' | 'children'
> & {
  id: string;
  name: TName;
  labelText: React.ReactNode;
  description?: React.ReactNode;
  placeholder: string;
  autoComplete: React.HTMLInputAutoCompleteAttribute;
  valueAs: (item: TItem) => string; // this value is submitted with the form
  addons?: React.ReactNode;
  children?: React.ReactNode;
};

export function ComboboxField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TItem,
>(props: ComboboxFieldProps<TFieldValues, TName, TItem>) {
  const {
    id,
    name,
    labelText,
    description,
    placeholder,
    autoComplete,
    valueAs,
    addons,
    items,
    children,
    disabled,
    ...rest
  } = props;
  const { field, fieldState, isSubmitting } = useFieldController(name);
  const isDisabled = disabled || isSubmitting;
  const selectedValue = Array.isArray(items)
    ? (items.find(item => valueAs(item) === field.value) ?? null)
    : (field.value ?? null);

  return (
    <FieldLayout
      id={id}
      labelText={labelText}
      description={description}
      error={fieldState.error}
      disabled={isDisabled}
    >
      <Combobox
        {...rest}
        {...field}
        items={items}
        value={selectedValue}
        onValueChange={newItem => {
          field.onChange(newItem ? valueAs(newItem) : newItem);
        }}
      >
        <ComboboxInput
          id={id}
          disabled={isDisabled}
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          autoComplete={autoComplete}
        >
          {addons}
        </ComboboxInput>

        {children}
      </Combobox>
    </FieldLayout>
  );
}

export type { ComboboxFieldProps };
