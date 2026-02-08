'use client';

import React, {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import {
  Controller,
  useFormContext,
  type FieldError as FieldErrorType,
} from 'react-hook-form';
import { cn } from '../../utils';
import {
  Checkbox,
  Combobox,
  ComboboxInput,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
  ItemContent,
  ItemDescription,
  RadioGroup,
  Select,
  SelectTrigger,
  SelectValue,
} from '../ui';

type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';

interface BaseFieldProps {
  id: string;
  name: string;
  labelText: string;
  labelClassName?: string;
  description?: React.ReactNode;
  className?: string;
  orientation?: FieldOrientation;
  addons?: React.ReactNode;
}

type InputFieldProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaFieldProps = BaseFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

export type SelectFieldProps<TSelectProps = Record<string, unknown>> =
  BaseFieldProps &
    TSelectProps & {
      disabled?: boolean;
      placeholder?: string;
      children?: React.ReactNode;
    };

type CheckboxFieldProps = BaseFieldProps &
  React.ComponentPropsWithoutRef<typeof Checkbox> & {
    variant: 'card' | 'inline';
  };

type RadioFieldProps = Omit<BaseFieldProps, 'labelText'> &
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroup>, 'children'> & {
    children: (state: {
      isError: boolean;
      isDisabled: boolean;
    }) => React.ReactNode;
  };

type ComboboxFieldProps<TItem> = BaseFieldProps &
  React.ComponentPropsWithoutRef<typeof Combobox<TItem>> & {
    placeholder: string;
    autoComplete: React.HTMLInputAutoCompleteAttribute;
    valueAs: (item: TItem) => string;
  };

export type FormFieldProps<TSelectProps = Record<string, unknown>> =
  | ({ kind: 'input' } & InputFieldProps)
  | ({ kind: 'textarea' } & TextareaFieldProps)
  | ({ kind: 'select' } & SelectFieldProps<TSelectProps>)
  | ({ kind: 'checkbox' } & CheckboxFieldProps)
  | ({ kind: 'radio' } & RadioFieldProps)
  | ({ kind: 'combobox' } & ComboboxFieldProps<TSelectProps>);

export function FormField<TItem>(props: FormFieldProps<TItem>) {
  const { kind, ...rest } = props;

  switch (kind) {
    case 'input':
      return <ControlledInputField {...(rest as InputFieldProps)} />;
    case 'textarea':
      return <ControlledTextareaField {...(rest as TextareaFieldProps)} />;
    case 'select':
      return <ControlledSelectField {...(rest as SelectFieldProps)} />;
    case 'checkbox':
      return <ControlledCheckboxField {...(rest as CheckboxFieldProps)} />;
    case 'radio':
      return <ControlledRadioField {...(rest as RadioFieldProps)} />;
    case 'combobox':
      return (
        <ControlledComboboxField<TItem>
          {...(rest as ComboboxFieldProps<TItem>)}
        />
      );
    default:
      return null;
  }
}

function ControlledInputField({ ...props }: InputFieldProps) {
  const { control, formState } = useFormContext();
  const { labelText, ...rest } = props;

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldWrapper
          {...props}
          labelText={labelText}
          error={fieldState.error}
          disabled={props.disabled || formState.isSubmitting}
        >
          <InputGroup
            className={cn(
              'read-only:cursor-not-allowed',
              fieldState.invalid ? 'error' : '',
              props.className
            )}
          >
            <InputGroupInput
              {...field}
              {...rest}
              id={props.id}
              name={props.name}
              disabled={formState.isSubmitting}
              aria-invalid={fieldState.invalid}
            />
            {props.addons}
          </InputGroup>
        </FieldWrapper>
      )}
    />
  );
}

function ControlledTextareaField({ ...props }: TextareaFieldProps) {
  const { control, formState } = useFormContext();
  const { labelText, ...rest } = props;

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldWrapper
          {...props}
          labelText={labelText}
          error={fieldState.error}
          disabled={props.disabled || formState.isSubmitting}
        >
          <InputGroup
            className={cn(
              'read-only:cursor-not-allowed',
              fieldState.invalid ? 'error' : '',
              props.className
            )}
          >
            <InputGroupTextarea
              {...field}
              {...rest}
              id={props.id}
              name={props.name}
              disabled={props.disabled || formState.isSubmitting}
              aria-invalid={fieldState.invalid}
            />
            {props.addons}
          </InputGroup>
        </FieldWrapper>
      )}
    />
  );
}

