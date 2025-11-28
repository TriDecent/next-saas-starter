'use client';

import { Form, FormRow } from '@/shared/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  FieldGroup,
  FieldLegend,
  FieldSet,
  InputGroupAddon,
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
  Label,
} from '@/shared/components/ui';
import { useCallback } from 'react';
import { CgPassword } from 'react-icons/cg';
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'sonner';
import {
  changePasswordAction,
  type ChangePasswordResponse,
  type ErrorChangePasswordResponse,
} from './change-password-action';

export function ChangePasswordCard() {
  const { renderFields, renderUnexpectedErrors } = useRenders();
  const { onFormError, onFormSuccess } = useStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Enter your new password to complete the change process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form<ChangePasswordResponse>
          action={changePasswordAction}
          initialState={{
            type: 'initial',
            payload: { userEntered: null, errors: null },
          }}
          renderFields={renderFields}
          renderUnexpectedErrors={renderUnexpectedErrors}
          onFormSuccess={onFormSuccess}
          onFormError={onFormError}
          submitNode={
            <>
              Change Password <CgPassword />
            </>
          }
        />
      </CardContent>
    </Card>
  );
}

function useStatus() {
  const onFormSuccess = useCallback(() => {
    toast.success('Password changed successfully!', {
      description: 'You can now sign in with your new password.',
    });
  }, []);

  const onFormError = useCallback((state: ErrorChangePasswordResponse) => {
    if (state.payload?.errors?.auth) {
      toast.error('Failed to change password', {
        description: state.payload.errors.auth.message,
      });
      return;
    }
    toast.error('Failed to change password', {
      description: state.payload?.errors?.unexpected || 'Please try again.',
    });
  }, []);

  return {
    onFormSuccess,
    onFormError,
  };
}

function useRenders() {
  const renderFields = useCallback(
    (state: ChangePasswordResponse, isPending: boolean) => (
      <FieldSet>
        <FieldLegend>Enter your new password</FieldLegend>
        <FieldGroup>
          <FormRow
            kind='input'
            type='password'
            id='currentPassword'
            name='currentPassword'
            labelText='Current Password'
            description='Enter your current password'
            error={state.payload.errors?.currentPassword?.at(0)}
            addons={
              <InputGroupAddon>
                <RiLockPasswordFill />
              </InputGroupAddon>
            }
            autoComplete='current-password'
            disabled={isPending}
            defaultValue={state.payload.userEntered?.currentPassword}
            placeholder='Enter your current password'
          />

          <FormRow
            kind='input'
            type='password'
            id='newPassword'
            name='newPassword'
            labelText='New Password'
            description='Must be at least 6 characters long'
            error={state.payload.errors?.newPassword?.at(0)}
            addons={
              <InputGroupAddon>
                <RiLockPasswordFill />
              </InputGroupAddon>
            }
            autoComplete='new-password'
            disabled={isPending}
            defaultValue={state.payload.userEntered?.newPassword}
            placeholder='Enter your new password'
          />

          <FormRow
            kind='input'
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            labelText='Confirm Password'
            description='Re-enter your new password'
            error={state.payload.errors?.confirmPassword?.at(0)}
            addons={
              <InputGroupAddon>
                <RiLockPasswordFill />
              </InputGroupAddon>
            }
            autoComplete='new-password'
            disabled={isPending}
            defaultValue={state.payload.userEntered?.confirmPassword}
            placeholder='Confirm your new password'
          />

          <RevokeOtherSessionsCheckBox disabled={isPending} />
        </FieldGroup>
      </FieldSet>
    ),
    []
  );

  const renderUnexpectedErrors = useCallback(
    (state: ChangePasswordResponse) => {
      const { errors } = state.payload;
      if (!errors) return null;

      return errors.unexpected ? (
        <p className='text-destructive text-center text-sm'>
          {errors.unexpected}
        </p>
      ) : errors.auth ? (
        <p className='text-destructive text-center text-sm'>
          {errors.auth.message}
        </p>
      ) : null;
    },
    []
  );

  return {
    renderFields,
    renderUnexpectedErrors,
  };
}

function RevokeOtherSessionsCheckBox({ disabled }: { disabled: boolean }) {
  return (
    <Item asChild variant={'muted'}>
      <Label htmlFor='revokeOtherSessions'>
        <ItemActions>
          <Checkbox
            id='revokeOtherSessions'
            name='revokeOtherSessions'
            value={'true'}
            disabled={disabled}
          />
        </ItemActions>
        <ItemContent>
          <ItemTitle>Log out other sessions</ItemTitle>
        </ItemContent>
      </Label>
    </Item>
  );
}
