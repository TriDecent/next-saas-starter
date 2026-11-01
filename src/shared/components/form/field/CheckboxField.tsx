'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import { Checkbox, ItemContent, ItemDescription } from '../../ui';
import { Field, FieldError, FieldLabel, FieldTitle } from '../../ui/client';
import { useFieldController } from './use-field-controller';

type CheckboxFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, 'id' | 'name'> & {
  id: string;
  name: TName;
  labelText: React.ReactNode;
  description?: React.ReactNode;
  variant: 'card' | 'inline';
};

export function CheckboxField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: CheckboxFieldProps<TFieldValues, TName>) {
  const { id, name, labelText, description, variant, disabled, ...rest } =
    props;
  const { field, fieldState, isSubmitting } = useFieldController(name);
  const isDisabled = disabled || isSubmitting;

  const checkbox = (
    <Checkbox
      {...rest}
      id={id}
      checked={!!field.value}
      onCheckedChange={field.onChange}
      disabled={isDisabled}
      aria-invalid={fieldState.invalid}
      className='self-start'
    />
  );

  if (variant === 'card') {
    return (
      <Field
        orientation='horizontal'
        data-invalid={fieldState.invalid}
        data-disabled={isDisabled}
      >
        <FieldLabel htmlFor={id} className='rounded px-4 py-2.5'>
          {checkbox}

          <ItemContent>
            <FieldTitle className='leading-none'>{labelText}</FieldTitle>
            <ItemDescription>{description}</ItemDescription>
            {fieldState.error ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </ItemContent>
        </FieldLabel>
      </Field>
    );
  }

  return (
    <Field
      orientation='horizontal'
      data-invalid={fieldState.invalid}
      data-disabled={isDisabled}
    >
      {checkbox}

      <ItemContent>
        <FieldLabel htmlFor={id} className='leading-none'>
          {labelText}
        </FieldLabel>
        <ItemDescription>{description}</ItemDescription>

        {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
      </ItemContent>
    </Field>
  );
}
