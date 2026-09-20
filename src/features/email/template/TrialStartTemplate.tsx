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

export interface TrialStartTemplateProps {
  subscription: Subscription;
  userName?: string;
}

export function TrialStartTemplate({
  subscription,
  userName,
}: TrialStartTemplateProps) {
  const planName = subscription.plan;
  const trialEndsAt = subscription.trialEnd ?? subscription.periodEnd;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className='bg-white font-sans'>
          <Container className='mx-auto my-12 w-full max-w-2xl rounded-lg border border-solid border-gray-200 shadow-xl'>
            <Section className='p-8 pb-6 text-center'>
              <Heading className='text-3xl font-bold text-sky-700'>
                Your Trial Has Started
              </Heading>

              <div style={{ height: '16px' }} />

              <Text className='text-base text-gray-700'>
                {userName ? `Hi ${userName}, ` : 'Hi, '}
                welcome to your trial on the{' '}
                <span className='font-semibold text-gray-900'>
                  {planName}
                </span>{' '}
                plan.
              </Text>

              <Text className='m-0 text-sm text-gray-500'>
                {trialEndsAt ? (
                  <>
                    Trial end date:{' '}
                    <span className='font-medium text-gray-700'>
                      {format(trialEndsAt, 'MMM dd, yyyy')}
                    </span>
                    .
                  </>
                ) : (
                  'Trial timeline is being finalized. Please check billing settings for details.'
                )}
              </Text>
            </Section>

            <Section className='px-6 pb-6'>
              <div className='rounded-lg border border-solid border-sky-200 bg-sky-50 p-6'>
                <Text className='m-0 font-semibold text-sky-800'>
                  Get the most from your trial
                </Text>
                <Text className='m-0 mt-2 text-sky-950'>
                  Explore premium features now. You can cancel or upgrade your
                  plan at any time before the trial ends.
                </Text>
                <Text className='m-0 mt-2 text-sky-950'>
                  This is a notification email. Please open the website to
                  manage your subscription details.
                </Text>
              </div>

              <div style={{ height: '24px' }} />
              <Hr className='border-t border-gray-200' />
              <div style={{ height: '24px' }} />

              <Text className='m-0 text-center text-sm text-gray-500'>
                Sign in to your account to monitor trial progress and billing.
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
