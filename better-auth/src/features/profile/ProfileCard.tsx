import { SignOutButton } from '@/features/home/SignOutButton';
import type { Account } from '@/generated/prisma/client';
import type { AuthSession } from '@/lib/auth';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  ButtonGroup,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/components/ui';
import { format } from 'date-fns';
import { MailCheck, ShieldAlert } from 'lucide-react';
import { ConnectedAccounts } from './ConnectedAccounts';
import { EditProfileDialog } from './EditProfileDialog';

type ProfileCardProps = {
  user: AuthSession['user'];
  accounts: Account[];
};

export function ProfileCard({ user, accounts }: ProfileCardProps) {
  return (
    <Card className='mx-auto w-full max-w-xl'>
      <CardHeader>
        <Summary {...user} />
        <CardAction>
          <ButtonGroup orientation={'vertical'}>
            <EditProfileDialog user={user} />
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

      <CardFooter className='text-muted-foreground justify-center text-xs'>
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
  favoriteNumber,
}: Pick<
  ProfileCardProps['user'],
  'emailVerified' | 'createdAt' | 'favoriteNumber'
>) {
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

        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Favorite Number</span>
          <span className='font-medium'>{favoriteNumber}</span>
        </div>
      </div>
    </div>
  );
}
