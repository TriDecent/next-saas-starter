import { SignOutButton } from '@/features/home/SignOutButton';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Separator,
} from '@/features/shared/components/ui';
import type { Account } from '@/generated/prisma/client';
import { SUPPORTED_OAUTH_PROVIDERS } from '@/lib';
import type { User } from 'better-auth/types';
import { format } from 'date-fns';
import { MailCheck, ShieldAlert } from 'lucide-react';
import { GoUnverified, GoVerified } from 'react-icons/go';

type ProfileCardProps = {
  user: User;
  accounts: Account[];
};

export function ProfileCard({ user, accounts }: ProfileCardProps) {
  return (
    <Card className='mx-auto w-full max-w-xl'>
      <CardHeader>
        <Summary {...user} />
        <CardAction>
          <ButtonGroup orientation={'vertical'}>
            <Button variant='outline'>Edit Profile</Button>
            <SignOutButton />
          </ButtonGroup>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent className='space-y-8'>
        <Details {...user} />

        <Separator />

        <ConnectedAccounts accounts={accounts} />
      </CardContent>

      <Separator />

      <CardFooter className='text-muted-foreground justify-center text-sm'>
        Click on a provider above to connect your account to social platforms.
      </CardFooter>
    </Card>
  );
}

function Summary({
  name,
  email,
  image,
}: Pick<ProfileCardProps['user'], 'email' | 'name' | 'image'>) {
  return (
    <>
      <Avatar className='h-20 w-20 border'>
        <AvatarImage src={image ?? undefined} alt={name} />
        <AvatarFallback className='text-2xl font-bold'>
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <CardTitle className='line-clamp-2 text-ellipsis'>{name}</CardTitle>
      <CardDescription className='line-clamp-1 text-ellipsis'>
        {email}
      </CardDescription>
    </>
  );
}

function Details({
  emailVerified,
  createdAt,
}: Pick<ProfileCardProps['user'], 'emailVerified' | 'createdAt'>) {
  return (
    <div className='space-y-2.5'>
      <h3 className='text-sm font-medium text-gray-500'>Account Details</h3>
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Email Status</span>
          {emailVerified ? (
            <Badge className='border-green-600 bg-green-50 text-green-700'>
              <MailCheck className='mr-1 h-4 w-4' />
              Verified
            </Badge>
          ) : (
            <Badge variant='destructive'>
              <ShieldAlert className='mr-1 h-4 w-4' />
              Not Verified
            </Badge>
          )}
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Member Since</span>
          <span className='font-medium'>{format(createdAt, 'PPP')}</span>
        </div>
      </div>
    </div>
  );
}

function ConnectedAccounts({ accounts }: Pick<ProfileCardProps, 'accounts'>) {
  return accounts && accounts.length > 0 ? (
    <div className='space-y-2.5'>
      <h3 className='mb-2 text-sm font-medium text-gray-500'>
        Connected Accounts
      </h3>
      <ItemGroup className='space-y-4'>
        {SUPPORTED_OAUTH_PROVIDERS.map(supportedProvider => {
          const isConnected = accounts.some(
            account => account.providerId === supportedProvider.name
          );

          return (
            <Item
              key={supportedProvider.name}
              variant='outline'
              size='sm'
              asChild
              className='transition-transform hover:scale-105 hover:cursor-pointer active:scale-105'
            >
              <button>
                <ItemMedia variant='icon'>
                  <supportedProvider.icon />
                </ItemMedia>

                <ItemContent>
                  <ItemTitle className='capitalize'>
                    {supportedProvider.name}
                  </ItemTitle>
                </ItemContent>

                {isConnected ? (
                  <Badge variant={'success'} className='w-30 text-sm'>
                    <GoVerified />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant='destructive' className='w-30 text-sm'>
                    <GoUnverified size={'16'} />
                    Unconnected
                  </Badge>
                )}
              </button>
            </Item>
          );
        })}
      </ItemGroup>
    </div>
  ) : null;
}
