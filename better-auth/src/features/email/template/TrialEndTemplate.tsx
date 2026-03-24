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

export type TrialEndTemplateProps = {
  subscription: Subscription;
  userName?: string;
};

export function TrialEndTemplate({
  subscription,
  userName,
}: TrialEndTemplateProps) {
  const planName = subscription.plan;
  const trialEndsAt = subscription.trialEnd ?? subscription.periodEnd;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className='bg-white font-sans'>
          <Container className='mx-auto my-12 w-full max-w-2xl rounded-lg border border-solid border-gray-200 shadow-xl'>
            <Section className='p-8 pb-6 text-center'>
              <Heading className='text-3xl font-bold text-amber-700'>
                Your Trial Is Ending Soon
              </Heading>

              <div style={{ height: '16px' }} />

              <Text className='text-base text-gray-700'>
                {userName ? `Hi ${userName}, ` : 'Hi, '}
                your trial for the{' '}
                <span className='font-semibold text-gray-900'>
                  {planName}
                </span>{' '}
                plan is almost over.
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
                  'Your trial is ending. Check your billing page to avoid interruption.'
                )}
              </Text>
            </Section>

            <Section className='px-6 pb-6'>
              <div className='rounded-lg border border-solid border-amber-200 bg-amber-50 p-6'>
                <Text className='m-0 font-semibold text-amber-800'>
                  Keep your access uninterrupted
                </Text>
                <Text className='m-0 mt-2 text-amber-950'>
                  Upgrade now to continue using premium features without
                  interruption after your trial ends.
                </Text>
                <Text className='m-0 mt-2 text-amber-950'>
                  This is a notification email. Please access the website to
                  review available plans.
                </Text>
              </div>

              <div style={{ height: '24px' }} />
              <Hr className='border-t border-gray-200' />
              <div style={{ height: '24px' }} />

              <Text className='m-0 text-center text-sm text-gray-500'>
                Sign in to your account to continue service without
                interruption.
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
