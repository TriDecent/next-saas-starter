import { OAUTH_PROVIDERS } from '@/features/auth/oauth';
import { ConnectedAccounts } from '@/features/settings/client';
import { getUserService } from '@/infrastructure/composition/factory';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const user = (await getUserService(ROUTES.settings.nested.accounts.href))
    .actor;

  return {
    ...ROUTES.settings.nested.accounts.metadata,
    title: `${user.name}'s Linked Accounts`,
  };
}

export default async function AccountsPage() {
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
        <h3 className='mb-2 text-sm font-medium text-gray-500'>
          Connected Accounts
        </h3>

        <Suspense fallback={<AccountsContentSkeleton />}>
          <AccountsContent />
        </Suspense>
      </CardContent>

      <CardFooter className='text-muted-foreground justify-center text-xs'>
        Click on a provider above to connect your account to social platforms,
        or click again to disconnect.
      </CardFooter>
    </Card>
  );
}

async function AccountsContent() {
  const service = await getUserService(ROUTES.settings.nested.accounts.href);
  const accounts = await service.listMyAccounts();

  return <ConnectedAccounts accounts={accounts} />;
}

function AccountsContentSkeleton() {
  return (
    <div className='space-y-4'>
      {OAUTH_PROVIDERS.map(provider => (
        <Skeleton key={provider.name} className='h-8 w-full' />
      ))}
    </div>
  );
}
