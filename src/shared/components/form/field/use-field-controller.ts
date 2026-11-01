'use client';

import {
  useController,
  useFormContext,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

export type FieldControllerState<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ReturnType<typeof useController>['fieldState'];
  isSubmitting: boolean;
};

export function useFieldController<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(name: TName): FieldControllerState<TFieldValues, TName> {
  const { control, formState } = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({ name, control });

  return {
    field,
    fieldState,
    isSubmitting: formState.isSubmitting,
  };
}
