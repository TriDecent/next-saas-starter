'use client';

import { FactorActionForm } from '@/features/settings/security/two-auth-factors';
import { DrawerOpener } from '@/shared/components';
import { useEffect, useEffectEvent, useState, type ReactNode } from 'react';
import { authenticatePriorAction } from './authenticate-prior-action';

export function AuthenticatePriorAction({
  title,
  description,
  children,
  trigger,
  should2FA,
}: {
  title: string;
  description: string;
  trigger: ReactNode;
  children: ReactNode;
  should2FA: boolean;
}) {
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
      <FactorActionForm
        action={authenticatePriorAction}
        initialState={{ type: 'initial' }}
        intent={
          should2FA
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
