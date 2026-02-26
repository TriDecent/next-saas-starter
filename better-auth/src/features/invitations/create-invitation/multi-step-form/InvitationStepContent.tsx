'use client';

import { OrganizationItem, useOrgContext } from '@/features/organizations';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  SelectRecipientField,
  SelectRoleField,
  type CreateInvitationSchema,
} from '../_shared';

export function InvitationStepContent({ step }: { step: 0 | 1 | 2 }) {
  const selectedOrg = useOrgContext();
  const { setValue } = useFormContext<CreateInvitationSchema>();

  useEffect(() => {
    setValue('organizationId', selectedOrg.id, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [selectedOrg.id, setValue]);

  switch (step) {
    case 0:
      return (
        <OrganizationItem
          organization={{
            ...selectedOrg,
            logo: selectedOrg.logo ?? null,
            metadata: selectedOrg.metadata ?? null,
          }}
        />
      );

    case 1:
      return <SelectRecipientField recipients={[]} />;

    case 2:
      return <SelectRoleField />;
  }
}
