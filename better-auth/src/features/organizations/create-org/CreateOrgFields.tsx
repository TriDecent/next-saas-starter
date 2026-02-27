'use client';

import type { CreateOrgInput } from '@/services';
import { FormField } from '@/shared/components/form';
import { InputGroupAddon } from '@/shared/components/ui';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CgRename } from 'react-icons/cg';
import { FiLink } from 'react-icons/fi';

export function CreateOrgFields() {
  const { control, setValue, formState } = useFormContext<CreateOrgInput>();

  const orgName = useWatch({ control: control, name: 'name' });

  useEffect(() => {
    if (formState.dirtyFields.slug) return;

    setValue('slug', slugify(orgName));
  }, [setValue, orgName, formState.dirtyFields.slug]);

  return (
    <>
      <FormField
        kind='input'
        id='name'
        labelText='Name'
        name='name'
        autoComplete='organization'
        addons={
          <InputGroupAddon>
            <CgRename />
          </InputGroupAddon>
        }
      />

      <FormField
        kind='input'
        id='slug'
        labelText='Slug'
        name='slug'
        addons={
          <InputGroupAddon>
            <FiLink />
          </InputGroupAddon>
        }
      />
    </>
  );
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
