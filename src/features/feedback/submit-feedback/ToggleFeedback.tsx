import { DrawerDialog } from '@/shared/components/client';
import { Button, ScrollArea } from '@/shared/components/ui';
import { MessageSquareText } from 'lucide-react';
import { FeedbackForm } from './FeedbackForm';

export function ToggleFeedback({ className }: { className?: string }) {
  return (
    <DrawerDialog
      trigger={
        <Button variant='outline' className={className}>
          <MessageSquareText className='size-4' />
          <span>Feedback</span>
        </Button>
      }
      title='Submit your feedback'
      description='We value your feedback and would love to hear from you. Please share your thoughts, suggestions, or any issues you have encountered. Your input helps us improve our product and provide a better experience for all users.'
      content={
        <ScrollArea className='h-96 mask-b-from-70% mask-b-to-100%'>
          <FeedbackForm />
        </ScrollArea>
      }
    />
  );
}
