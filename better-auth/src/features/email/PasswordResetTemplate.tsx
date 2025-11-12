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

interface PasswordResetTemplateProps {
  userName?: string;
  resetUrl: string;
}

export function PasswordResetTemplate({
  userName,
  resetUrl,
}: PasswordResetTemplateProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className='bg-white font-sans'>
          <Container className='mx-auto my-12 w-full max-w-2xl rounded-lg border border-solid border-gray-200 shadow-xl'>
            <Section className='p-8 pb-8 text-center'>
              <div style={{ height: '16px' }} />
              <Heading className='text-3xl font-bold'>
                Reset Your Password
              </Heading>
              <div style={{ height: '16px' }} />
              <Text className='text-base text-gray-600'>
                {userName ? `Hi ${userName}, ` : ''}
                We received a request to reset the password for your account.
              </Text>
            </Section>

            <Section className='px-6 pb-6'>
              <div className='rounded-lg border border-solid border-red-200 bg-red-50 p-6'>
                <div>
                  <Text className='m-0 font-semibold text-red-700'>
                    Security Notice
                  </Text>
                  <Text className='m-0 text-red-900'>
                    If you didn&apos;t request a password reset, please ignore
                    this email or contact support if you have concerns about
                    your account security.
                  </Text>
                </div>

                <div style={{ height: '16px' }} />

                <div>
                  <Text className='m-0 font-semibold text-red-700'>
                    Time Sensitive
                  </Text>
                  <Text className='m-0 text-red-900'>
                    This password reset link will expire soon. You&apos;ll need
                    to request a new one after that.
                  </Text>
                </div>
              </div>

              <div style={{ height: '24px' }} />

              <Section className='text-center'>
                <Button
                  href={resetUrl}
                  className='rounded-md bg-red-600 px-8 py-3 text-lg font-semibold text-white'
                >
                  Reset Password
                </Button>
              </Section>

              <div style={{ height: '24px' }} />
              <Hr className='border-t border-gray-200' />
              <div style={{ height: '24px' }} />

              <Section className='text-center text-sm text-gray-500'>
                <Text>Or copy and paste this link into your browser:</Text>
                <Text className='mt-2 rounded bg-gray-100 p-3 font-mono text-xs break-all'>
                  {resetUrl}
                </Text>
              </Section>
            </Section>

            <Section className='border-t border-gray-200 p-6 text-center text-sm text-gray-500'>
              <Text className='mb-2'>
                If you didn&apos;t request a password reset, no changes have
                been made to your account.
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

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
//   Item,
//   ItemContent,
//   ItemDescription,
//   ItemMedia,
//   ItemTitle,
// } from '@/features/shared/components/ui';

// import { Clock, Lock, Shield } from 'lucide-react';

// interface PasswordResetTemplateProps {
//   userName?: string;
//   resetUrl: string;
//   expiresIn?: string;
// }

// export function PasswordResetTemplate({
//   userName,
//   resetUrl,
//   expiresIn,
// }: PasswordResetTemplateProps) {
//   return (
//     <Card className='w-full max-w-2xl shadow-xl'>
//       <CardHeader className='space-y-4 pb-8 text-center'>
//         <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-red-600'>
//           <Lock className='h-8 w-8 text-white' />
//         </div>

//         <CardTitle className='text-3xl font-bold'>
//           Reset Your Password
//         </CardTitle>

//         <CardDescription className='text-base'>
//           {userName ? `Hi ${userName}, ` : ''}
//           We received a request to reset the password for your account.
//         </CardDescription>
//       </CardHeader>

//       <CardContent className='space-y-6'>
//         <div className='bg-destructive/10 border-destructive/20 space-y-4 rounded-lg border p-6'>
//           <Item size={'sm'}>
//             <ItemMedia>
//               <Shield className='text-destructive mt-0.5 h-5 w-5' />
//             </ItemMedia>

//             <ItemContent>
//               <ItemTitle>Security Notice</ItemTitle>

//               <ItemDescription className='line-clamp-none text-pretty'>
//                 If you didn&apos;t request a password reset, please ignore this
//                 email or contact support if you have concerns about your account
//                 security.
//               </ItemDescription>
//             </ItemContent>
//           </Item>

//           <Item size={'sm'}>
//             <ItemMedia>
//               <Clock className='text-destructive mt-0.5 h-5 w-5' />
//             </ItemMedia>

//             <ItemContent>
//               <ItemTitle>Time Sensitive</ItemTitle>

//               <ItemDescription className='line-clamp-none text-pretty'>
//                 This password reset link will expire in {expiresIn}. You&apos;ll
//                 need to request a new one after that.
//               </ItemDescription>
//             </ItemContent>
//           </Item>
//         </div>

//         <div className='text-center'>
//           <Button
//             asChild
//             size='lg'
//             className='w-full bg-linear-to-r from-orange-500 to-red-600 px-8 hover:from-orange-600 hover:to-red-700 sm:w-auto'
//           >
//             <a href={resetUrl}>Reset Password</a>
//           </Button>
//         </div>

//         <hr />

//         <div className='text-muted-foreground text-center text-sm'>
//           <p>Or copy and paste this link into your browser:</p>

//           <p className='bg-muted mt-2 rounded p-3 font-mono text-xs break-all'>
//             {resetUrl}
//           </p>
//         </div>
//       </CardContent>

//       <CardFooter className='text-muted-foreground flex-col gap-2 border-t pt-6 text-center text-sm'>
//         <p>
//           If you didn&apos;t request a password reset, no changes have been made
//           to your account.
//         </p>

//         <p className='text-xs'>
//           This is an automated message, please do not reply.
//         </p>
//       </CardFooter>
//     </Card>
//   );
// }
