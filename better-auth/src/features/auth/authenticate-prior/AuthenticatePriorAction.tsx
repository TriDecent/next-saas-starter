'use client';

import { FactorActionForm } from '@/features/settings/security/two-auth-factors';
import { DrawerOpener } from '@/shared/components';
import { use, useEffect, useEffectEvent, type ReactNode } from 'react';
import { authenticatePriorAction } from './authenticate-prior-action';
import { AuthenticatePriorContext } from './authenticate-prior-context';

export function AuthenticatePriorAction({
  title,
  description,
  children,
  trigger,
  onAuthenticated,
}: {
  title: string;
  description: string;
  trigger: ReactNode;
  children?: ReactNode;
  onAuthenticated?: () => void;
}) {
  const context = use(AuthenticatePriorContext);
  if (!context)
    throw new Error(
      'AuthenticatePriorAction must be used within AuthenticatePriorProvider'
    );

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
        <FactorActionForm
          action={authenticatePriorAction}
          initialState={{ type: 'initial' }}
          intent={
            context.is2FAEnabled
              ? 'authenticate-prior-action'
              : 'authenticate-prior-action-without-2fa'
          }
        />
      </div>

      {context.doesSudoTokenExist ? (
        <RenderOnAuthenticated onAuthenticated={onAuthenticated}>
          {children}
        </RenderOnAuthenticated>
      ) : null}
    </DrawerOpener>
  );
}

function RenderOnAuthenticated({
  onAuthenticated,
  children,
}: {
  onAuthenticated?: () => void;
  children?: ReactNode;
}) {
  const handleAuthenticated = useEffectEvent(onAuthenticated ?? (() => {}));

  useEffect(() => {
    handleAuthenticated();
  }, []);

  return children;
}
