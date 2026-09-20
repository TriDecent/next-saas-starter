import { ImpersonationStatus } from '@/features/admin';
import { RenderUserDropdownNav } from '@/features/home';
import {
  AvatarSkeleton,
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
  const mem = process.memoryUsage();
  console.log(
    `📊 RAM Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(`📊 RAM RSS: ${mem.rss / 1024 / 1024}`);

  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistSans.className} antialiased`}
      >
        <StoreProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <Toaster position='top-right' richColors />
            <div id='modal'></div>
            <PageLayout>
              <Suspense>
                <ImpersonationStatus />
              </Suspense>
              <PageLayout.Header className='z-30'>
                <h1 className='text-2xl font-medium tracking-wider'>
                  <Link href='/'>Identity Hub</Link>
                </h1>

                <div className='flex items-center gap-2'>
                  <ThemeToggle />

                  <Suspense fallback={<AvatarSkeleton />}>
                    <RenderUserDropdownNav />
                  </Suspense>
                </div>
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
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
