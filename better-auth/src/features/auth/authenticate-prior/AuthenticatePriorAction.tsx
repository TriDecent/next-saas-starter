'use client';

import { FactorActionForm } from '@/features/settings/security/two-auth-factors';
import { DrawerOpener } from '@/shared/components';
import {
  use,
  useEffect,
  useEffectEvent,
  useState,
  type ReactNode,
} from 'react';
import { authenticatePriorAction } from './authenticate-prior-action';
import { AuthenticatePriorContext } from './authenticate-prior-context';

export function AuthenticatePriorAction({
  title,
  description,
  children,
  trigger,
}: {
  title: string;
  description: string;
  trigger: ReactNode;
  children: ReactNode;
}) {
  const context = use(AuthenticatePriorContext);
  if (!context)
    throw new Error(
      'AuthenticatePriorAction must be used within AuthenticatePriorProvider'
    );

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <DrawerOpener
      title={isAuthenticated ? title : 'Authentication Required'}
      description={
        isAuthenticated
          ? description
          : 'Please verify your identity before continuing with this action.'
      }
      trigger={trigger}
    >
      {context.doesSudoTokenExist ? (
        <RenderOnAuthenticated onAuthenticated={() => setIsAuthenticated(true)}>
          {children}
        </RenderOnAuthenticated>
      ) : (
        <FactorActionForm
          action={authenticatePriorAction}
          initialState={{ type: 'initial' }}
          intent={
            context.is2FAEnabled
              ? 'authenticate-prior-action'
              : 'authenticate-prior-action-without-2fa'
          }
        >
          {() => (
            <RenderOnAuthenticated
              onAuthenticated={() => setIsAuthenticated(true)}
            >
              {children}
            </RenderOnAuthenticated>
          )}
        </FactorActionForm>
      )}
    </DrawerOpener>
  );
}

function RenderOnAuthenticated({
  onAuthenticated,
  children,
}: {
  onAuthenticated: () => void;
  children: ReactNode;
}) {
  const handleAuthenticated = useEffectEvent(onAuthenticated);

  useEffect(() => {
    handleAuthenticated();
  }, []);

  return children;
}
