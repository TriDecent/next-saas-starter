'use client';

import { DrawerOpener } from '@/shared/components/client';
import { use, useState, type ReactElement, type ReactNode } from 'react';
import { AuthenticatePriorContext } from './authenticate-prior-context';
import { AuthenticatePriorActionForm } from './AuthenticatePriorActionForm';

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
  const context = use(AuthenticatePriorContext);
  if (!context)
    throw new Error(
      'AuthenticatePriorAction must be used within AuthenticatePriorProvider'
    );
  const [enteredPassword, setEnteredPassword] = useState<string | null>(null);

  return (
    <DrawerOpener
      title={context.doesSudoTokenExist ? title : 'Authentication Required'}
      description={
        context.doesSudoTokenExist
          ? description
          : 'Please verify your identity before continuing with this action.'
      }
      trigger={trigger}
    >
      <div className={context.doesSudoTokenExist ? 'hidden' : 'block'}>
        <AuthenticatePriorActionForm
          onAuthenticated={setEnteredPassword}
          mode={context.is2FAEnabled ? 'with-2fa' : 'no-2fa'}
        />
      </div>

      {context.doesSudoTokenExist
        ? typeof children === 'function'
          ? enteredPassword
            ? children(enteredPassword)
            : null
          : children
        : null}
    </DrawerOpener>
  );
}
