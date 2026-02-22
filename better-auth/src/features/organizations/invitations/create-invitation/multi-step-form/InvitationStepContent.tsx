'use client';

import { useOrgContext } from '@/features/organizations/[slug]/context';
import { OrganizationItem } from '@/features/organizations/my-organizations';
import { SelectRecipientField, SelectRoleField } from '../_shared';

export function InvitationStepContent({ step }: { step: 0 | 1 | 2 }) {
  const selectedOrg = useOrgContext();

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
