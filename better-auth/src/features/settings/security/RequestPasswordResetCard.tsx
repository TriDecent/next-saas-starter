import { SendResetPasswordButton } from '@/shared/components';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { IoWarningOutline } from 'react-icons/io5';

export function RequestPasswordResetCard({ email }: { email: string }) {
  return (
    <Item variant={'muted'}>
      <ItemMedia variant='icon'>
        <IoWarningOutline size={28} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>You haven&apos;t set a password</ItemTitle>
      </ItemContent>
      <ItemActions>
        <SendResetPasswordButton email={email} />
      </ItemActions>
      <ItemDescription className='line-clamp-none text-pretty'>
        Your account currently does not have a password. Set a password to
        increase security and make it easier to log in with your email.
      </ItemDescription>
    </Item>
  );
}
