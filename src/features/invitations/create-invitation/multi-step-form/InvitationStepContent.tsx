'use client';

import { OrganizationItem, useOrgContext } from '@/features/organizations';
import { SelectRecipientField, SelectRoleField } from '../_shared';

export function InvitationStepContent({ step }: { step: number }) {
  const selectedOrg = useOrgContext();

  switch (step) {
    case 0:
      return (
        <OrganizationItem
          organization={{
            ...selectedOrg,
            logo: selectedOrg.logo ?? null,
            metadata: selectedOrg.metadata ?? null,
            isActive: selectedOrg.isActive ?? false,
          }}
        />
      );

    case 1:
      return <SelectRecipientField recipients={[]} />;

    case 2:
      return <SelectRoleField />;
  }
}
