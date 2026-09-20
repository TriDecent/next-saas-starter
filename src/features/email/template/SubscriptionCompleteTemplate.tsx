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

export type SubscriptionCompleteTemplateProps = {
  subscription: Subscription;
  userName?: string;
};

export function SubscriptionCompleteTemplate({
  subscription,
  userName,
}: SubscriptionCompleteTemplateProps) {
  const planName = subscription.plan;
  const startsAt = subscription.periodStart;
  const endsAt = subscription.periodEnd;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className='bg-white font-sans'>
          <Container className='mx-auto my-12 w-full max-w-2xl rounded-lg border border-solid border-gray-200 shadow-xl'>
            <Section className='p-8 pb-6 text-center'>
              <Heading className='text-3xl font-bold text-emerald-700'>
                Subscription Completed
              </Heading>
              <div style={{ height: '16px' }} />
              <Text className='text-base text-gray-700'>
                {userName ? `Hi ${userName}, ` : 'Hi, '}
                your subscription to the{' '}
                <span className='font-semibold text-gray-900'>
                  {planName}
                </span>{' '}
                plan is now active.
              </Text>

              {startsAt ? (
                <Text className='m-0 text-sm text-gray-500'>
                  Billing period started on{' '}
                  <span className='font-medium text-gray-700'>
                    {format(startsAt, 'MMM dd, yyyy')}
                  </span>
                  .
                </Text>
              ) : null}

              {endsAt ? (
                <Text className='m-0 text-sm text-gray-500'>
                  Current period ends on{' '}
                  <span className='font-medium text-gray-700'>
                    {format(endsAt, 'MMM dd, yyyy')}
                  </span>
                  .
                </Text>
              ) : null}
            </Section>

            <Section className='px-6 pb-6'>
              <div className='rounded-lg border border-solid border-emerald-200 bg-emerald-50 p-6'>
                <Text className='m-0 font-semibold text-emerald-800'>
                  You now have full access
                </Text>
                <Text className='m-0 mt-2 text-emerald-950'>
                  Your payment was successful and premium features are ready to
                  use.
                </Text>
                <Text className='m-0 mt-2 text-emerald-950'>
                  This email is for notification only. Please sign in to your
                  account to review billing details.
                </Text>
              </div>

              <div style={{ height: '24px' }} />
              <Hr className='border-t border-gray-200' />
              <div style={{ height: '24px' }} />

              <Text className='m-0 text-center text-sm text-gray-500'>
                You can view your latest subscription status from the
                Subscription page after logging in.
              </Text>
            </Section>

            <Section className='border-t border-gray-200 p-6 text-center text-sm text-gray-500'>
              <Text className='mb-2'>
                Thank you for supporting us. We are excited to have you on this
                plan.
              </Text>
              <Text className='text-xs'>
                This is an automated message, please do not reply.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
