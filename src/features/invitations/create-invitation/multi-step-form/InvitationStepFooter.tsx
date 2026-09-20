'use client';

import { Button, CardFooter } from '@/shared/components/ui';

export function InvitationStepFooter({
  isFirst,
  isLast,
  onBack,
  onNext,
}: {
  isFirst: boolean;
  isLast: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <CardFooter className='flex items-center justify-between gap-2'>
      <Button
        type='button'
        variant='outline'
        disabled={isFirst}
        onClick={onBack}
      >
        Back
      </Button>

      {!isLast ? (
        <Button type='button' onClick={onNext}>
          Next
        </Button>
      ) : (
        <p className='text-muted-foreground text-xs'>
          Review once, then submit invitation.
        </p>
      )}
    </CardFooter>
  );
}
