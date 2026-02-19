import type { User } from '@/generated/prisma/client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { cn, getInitials } from '@/shared/utils';

export function UserSummary({
  name,
  email,
  image,
  className,
  contentClassName,
}: Pick<User, 'name' | 'email' | 'image'> & {
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Item className={cn('flex-nowrap p-0', className)}>
      <ItemMedia variant='image'>
        <Avatar>
          <AvatarImage src={image ?? undefined} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent className={cn('max-w-52 items-center', contentClassName)}>
        <ItemTitle className='w-full min-w-0'>
          <span className='truncate'>{name}</span>
        </ItemTitle>
        <ItemDescription className='truncate'>{email}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
