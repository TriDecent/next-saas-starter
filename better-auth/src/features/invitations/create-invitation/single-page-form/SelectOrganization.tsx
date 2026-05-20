'use client';

import type { OrganizationWithRole } from '@/infrastructure/repositories/organization';
import { FormField } from '@/shared/components/form';
import {
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  RadioGroupItem,
} from '@/shared/components/ui';
import { useFormContext } from 'react-hook-form';
import {
  EmptyOrganization,
  OrganizationItem,
} from '../../../organizations/my-organizations';
import type { CreateInvitationSchema } from '../_shared/schema';

export function SelectOrganization({
  organizations,
  activeOrgId,
}: {
  organizations: OrganizationWithRole[];
  activeOrgId: string | null;
}) {
  const { setValue } = useFormContext<CreateInvitationSchema>();

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
        <FormField kind='radio-group' id='organizationId' name='organizationId'>
          {({ isError, isDisabled }) =>
            organizations.map(org => (
              <FieldLabel
                key={org.id}
                htmlFor={org.id}
                className='w-full rounded-md'
              >
                <FieldContent>
                  <OrganizationItem
                    organization={{ ...org, isActive: activeOrgId === org.id }}
                    renderActions={
                      <RadioGroupItem
                        value={org.id}
                        id={org.id}
                        aria-invalid={isError}
                        disabled={isDisabled}
                        onClick={() => setValue('selectedOrganization', org)}
                      />
                    }
                  />
                </FieldContent>
              </FieldLabel>
            ))
          }
        </FormField>
      )}
    </FieldSet>
  );
}
