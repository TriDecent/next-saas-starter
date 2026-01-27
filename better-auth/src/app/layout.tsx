import { ImpersonationStatus } from '@/features/admin/impersonation';
import {
  NavTrail,
  PageLayout,
  ThemeProvider,
  ThemeToggle,
} from '@/shared/components';
import { Toaster } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { StoreProvider } from '@/shared/provider';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import { Suspense } from 'react';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = ROUTES.root.metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <StoreProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <PageLayout>
              <Suspense>
                <ImpersonationStatus />
              </Suspense>
              <PageLayout.Header>
                <h1 className='text-2xl font-medium tracking-wider'>
                  <Link href='/'>Auth Demo</Link>
                </h1>
                <Suspense>
                  <ThemeToggle />
                </Suspense>
              </PageLayout.Header>
              <PageLayout.Main>
                <div className='mb-6'>
                  <Suspense>
                    <NavTrail />
                  </Suspense>
                </div>
                {children}
              </PageLayout.Main>
              <Suspense>
                <PageLayout.Footer />
              </Suspense>
            </PageLayout>
            <Toaster position='top-right' richColors />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
