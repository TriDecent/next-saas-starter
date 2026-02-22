import { RenderModal } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { FiMail } from 'react-icons/fi';
import { CreateInvitationMultiPageForm } from '../multi-step-form';
import { CreateInvitationSinglePageForm } from '../single-page-form';

export function CreateInvitationModal({
  mode,
}: {
  mode: 'single-page' | 'multi-step';
}) {
  return (
    <RenderModal
      renderTrigger={
        <Button className='gap-2 shadow-sm'>
          <FiMail />
          Invite
        </Button>
      }
    >
      {mode === 'multi-step' ? (
        <CreateInvitationMultiPageForm />
      ) : (
        <CreateInvitationSinglePageForm />
      )}
    </RenderModal>
  );
}
