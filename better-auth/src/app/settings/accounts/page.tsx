import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/components/ui';

import { ConnectedAccounts } from '@/features/settings/accounts';
import { auth, ensureSession } from '@/lib/auth';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const session = await ensureSession(
    await headers(),
    ROUTES.settings.nested.accounts.href
  );

  return {
    ...ROUTES.settings.nested.accounts.metadata,
    title: `${session.user.name}'s Linked Accounts`,
  };
}

export default async function AccountsPage() {
  const headersList = await headers();
  await ensureSession(headersList, ROUTES.settings.nested.danger.href);

  const accounts = await auth.api.listUserAccounts({ headers: headersList });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Accounts</CardTitle>
        <CardDescription>
          Manage your connected social accounts for easy sign-in and enhanced
          security.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <ConnectedAccounts accounts={accounts} />
      </CardContent>
      <Separator />
      <CardFooter className='text-muted-foreground justify-center text-xs'>
        Click on a provider above to connect your account to social platforms,
        or click again to disconnect.
      </CardFooter>
    </Card>
  );
}
