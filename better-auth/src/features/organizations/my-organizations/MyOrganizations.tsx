import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ItemGroup,
  Separator,
} from '@/shared/components/ui';
import Link from 'next/link';
import { FaCog, FaLink, FaPlus } from 'react-icons/fa';
import { RenderModal } from '../_shared';
import { CreateNewOrganization } from '../create-org';
import { EmptyOrganization } from './EmptyOrganization';
import { OrganizationItem, type OrganizationRow } from './OrganizationItem';

export function MyOrganizations({
  organizations,
}: {
  organizations: OrganizationRow[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-end gap-x-2'>
          <span>Your organizations</span>
          <Badge variant={'outline'}>{organizations.length}</Badge>
        </CardTitle>

        <CardDescription>
          Switch between orgs, manage members, and permissions.
        </CardDescription>

        <CardAction>
          <RenderModal
            renderTrigger={
              <Button>
                <FaPlus className='size-4' />
                Create
              </Button>
            }
          >
            <CreateNewOrganization />
          </RenderModal>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent>
        {organizations.length === 0 ? (
          <EmptyOrganization />
        ) : (
          <ItemGroup className='gap-3'>
            {organizations.map(organization => (
              <OrganizationDisplay
                key={organization.id}
                organization={organization}
              />
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}

function OrganizationDisplay({
  organization,
}: {
  organization: OrganizationRow;
}) {
  const href = `/organizations/${organization.slug}`;
  const settingsHref = `/organizations/${organization.slug}/settings`;

  return (
    <OrganizationItem
      organization={organization}
      renderActions={
        <>
          <Button variant='outline' size='sm' asChild>
            <Link href={settingsHref} className='gap-2'>
              <FaCog className='size-4' />
              Settings
            </Link>
          </Button>
          <Button variant='outline' size='sm' asChild>
            <Link href={href} className='gap-2'>
              <FaLink className='size-4' />
              Open
            </Link>
          </Button>
        </>
      }
    />
  );
}
