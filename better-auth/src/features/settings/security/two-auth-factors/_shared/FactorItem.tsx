import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import type { ReactNode } from 'react';

export function FactorItem({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Item variant='outline' size='sm' className='items-start'>
      <ItemMedia variant='icon' className='border-foreground/30'>
        {icon}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription className='line-clamp-3'>
          {description}
        </ItemDescription>
      </ItemContent>
      <ItemActions className='ml-auto'>{children}</ItemActions>
    </Item>
  );
}
