'use client';

import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import {
  Controller,
  type FieldError as FieldErrorType,
  useFormContext,
} from 'react-hook-form';
import { cn } from '../utils/utils';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from './ui/field';
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from './ui/input-group';
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';

type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';

interface BaseFieldProps {
  id: string;
  name: string;
  labelText: string;
  labelClassName?: string;
  description?: string;
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

export type FormFieldProps<TSelectProps = Record<string, unknown>> =
  | ({ kind: 'input' } & InputFieldProps)
  | ({ kind: 'textarea' } & TextareaFieldProps)
  | ({ kind: 'select' } & SelectFieldProps<TSelectProps>);

export function FormField(props: FormFieldProps) {
  const { kind, ...rest } = props;

  switch (kind) {
    case 'input':
      return <ControlledInputField {...(rest as InputFieldProps)} />;
    case 'textarea':
      return <ControlledTextareaField {...(rest as TextareaFieldProps)} />;
    case 'select':
      return <ControlledSelectField {...(rest as SelectFieldProps)} />;
    default:
      return null;
  }
}

function ControlledInputField({ ...props }: InputFieldProps) {
  const { control } = useFormContext();
  const { labelText, ...rest } = props;

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <FieldWrapper {...props} labelText={labelText} error={fieldState.error}>
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

function ControlledTextareaField({ ...props }: TextareaFieldProps) {
  const { control } = useFormContext();
  const { labelText, ...rest } = props;

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <FieldWrapper {...props} labelText={labelText} error={fieldState.error}>
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
  const { control } = useFormContext();
  const { labelText, ...rest } = props;

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <FieldWrapper
          {...props}
          id={props.id}
          name={props.name}
          error={fieldState.error}
          labelText={labelText}
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
              disabled={formState.isSubmitting}
              aria-invalid={props.disabled || fieldState.invalid}
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

function FieldWrapper({
  id,
  labelText,
  labelClassName,
  description,
  error,
  orientation = 'responsive',
  children,
}: BaseFieldProps & { error?: FieldErrorType; children: React.ReactNode }) {
  return (
    <Field orientation={orientation} data-invalid={!!error}>
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
