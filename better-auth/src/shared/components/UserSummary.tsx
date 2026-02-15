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
import { cn } from '@/shared/utils';

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

export function getInitials(name: string) {
  const n = name.trim();
  if (!n) return 'U';

  const parts = n.split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase()).join('');
}
