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

interface EmailVerificationTemplateProps {
  userName?: string;
  verificationUrl: string;
  expiresIn?: string;
}

export function EmailVerificationTemplate({
  userName,
  verificationUrl,
  expiresIn,
}: EmailVerificationTemplateProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className='bg-white font-sans'>
          <Container className='mx-auto my-12 w-full max-w-2xl rounded-lg border border-solid border-gray-200 shadow-xl'>
            <Section className='p-8 pb-8 text-center'>
              <div style={{ height: '16px' }} />
              <Heading className='text-3xl font-bold'>
                Verify Your Email Address
              </Heading>
              <div style={{ height: '16px' }} />
              <Text className='text-base text-gray-600'>
                {userName ? `Hi ${userName}, welcome aboard! ` : 'Welcome! '}
                We&apos;re excited to have you get started. First, you need to
                confirm your account.
              </Text>
            </Section>
            <Section className='px-6 pb-6'>
              <div className='rounded-lg bg-gray-100 p-6'>
                <div>
                  <Text className='m-0 font-semibold'>Why verify</Text>
                  <Text className='m-0 text-gray-700'>
                    Verification helps us ensure the security of your account
                    and that we can reach you with important updates.
                  </Text>
                </div>
                <div style={{ height: '16px' }} />
                <div>
                  <Text className='m-0 font-semibold'>Act quickly</Text>
                  <Text className='m-0 text-gray-700'>
                    This verification link will expire in {expiresIn}. After
                    that, you&apos;ll need to request a new one.
                  </Text>
                </div>
              </div>
              <div style={{ height: '24px' }} />
              <Section className='text-center'>
                <Button
                  href={verificationUrl}
                  className='rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white'
                >
                  Verify Email Address
                </Button>
              </Section>
              <div style={{ height: '24px' }} />
              <Hr className='border-t border-gray-200' />
              <div style={{ height: '24px' }} />
              <Section className='text-center text-sm text-gray-500'>
                <Text>Or copy and paste this link into your browser:</Text>
                <Text className='mt-2 rounded bg-gray-100 p-3 font-mono text-xs break-all'>
                  {verificationUrl}
                </Text>
              </Section>
            </Section>
            <Section className='border-t border-gray-200 p-6 text-center text-sm text-gray-500'>
              <Text className='mb-2'>
                If you didn&apos;t create an account, you can safely ignore this
                email.
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
