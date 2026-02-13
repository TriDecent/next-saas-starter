import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Separator,
} from '@/shared/components/ui';
import { FaBuilding } from 'react-icons/fa6';

export function MetadataCard({
  metadata,
  slug,
}: {
  metadata: unknown;
  slug: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
        <CardDescription>
          Extra organization information (if any).
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <div className='bg-muted/30 rounded-lg border p-4'>
          <pre className='overflow-auto text-xs leading-relaxed'>
            {JSON.stringify(metadata)}
          </pre>
        </div>

        <div className='mt-4'>
          <ItemGroup className='gap-2'>
            <Item variant='muted' size='sm' className='w-full'>
              <ItemMedia variant='icon' className='rounded-md'>
                <FaBuilding />
              </ItemMedia>
              <ItemContent className='min-w-0'>
                <ItemTitle className='w-full min-w-0 truncate'>Slug</ItemTitle>
                <ItemDescription className='truncate'>{slug}</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  );
}
