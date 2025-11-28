import { DeleteAccountFlow } from '@/features/settings/danger';
import { ensureSession } from '@/lib';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  Separator,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import z from 'zod';

export const metadata: Metadata = ROUTES.settings.nested.danger.metadata;

const searchParamsSchema = z.object({ token: z.string().optional() });

export default async function DangerPage({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  await ensureSession(await headers(), ROUTES.settings.nested.danger.href);
  const parsedResult = searchParamsSchema.safeParse(await searchParams);
  const token = parsedResult.success ? parsedResult.data.token : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-destructive flex items-center gap-2'>
          <AlertTriangle className='text-destructive size-5' />
          Danger Zone
        </CardTitle>
        <CardDescription>
          The action below is{' '}
          <span className='text-destructive font-semibold'>dangerous</span> and
          cannot be undone. Please make sure before proceeding.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <Item variant='muted' size='sm'>
          <ItemMedia
            variant={'icon'}
            className='text-destructive border-destructive'
          >
            <Trash2 />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className='text-destructive'>Delete Account</ItemTitle>
            <ItemDescription className='line-clamp-none text-pretty'>
              Permanently delete your account and all related data. This action
              cannot be undone.
            </ItemDescription>
          </ItemContent>
          <ItemActions className='mt-6 w-full min-w-32'>
            <DeleteAccountFlow token={token} />
          </ItemActions>
        </Item>
      </CardContent>
    </Card>
  );
}
