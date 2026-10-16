'use client';

import { DrawerOpener } from '@/shared/components/client';
import { useEffect, type ReactElement, type ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { AuthenticatePriorActionForm } from './AuthenticatePriorActionForm';
import { useAuthenticatePrior } from './context/use-authenticate-prior';

export function AuthenticatePriorAction({
  title,
  description,
  children,
  trigger,
}: {
  title: string;
  description: string;
  trigger: ReactElement;
  children?: ReactNode | ((enteredPassword: string) => ReactNode);
}) {
  const { doesSudoTokenExist, is2FAEnabled, enteredPassword } =
    useAuthenticatePrior(
      useShallow(state => ({
        doesSudoTokenExist: state.doesSudoTokenExist,
        is2FAEnabled: state.is2FAEnabled,
        enteredPassword: state.enteredPassword,
      }))
    );
  const setEnteredPassword = useAuthenticatePrior(
    state => state.action.setEnteredPassword
  );

  useEffect(() => {
    console.log(enteredPassword);
  }, [enteredPassword]);

  return (
    <DrawerOpener
      title={doesSudoTokenExist ? title : 'Authentication Required'}
      description={
        doesSudoTokenExist
          ? description
          : 'Please verify your identity before continuing with this action.'
      }
      trigger={trigger}
    >
      <div className={doesSudoTokenExist ? 'hidden' : 'block'}>
        <AuthenticatePriorActionForm
          onAuthenticated={setEnteredPassword}
          mode={is2FAEnabled ? 'with-2fa' : 'no-2fa'}
        />
      </div>

      {doesSudoTokenExist
        ? typeof children === 'function'
          ? enteredPassword
            ? children(enteredPassword)
            : null
          : children
        : null}
    </DrawerOpener>
  );
}
