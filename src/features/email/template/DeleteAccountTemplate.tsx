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

interface DeleteAccountTemplateProps {
  userName?: string;
  verificationUrl: string;
}

export function DeleteAccountTemplate({
  userName,
  verificationUrl,
}: DeleteAccountTemplateProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className='bg-white font-sans'>
          <Container className='mx-auto my-12 w-full max-w-2xl rounded-lg border border-solid border-gray-200 shadow-xl'>
            <Section className='p-8 pb-8 text-center'>
              <div style={{ height: '16px' }} />
              <Heading className='text-3xl font-bold text-red-600'>
                Confirm Account Deletion
              </Heading>
              <div style={{ height: '16px' }} />
              <Text className='text-base text-gray-600'>
                {userName ? `Hi ${userName},` : 'Hello,'} <br />
                You have requested to permanently delete your account. This
                action is <b>irreversible</b> and will remove all your data from
                our system.
              </Text>
            </Section>
            <Section className='px-6 pb-6'>
              <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
                <Text className='m-0 font-semibold text-red-700'>Warning</Text>
                <Text className='m-0 text-red-900'>
                  Once you confirm, your account and all associated data will be
                  permanently deleted. This cannot be undone.
                </Text>
              </div>
              <div style={{ height: '24px' }} />
              <Section className='text-center'>
                <Button
                  href={verificationUrl}
                  className='rounded-md bg-red-600 px-8 py-3 text-lg font-semibold text-white'
                >
                  Confirm Account Deletion
                </Button>
              </Section>
              <div style={{ height: '24px' }} />
              <Hr className='border-t border-gray-200' />
              <div style={{ height: '24px' }} />
              <Section className='text-center text-sm text-gray-500'>
                <Text>
                  If the button above does not work, copy and paste this link
                  into your browser:
                </Text>
                <Text className='mt-2 rounded bg-gray-100 p-3 font-mono text-xs break-all'>
                  {verificationUrl}
                </Text>
              </Section>
            </Section>
            <Section className='border-t border-gray-200 p-6 text-center text-sm text-gray-500'>
              <Text className='mb-2'>
                If you did not request this, you can safely ignore this email
                and your account will not be deleted.
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
