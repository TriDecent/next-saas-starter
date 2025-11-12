import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface WelcomeTemplateProps {
  userName: string;
}

export function WelcomeTemplate({ userName }: WelcomeTemplateProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className='bg-white font-sans'>
          <Container className='mx-auto my-12 w-full max-w-2xl rounded-lg border border-solid border-gray-200 shadow-xl'>
            <Section className='p-8 pb-8 text-center'>
              <div style={{ height: '16px' }} />
              <Heading className='text-3xl font-bold'>
                Welcome to Auth Demo! 🎉
              </Heading>
              <div style={{ height: '16px' }} />
              <Text className='text-base text-gray-600'>
                Hi {userName}, we&apos;re thrilled to have you on board!
                You&apos;ve successfully verified your account and you&apos;re
                all set to get started.
              </Text>
            </Section>

            <Section className='px-6 pb-6'>
              <div className='rounded-lg border border-solid border-green-200 bg-green-50 p-6'>
                <div>
                  <Text className='m-0 font-semibold text-green-700'>
                    What&apos;s Next?
                  </Text>
                  <Text className='m-0 text-green-900'>
                    Explore all the features available to you. We&apos;ve built
                    this platform to make authentication seamless and secure.
                  </Text>
                </div>

                <div style={{ height: '16px' }} />

                <div>
                  <Text className='m-0 font-semibold text-green-700'>
                    Need Help?
                  </Text>
                  <Text className='m-0 text-green-900'>
                    Our support team is always here to help. Don&apos;t hesitate
                    to reach out if you have any questions.
                  </Text>
                </div>
              </div>

              <div style={{ height: '24px' }} />

              <Section className='text-center'>
                <Button
                  href={
                    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
                  }
                  className='rounded-md bg-green-600 px-8 py-3 text-lg font-semibold text-white'
                >
                  Get Started
                </Button>
              </Section>

              <div style={{ height: '24px' }} />
              <Hr className='border-t border-gray-200' />
              <div style={{ height: '24px' }} />

              <Section className='space-y-4'>
                <div className='rounded-lg bg-blue-50 p-4'>
                  <Text className='m-0 font-semibold text-blue-700'>
                    🔐 Security Tips
                  </Text>
                  <Text className='m-0 text-sm text-blue-900'>
                    Keep your account safe by using a strong, unique password
                    and enabling two-factor authentication.
                  </Text>
                </div>

                <div className='rounded-lg bg-purple-50 p-4'>
                  <Text className='m-0 font-semibold text-purple-700'>
                    💡 Pro Tip
                  </Text>
                  <Text className='m-0 text-sm text-purple-900'>
                    You can connect multiple social accounts (GitHub, Discord)
                    to your profile for easier access.
                  </Text>
                </div>
              </Section>
            </Section>

            <Section className='border-t border-gray-200 p-6 text-center text-sm text-gray-500'>
              <Text className='mb-2'>
                Thanks for joining us! We&apos;re excited to see what you build.
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
