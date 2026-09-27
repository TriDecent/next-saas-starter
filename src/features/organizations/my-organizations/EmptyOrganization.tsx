import { RenderModal } from '@/shared/components/client';
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui';
import { FaBuilding, FaPlus } from 'react-icons/fa';
import { CreateNewOrganization } from '../create-org/client';

export function EmptyOrganization() {
  return (
    <Empty className='border shadow'>
      <EmptyHeader>
        <EmptyMedia variant='icon' className='shadow'>
          <FaBuilding className='text-primary size-5' />
        </EmptyMedia>
        <EmptyTitle>No organizations yet</EmptyTitle>
        <EmptyDescription>
          Create your first organization to invite members and manage access.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <RenderModal
          renderTrigger={
            <Button>
              <FaPlus className='size-4' />
              Create organization
            </Button>
          }
        >
          <CreateNewOrganization />
        </RenderModal>
      </EmptyContent>
    </Empty>
  );
}
