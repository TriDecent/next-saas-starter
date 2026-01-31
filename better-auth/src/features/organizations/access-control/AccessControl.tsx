import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  Separator,
} from '@/shared/components/ui';
import Link from 'next/link';

import { FaArrowRight, FaShieldAlt } from 'react-icons/fa';

export function AccessControl() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FaShieldAlt className='text-muted-foreground size-4' />
          Access & roles
        </CardTitle>
        <CardDescription>Keep your org secure and organized.</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className='space-y-3 text-sm'>
        <Item variant={'outline'}>
          <ItemContent>
            <ItemTitle>Tip</ItemTitle>
            <ItemDescription>
              Use roles to control what members can do across projects and
              settings.
            </ItemDescription>
          </ItemContent>
        </Item>

        <Button variant='outline' className='w-full' asChild>
          <Link href='/settings/security' className='gap-2'>
            Review security settings <FaArrowRight className='size-4' />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
