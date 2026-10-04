import { AlertCircle, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui';

export type ErrorBlockProps = {
  message?: string;
  title?: string;
  action?:
    | { type: 'link'; href: string; text: string }
    | { type: 'button'; onClick: () => void; text: string };
};

export function ErrorBlock({
  message = 'An unexpected error has occurred',
  title = 'Oops! Something went wrong',
  action,
}: ErrorBlockProps) {
  return (
    <Empty className='border'>
      <EmptyMedia>
        <AlertCircle className='text-destructive h-10 w-10' />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>

      {action ? (
        <EmptyContent>
          {action.type === 'link' ? (
            <Button
              nativeButton={false}
              render={
                <Link href={action.href}>
                  <LinkIcon className='mr-2 size-4' />
                  {action.text}
                </Link>
              }
            />
          ) : (
            <Button onClick={action.onClick}>{action.text}</Button>
          )}
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
