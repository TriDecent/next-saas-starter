import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui';
import { FaShieldAlt } from 'react-icons/fa';
import { FaBuilding, FaEnvelope } from 'react-icons/fa6';

export function InvitationSummary() {
  return (
    <Card className='py-0'>
      <CardHeader className='border-b py-4'>
        <CardTitle className='text-sm'>Summary</CardTitle>
        <CardDescription className='text-xs'>
          Preview of what will be sent.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-3 py-4'>
        <Item variant='muted' size='sm' className='w-full'>
          <ItemMedia variant='icon' className='rounded-md'>
            <FaBuilding />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Selected organization</ItemTitle>
            <ItemDescription>Not selected</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant='muted' size='sm' className='w-full'>
          <ItemMedia variant='icon' className='rounded-md'>
            <FaEnvelope />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Recipient</ItemTitle>
            <ItemDescription>—</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant='muted' size='sm' className='w-full'>
          <ItemMedia variant='icon' className='rounded-md'>
            <FaShieldAlt />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Role</ItemTitle>
            <ItemDescription>Member</ItemDescription>
          </ItemContent>
        </Item>

        <div className='text-muted-foreground rounded-lg border border-dashed p-3 text-xs'>
          You can customize the email content later (optional).
        </div>
      </CardContent>
    </Card>
  );
}
