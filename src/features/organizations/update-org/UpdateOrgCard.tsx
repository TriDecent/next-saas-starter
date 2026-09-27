'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';
import { useOrgContext } from '../context/client';
import { UpdateOrgForm } from './UpdateOrgForm';

export function UpdateOrgCard() {
  const selectedOrg = useOrgContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update organization</CardTitle>
        <CardDescription>Modify your organization settings.</CardDescription>
      </CardHeader>

      <CardContent>
        <UpdateOrgForm id={selectedOrg.id} />
      </CardContent>
    </Card>
  );
}
