'use client';

import type { Organization } from '@/generated/prisma/client';
import type { OrganizationWithRole } from '@/infrastructure/repositories/organization';
import { FormField } from '@/shared/components/form/client';
import { RadioGroupItem } from '@/shared/components/ui';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/shared/components/ui/client';
import { useFormContext } from 'react-hook-form';
import {
  EmptyOrganization,
  OrganizationItem,
} from '../../../organizations/my-organizations';
import type { CreateInvitationSchemaType } from '../schema';

export function SelectOrganization({
  organizations,
  activeOrgId,
}: {
  organizations: OrganizationWithRole[];
  activeOrgId: string | null;
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
        <FormField kind='radio-group' id='organizationId' name='organizationId'>
          {({ isError, isDisabled }) =>
            organizations.map(org => (
              <OrgField
                key={org.id}
                org={{
                  ...org,
                  isActive: activeOrgId === org.id,
                }}
                isError={isError}
                isDisabled={isDisabled}
              />
            ))
          }
        </FormField>
      )}
    </FieldSet>
  );
}

function OrgField({
  org,
  isError,
  isDisabled,
}: {
  org: Organization & { isActive: boolean };
  isError: boolean;
  isDisabled: boolean;
}) {
  const { setValue } = useFormContext<CreateInvitationSchemaType>();

  return (
    <Field data-invalid={isError} data-disabled={isDisabled}>
      <FieldLabel htmlFor={org.id} className='w-full rounded-md'>
        <FieldContent>
          <OrganizationItem
            organization={org}
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
    </Field>
  );
}
