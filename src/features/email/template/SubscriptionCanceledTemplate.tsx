import type { Subscription } from '@better-auth/stripe';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { format } from 'date-fns';
import type Stripe from 'stripe';

export type SubscriptionCanceledTemplateProps = {
  data: {
    subscription: Subscription;
    cancellationDetails?: Stripe.Subscription.CancellationDetails | null;
  };
  userName?: string;
};

export function SubscriptionCanceledTemplate({
  data: data,
  userName,
}: SubscriptionCanceledTemplateProps) {
  const planName = data.subscription.plan;
  const canceledAt =
    data.subscription.canceledAt ??
    data.subscription.endedAt ??
    data.subscription.cancelAt;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className='bg-white font-sans'>
          <Container className='mx-auto my-12 w-full max-w-2xl rounded-lg border border-solid border-gray-200 shadow-xl'>
            <Section className='p-8 pb-6 text-center'>
              <Heading className='text-3xl font-bold text-slate-800'>
                Subscription Canceled
              </Heading>
              <div style={{ height: '16px' }} />
              <Text className='text-base text-gray-700'>
                {userName ? `Hi ${userName}, ` : 'Hi, '}
                your subscription for the{' '}
                <span className='font-semibold text-gray-900'>
                  {planName}
                </span>{' '}
                plan has been canceled.
              </Text>

              {canceledAt ? (
                <Text className='m-0 text-sm text-gray-500'>
                  Effective date:{' '}
                  <span className='font-medium text-gray-700'>
                    {format(canceledAt, 'MMM dd, yyyy')}
                  </span>
                  .
                </Text>
              ) : null}
            </Section>

            <Section className='px-6 pb-6'>
              <div className='rounded-lg border border-solid border-slate-200 bg-slate-50 p-6'>
                <Text className='m-0 font-semibold text-slate-800'>
                  Cancellation details
                </Text>
                <Text className='m-0 mt-2 text-slate-900'>
                  Reason:{' '}
                  <span className='font-medium'>
                    {data.cancellationDetails?.reason ?? 'not provided'}
                  </span>
                  .
                </Text>
                {data.cancellationDetails?.comment ? (
                  <Text className='m-0 mt-2 text-slate-900'>
                    Note: {data.cancellationDetails.comment}
                  </Text>
                ) : null}
                {data.cancellationDetails?.feedback ? (
                  <Text className='m-0 mt-2 text-slate-900'>
                    Feedback: {data.cancellationDetails.feedback}
                  </Text>
                ) : null}
                <Text className='m-0 mt-2 text-slate-900'>
                  This email is for notification only. Please sign in to your
                  account to review billing and subscription history.
                </Text>
              </div>

              <div style={{ height: '24px' }} />
              <Hr className='border-t border-gray-200' />
              <div style={{ height: '24px' }} />

              <Text className='m-0 text-center text-sm text-gray-500'>
                Access your account dashboard to re-subscribe when needed.
              </Text>
            </Section>

            <Section className='border-t border-gray-200 p-6 text-center text-sm text-gray-500'>
              <Text className='mb-2'>
                This is an automated message, please do not reply.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
