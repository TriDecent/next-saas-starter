import { ensureSession, hasPermission } from '@/lib';
import { Loading, SectionHeader } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

export const metadata: Metadata = ROUTES.admin.metadata;

export default async function AdminPage() {
  return (
    <section className='min-h-screen'>
      <SectionHeader icon={MdOutlineAdminPanelSettings} title={'Admin Panel'} />
      <Suspense fallback={<Loading />}>
        <AdminWrapper />
      </Suspense>
    </section>
  );
}

async function AdminWrapper() {
  const session = await ensureSession(await headers(), ROUTES.admin.href);
  const canAccessAdmin = await hasPermission(session.user.id, {
    admin: ['access'],
  });

  if (!canAccessAdmin) notFound();

  return <div>Admin here</div>;
}
