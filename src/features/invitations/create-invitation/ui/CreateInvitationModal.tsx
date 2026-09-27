import { RenderModal } from '@/shared/components/client';
import { Button } from '@/shared/components/ui';
import { FiMail } from 'react-icons/fi';
import { CreateInvitationMultiStepForm } from '../multi-step-form/client';
import { CreateInvitationSinglePageForm } from '../single-page-form';

export function CreateInvitationModal({
  mode,
  renderTrigger,
}: {
  mode: 'single-page' | 'multi-step';
  renderTrigger?: React.ReactNode;
}) {
  return (
    <RenderModal
      renderTrigger={
        renderTrigger ?? (
          <Button className='gap-2 shadow-sm'>
            <FiMail />
            Invite
          </Button>
        )
      }
    >
      {mode === 'multi-step' ? (
        <CreateInvitationMultiStepForm />
      ) : (
        <CreateInvitationSinglePageForm />
      )}
    </RenderModal>
  );
}
