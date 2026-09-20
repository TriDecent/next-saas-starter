import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ItemGroup,
  Separator,
} from '@/shared/components/ui';
import { SelectedOrgItem } from './SelectedOrgItem';
import { SelectedRecipient } from './SelectedRecipient';
import { SelectedRole } from './SelectedRole';

export function InvitationSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>Preview of what will be sent.</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <ItemGroup className='space-y-3'>
          <SelectedOrgItem />

          <SelectedRecipient />

          <SelectedRole />
        </ItemGroup>
      </CardContent>

      <Separator />

      <CardFooter>
        <p className='text-muted-foreground rounded-lg border border-dashed p-3 text-xs mx-auto'>
          You can customize the email content later (optional).
        </p>
      </CardFooter>
    </Card>
  );
}
