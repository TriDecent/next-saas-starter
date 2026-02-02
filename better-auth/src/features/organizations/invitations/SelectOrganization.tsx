'use client';

import type { OrganizationWithRole } from '@/infrastructure/repositories/organization';
import {
  FieldDescription,
  FieldLegend,
  FieldSet,
  ItemGroup,
} from '@/shared/components/ui';
import { EmptyOrganization, OrganizationItem } from '../my-organizations';

export function SelectOrganization({
  organizations,
}: {
  organizations: OrganizationWithRole[];
}) {
  return (
    <FieldSet>
      <FieldLegend className='text-sm font-semibold'>
        1) Organization
      </FieldLegend>

      <FieldDescription>
        Select the organization you want to invite someone to.
      </FieldDescription>

      {organizations.length === 0 ? (
        <EmptyOrganization />
      ) : (
        <ItemGroup className='gap-3'>
          {organizations.map(org => (
            <OrganizationItem
              key={org.id}
              organization={org}
              renderActions={<></>}
            />
          ))}
        </ItemGroup>
      )}
    </FieldSet>
  );
}
