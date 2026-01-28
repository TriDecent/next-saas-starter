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
import { getUserService } from '@/infrastructure/service';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const user = (await getUserService(ROUTES.settings.nested.accounts.href))
    .self;

  return {
    ...ROUTES.settings.nested.accounts.metadata,
    title: `${user.name}'s Linked Accounts`,
  };
}

export default async function AccountsPage() {
  const service = await getUserService(ROUTES.settings.nested.accounts.href);
  const accounts = await service.listMyAccounts();

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
