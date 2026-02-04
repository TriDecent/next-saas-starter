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
        <FormField kind='radio' id='organizationId' name='organizationId'>
          {({ isError, isDisabled }) => (
            <>
              {organizations.map(org => (
                <FieldLabel
                  key={org.id}
                  htmlFor={org.id}
                  className='w-full cursor-pointer rounded-md'
                >
                  <FieldContent>
                    <OrganizationItem
                      organization={org}
                      renderActions={
                        <RadioGroupItem
                          value={org.id}
                          id={org.id}
                          aria-invalid={isError}
                          disabled={isDisabled}
                        />
                      }
                    />
                  </FieldContent>
                </FieldLabel>
              ))}
            </>
          )}
        </FormField>
      )}
    </FieldSet>
  );
}
