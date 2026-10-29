'use client';

import { FeedbackType } from '@/generated/prisma/enums';
import { CopyText } from '@/shared/components/client';
import {
  BaseFormLayout,
  FormField,
  useActionForm,
} from '@/shared/components/form/client';
import {
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Bug,
  CopyIcon,
  Globe,
  MessageSquare,
  MessageSquarePlus,
  Palette,
  Sparkles,
} from 'lucide-react';
import { startTransition } from 'react';
import { useWatch } from 'react-hook-form';
import { FiMessageSquare } from 'react-icons/fi';
import { toast } from 'sonner';
import {
  MAX_FEEDBACK_LENGTH,
  SubmitFeedbackSchema,
  type SubmitFeedback,
} from './schema';
import { submitFeedbackFormAction } from './submit-feedback-action';

export function FeedbackForm() {
  const formState = useActionForm({
    action: submitFeedbackFormAction,
    initialState: { type: 'initial' },
    formConfiguration: {
      resolver: zodResolver(SubmitFeedbackSchema),
      defaultValues: { message: '', type: 'General', pageUrl: '' } as const,
      mode: 'onTouched',
    },
    onFormSuccess: () => {
      formState.methods.reset();

      toast.success('Feedback submitted successfully!', {
        id: 'submit-feedback',
        description: 'Thank you for your feedback!',
      });
    },
    onFormError: state => {
      toast.error('Failed to submit feedback. Please try again later.', {
        id: 'submit-feedback',
        description: state.payload.message,
      });
    },
    onFormPending: () => {
      toast.loading('Submitting feedback...', {
        id: 'submit-feedback',
        description: 'Please wait while we submit your feedback.',
      });
    },
  });

  return (
    <BaseFormLayout
      {...formState}
      animationRef={formState.animationScope}
      onSubmit={data => {
        startTransition(() => formState.dispatch(data));
      }}
      error={
        formState.state.type === 'error'
          ? formState.state.payload.message
          : undefined
      }
    >
      <FeedbackTypeSelect />
      <MessageTextarea />
      <PageUrlInput />
    </BaseFormLayout>
  );
}

function MessageTextarea() {
  return (
    <FormField
      kind='textarea'
      id='message'
      name='message'
      labelText='Message'
      placeholder='Write your message here...'
      maxLength={MAX_FEEDBACK_LENGTH}
      addons={
        <>
          <InputGroupAddon align={'block-start'}>
            <InputGroupAddon align={'inline-start'} className='p-0'>
              <FiMessageSquare />
            </InputGroupAddon>

            <InputGroupAddon align={'inline-end'} className='ml-auto'>
              <InputGroupButton render={<CopyMessageButton />} />
            </InputGroupAddon>
          </InputGroupAddon>

          <InputGroupAddon align={'block-end'} className='border-t'>
            <InputGroupButton render={<MessageCharCounter />} />
          </InputGroupAddon>
        </>
      }
    />
  );
}

function CopyMessageButton() {
  const message = useWatch<SubmitFeedback>({ name: 'message' });

  return (
    <CopyText text={message} onSuccess={'Copy successful!'} className=''>
      <CopyIcon className='size-4' />
    </CopyText>
  );
}

function MessageCharCounter() {
  const message = useWatch<SubmitFeedback>({ name: 'message' });
  const currentLength = message.length;

  return (
    <InputGroupText>{`${currentLength}/${MAX_FEEDBACK_LENGTH}`}</InputGroupText>
  );
}

function PageUrlInput() {
  return (
    <FormField
      kind='input'
      id='pageUrl'
      name='pageUrl'
      labelText='Page URL'
      addons={
        <InputGroupAddon>
          <Globe />
        </InputGroupAddon>
      }
    />
  );
}

function FeedbackTypeSelect() {
  return (
    <FormField
      kind='select'
      id='type'
      name='type'
      labelText='Type'
      addons={
        <InputGroupAddon align={'inline-start'}>
          <MessageSquarePlus />
        </InputGroupAddon>
      }
      description='What is the type of feedback you want to submit?'
    >
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type</SelectLabel>
          {Object.entries(FEEDBACK_TYPE_CONFIG).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              <span className='flex items-center gap-2'>
                <config.icon className={`${config.color}`} />
                {config.label}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </FormField>
  );
}

const FEEDBACK_TYPE_CONFIG = {
  [FeedbackType.FeatureRequest]: {
    label: 'Feature Request',
    icon: Sparkles,
    color: 'text-amber-500',
  },
  [FeedbackType.Bug]: {
    label: 'Bug Report',
    icon: Bug,
    color: 'text-rose-500',
  },
  [FeedbackType.General]: {
    label: 'General',
    icon: MessageSquare,
    color: 'text-blue-500',
  },
  [FeedbackType.UiUx]: {
    label: 'UI/UX',
    icon: Palette,
    color: 'text-purple-500',
  },
} as const;
