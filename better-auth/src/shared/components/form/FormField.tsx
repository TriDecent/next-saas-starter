'use client';

import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import {
  Controller,
  type FieldError as FieldErrorType,
  useFormContext,
} from 'react-hook-form';
import { cn } from '../../utils';
import {
  Checkbox,
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
  SelectContent,
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

export type FormFieldProps<TSelectProps = Record<string, unknown>> =
  | ({ kind: 'input' } & InputFieldProps)
  | ({ kind: 'textarea' } & TextareaFieldProps)
  | ({ kind: 'select' } & SelectFieldProps<TSelectProps>)
  | ({ kind: 'checkbox' } & CheckboxFieldProps)
  | ({ kind: 'radio' } & RadioFieldProps);

export function FormField(props: FormFieldProps) {
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
            defaultValue={field.value}
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
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>{props.children}</SelectContent>
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
          <RadioGroup onValueChange={field.onChange} value={field.value}>
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
