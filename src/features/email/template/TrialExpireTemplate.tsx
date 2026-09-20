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

export interface TrialExpireTemplateProps {
  subscription: Subscription;
  userName?: string;
}

export function TrialExpireTemplate({
  subscription,
  userName,
}: TrialExpireTemplateProps) {
  const planName = subscription.plan;
  const expiredAt =
    subscription.trialEnd ??
    subscription.endedAt ??
    subscription.canceledAt ??
    subscription.periodEnd;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className='bg-white font-sans'>
          <Container className='mx-auto my-12 w-full max-w-2xl rounded-lg border border-solid border-gray-200 shadow-xl'>
            <Section className='p-8 pb-6 text-center'>
              <Heading className='text-3xl font-bold text-rose-700'>
                Your Trial Has Expired
              </Heading>

              <div style={{ height: '16px' }} />

              <Text className='text-base text-gray-700'>
                {userName ? `Hi ${userName}, ` : 'Hi, '}
                your trial for the{' '}
                <span className='font-semibold text-gray-900'>
                  {planName}
                </span>{' '}
                {expiredAt ? (
                  <>
                    plan ended on{' '}
                    <span className='font-semibold text-gray-900'>
                      {format(expiredAt, 'MMM dd, yyyy')}
                    </span>
                    .
                  </>
                ) : (
                  'plan has expired.'
                )}
              </Text>
            </Section>

            <Section className='px-6 pb-6'>
              <div className='rounded-lg border border-solid border-rose-200 bg-rose-50 p-6'>
                <Text className='m-0 font-semibold text-rose-800'>
                  Reactivate to continue
                </Text>
                <Text className='m-0 mt-2 text-rose-950'>
                  Upgrade your plan to restore access to premium features and
                  keep building without limits.
                </Text>
                <Text className='m-0 mt-2 text-rose-950'>
                  This is a notification email. Please sign in to your account
                  to reactivate a plan.
                </Text>
              </div>

              <div style={{ height: '24px' }} />
              <Hr className='border-t border-gray-200' />
              <div style={{ height: '24px' }} />

              <Text className='m-0 text-center text-sm text-gray-500'>
                Visit the website to choose a new subscription and continue
                using premium features.
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
