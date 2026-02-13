import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { cn } from '@/shared/utils';

export function Kpi({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <Item variant={'outline'} className='bg-muted/20'>
      <ItemContent className='min-w-0 gap-3'>
        <ItemTitle className='text-muted-foreground'>
          <ItemMedia variant={'icon'} className='text-muted-foreground shadow'>
            {icon}
          </ItemMedia>
          <span className='font-medium'>{label}</span>
        </ItemTitle>
        <ItemDescription
          className={cn(
            'text-foreground truncate text-sm font-semibold',
            mono ? 'font-mono' : ''
          )}
        >
          {value}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
