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
import { format } from 'date-fns';

export type OrganizationInvitationTemplateProps = {
  organizationName: string;
  acceptUrl: string;

  inviterName: string;
  inviterEmail: string;

  recipientEmail: string;
  roleLabel: string;
  expiresAt: Date;
};

export function OrganizationInvitationTemplate({
  organizationName,
  acceptUrl,
  inviterName,
  inviterEmail,
  recipientEmail,
  roleLabel,
  expiresAt,
}: OrganizationInvitationTemplateProps) {
  const inviter = inviterName ?? inviterEmail ?? 'A team member';

  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className='bg-white font-sans'>
          <Container className='mx-auto my-12 w-full max-w-2xl rounded-lg border border-solid border-gray-200 shadow-xl'>
            <Section className='p-8 pb-6 text-center'>
              <Heading className='text-3xl font-bold'>
                You&apos;re invited to join {organizationName}
              </Heading>

              <div style={{ height: '14px' }} />

              <Text className='text-base text-gray-600'>
                {inviter} invited you to join{' '}
                <span className='font-semibold text-gray-900'>
                  {organizationName}
                </span>
                <>
                  {' '}
                  as{' '}
                  <span className='font-semibold text-gray-900'>
                    {roleLabel}
                  </span>
                </>
                .
              </Text>

              <Text className='m-0 text-sm text-gray-500'>
                Sent to{' '}
                <span className='font-medium text-gray-700'>
                  {recipientEmail}
                </span>
                .
              </Text>

              <Text className='m-0 text-sm text-gray-500'>
                Expires on{' '}
                <span className='font-medium text-gray-700'>
                  {format(expiresAt, 'MMM dd, yyyy')}
                </span>
                .
              </Text>
            </Section>

            <Section className='px-6 pb-6'>
              <div className='rounded-lg border border-solid border-blue-200 bg-blue-50 p-6'>
                <Text className='m-0 font-semibold text-blue-800'>
                  What happens next
                </Text>
                <Text className='m-0 mt-2 text-blue-950'>
                  Click the button below to accept the invitation and access the
                  organization workspace.
                </Text>
              </div>

              <div style={{ height: '22px' }} />

              <Section className='text-center'>
                <Button
                  href={acceptUrl}
                  className='rounded-md bg-indigo-600 px-8 py-3 text-lg font-semibold text-white'
                >
                  Accept invitation
                </Button>
              </Section>

              <div style={{ height: '20px' }} />
              <Hr className='border-t border-gray-200' />
              <div style={{ height: '20px' }} />

              <Section className='text-center text-sm text-gray-500'>
                <Text>If the button doesn&apos;t work, copy and paste:</Text>
                <Text className='mt-2 rounded bg-gray-100 p-3 font-mono text-xs break-all'>
                  {acceptUrl}
                </Text>
              </Section>

              <div style={{ height: '18px' }} />

              <div className='rounded-lg border border-solid border-amber-200 bg-amber-50 p-5'>
                <Text className='m-0 font-semibold text-amber-800'>
                  Security note
                </Text>
                <Text className='m-0 mt-2 text-amber-950'>
                  If you were not expecting this invitation, you can ignore this
                  email. Do not forward this message, as the link may grant
                  access to the organization.
                </Text>
              </div>
            </Section>

            <Section className='border-t border-gray-200 p-6 text-center text-sm text-gray-500'>
              <Text className='mb-2'>
                This is an automated message, please do not reply.
              </Text>
              <Text className='text-xs'>
                If you have questions, contact your organization administrator.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
