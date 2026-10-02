import { RenderModal } from '@/shared/components/client';
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ItemGroup,
  Separator,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { Organization } from 'better-auth/plugins';
import Link from 'next/link';
import { FaCog, FaLink, FaPlus } from 'react-icons/fa';
import { CreateNewOrganization } from '../create-org/client';
import { ToggleActiveOrg } from '../toggle-active-org/client';
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
  return (
    <OrganizationItem
      organization={organization}
      renderActions={
        <>
          <SetActiveOrgAction
            orgId={organization.id}
            isActive={organization.isActive}
          />
          <Button
            variant='outline'
            size='sm'
            nativeButton={false}
            render={
              <Link
                href={`${ROUTES.organizations.href}/${organization.slug}`}
                className='gap-2'
              >
                <FaLink className='size-4' />
                Open
              </Link>
            }
          />
        </>
      }
    />
  );
}

function SetActiveOrgAction({
  orgId,
  isActive,
}: {
  orgId: Organization['id'];
  isActive: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant='outline' size='sm'>
            <FaCog className='size-4' />
            Settings
          </Button>
        }
      />

      <DropdownMenuContent align='start'>
        <DropdownMenuItem
          render={<ToggleActiveOrg orgId={orgId} isActive={isActive} />}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