function ControlledSelectField({ ...props }: SelectFieldProps) {
  const { control, formState } = useFormContext();
  const { labelText, ...rest } = props;

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldWrapper
          {...props}
          id={props.id}
          name={props.name}
          error={fieldState.error}
          labelText={labelText}
          disabled={props.disabled || formState.isSubmitting}
        >
          <Select
            {...field}
            {...rest}
            name={props.name}
            onValueChange={field.onChange}
            value={field.value}
            autoComplete='none'
          >
            <SelectTrigger
              id={props.id}
              name={props.name}
              disabled={props.disabled || formState.isSubmitting}
              aria-invalid={fieldState.invalid}
              className={cn(
                'w-full',
                fieldState.invalid ? 'error' : '',
                props.className
              )}
            >
              <div className='flex items-center gap-2'>
                {props.addons}
                <SelectValue placeholder={props.placeholder} />
              </div>
            </SelectTrigger>

            {props.children}
          </Select>
        </FieldWrapper>
      )}
    />
  );
}

function ControlledCheckboxField({ variant, ...props }: CheckboxFieldProps) {
  const { control, formState } = useFormContext();
  const { labelText, ...rest } = props;

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          orientation={'horizontal'}
          data-invalid={fieldState.invalid}
          data-disabled={props.disabled || formState.isSubmitting}
        >
          {variant === 'card' ? (
            <FieldLabel htmlFor={props.id} className='rounded px-4 py-2.5'>
              <Checkbox
                {...field}
                {...rest}
                id={props.id}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={props.disabled || formState.isSubmitting}
                aria-invalid={fieldState.invalid}
                className='self-start'
              />

              <ItemContent>
                <FieldTitle className='leading-none'>{labelText}</FieldTitle>
                <ItemDescription>{props.description}</ItemDescription>

                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </ItemContent>
            </FieldLabel>
          ) : (
            <>
              <Checkbox
                {...field}
                {...rest}
                id={props.id}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={props.disabled || formState.isSubmitting}
                aria-invalid={fieldState.invalid}
                className='self-start'
              />

              <ItemContent>
                <FieldLabel htmlFor={props.id} className='leading-none'>
                  {labelText}
                </FieldLabel>
                <ItemDescription>{props.description}</ItemDescription>

                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </ItemContent>
            </>
          )}
        </Field>
      )}
    />
  );
}

function ControlledRadioField({ children, ...props }: RadioFieldProps) {
  const { control, formState } = useFormContext();

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <RadioGroup
            {...field}
            onValueChange={field.onChange}
            value={field.value}
          >
            {children({
              isError: fieldState.invalid,
              isDisabled: props.disabled || formState.isSubmitting,
            })}
          </RadioGroup>

          {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
        </Field>
      )}
    />
  );
}

function ControlledComboboxField<TItem>(props: ComboboxFieldProps<TItem>) {
  const { control, formState } = useFormContext();
  const { labelText, items, valueAs, ...rest } = props;

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedValue = items
          ? (items.find(item => valueAs(item) === field.value) ?? null)
          : (field.value ?? null);

        return (
          <FieldWrapper
            {...props}
            id={props.id}
            error={fieldState.error}
            labelText={labelText}
            disabled={props.disabled || formState.isSubmitting}
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
                id={props.id}
                disabled={props.disabled || formState.isSubmitting}
                aria-invalid={fieldState.invalid}
                placeholder={props.placeholder}
                autoComplete={props.autoComplete}
                className={cn(
                  fieldState.invalid ? 'error' : '',
                  props.className
                )}
              >
                {props.addons}
              </ComboboxInput>

              {props.children}
            </Combobox>
          </FieldWrapper>
        );
      }}
    />
  );
}

function FieldWrapper({
  id,
  labelText,
  labelClassName,
  description,
  error,
  orientation = 'responsive',
  disabled,
  children,
}: BaseFieldProps & {
  error?: FieldErrorType;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <Field
      orientation={orientation}
      data-invalid={!!error}
      data-disabled={disabled}
    >
      <FieldLabel htmlFor={id} className={cn('max-w-40', labelClassName)}>
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
