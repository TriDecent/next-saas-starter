import { cn } from '@/shared/utils';
import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import type { IconType } from 'react-icons';

interface PageHeaderProps {
  icon: LucideIcon | IconType;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  className,
}: PageHeaderProps) {
  const sizes = useMemo(
    () => ({
      icon: 'h-16 w-16',
      iconInner: 'h-8 w-8',
      title: 'text-3xl sm:text-4xl',
      description: 'text-lg',
    }),
    []
  );

  return (
    <div className={cn('space-y-4 text-center', className)}>
      {Icon ? (
        <div
          className={cn(
            'bg-primary/10 mx-auto flex items-center justify-center rounded-full',
            sizes.icon
          )}
        >
          <Icon className={cn('text-primary', sizes.iconInner)} />
        </div>
      ) : null}
      <div className='space-y-2'>
        <h2 className={cn('font-bold tracking-tight', sizes.title)}>{title}</h2>
        {description ? (
          <p
            className={cn(
              'text-muted-foreground mx-auto max-w-2xl',
              sizes.description
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
