'use client';

import { OrganizationItem } from '@/features/organizations';
import { useOrgContext } from '@/features/organizations/client';
import { SelectRecipientField, SelectRoleField } from '../_shared/client';

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
