import { VerifyAuthenticator } from '@/features/auth/verify-2fa/authenticator';
import { VerifyBackupCodes } from '@/features/auth/verify-2fa/backup-codes';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { FiCodepen } from 'react-icons/fi';
import { SiGoogleauthenticator } from 'react-icons/si';

export const metadata: Metadata = ROUTES.auth.nested['verify-2fa'].metadata;

export default function Verify2FAPage() {
  return (
    <section className='min-h-screen'>
      <Tabs
        defaultValue={TWO_FACTORS_OPTIONS.at(0)?.factor}
        className='mx-auto max-w-xl'
      >
        <TabsList>
          {TWO_FACTORS_OPTIONS.map(option => (
            <TabsTrigger value={option.factor} key={option.factor}>
              {option.triggerUI}
            </TabsTrigger>
          ))}
        </TabsList>

        {TWO_FACTORS_OPTIONS.map(option => (
          <TabsContent value={option.factor} key={option.factor}>
            <Card className='max-w- mx-auto'>
              <CardHeader>
                <CardTitle>{option.cardTitle}</CardTitle>
                <CardDescription>{option.cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>{option.content}</CardContent>
              <CardFooter>{option.cardFooter}</CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

const TWO_FACTORS_OPTIONS = [
  {
    factor: 'authenticator',
    triggerUI: (
      <>
        <SiGoogleauthenticator /> Authenticator
      </>
    ),
    content: <VerifyAuthenticator />,
    cardTitle: 'Authenticator code',
    cardDescription:
      'Enter the 6-digit code from your authenticator app (Google Authenticator, Authy, etc.).',
    cardFooter: (
      <span className='text-muted-foreground text-xs'>
        Can&apos;t access your authenticator app? Try using one of your{' '}
        <strong>backup codes</strong>.
      </span>
    ),
  },
  {
    factor: 'backup-codes',
    triggerUI: (
      <>
        <FiCodepen />
        Backup Codes
      </>
    ),
    content: <VerifyBackupCodes />,
    cardTitle: 'Backup code',
    cardDescription:
      'Enter one of your one-time backup codes. Each code can be used once.',
    cardFooter: (
      <span className='text-muted-foreground text-xs'>
        Lost your backup codes? Regenerate them from your account security
        settings after signing in.
      </span>
    ),
  },
];
