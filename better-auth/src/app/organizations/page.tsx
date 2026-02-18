import { AccessControl } from '@/features/organizations/access-control';
import { MyOrganizations } from '@/features/organizations/my-organizations';
import { QuickActions } from '@/features/organizations/quick-actions';
import { getOrgService } from '@/infrastructure/service';
import { SectionHeader, SkeletonCard } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FaBuilding } from 'react-icons/fa';

export const metadata: Metadata = ROUTES.organization.metadata;

export default function OrganizationsPage() {
  return (
    <section className='space-y-6'>
      <SectionHeader
        icon={FaBuilding}
        title='Organizations'
        description='Manage your organizations, members, and access in one place.'
      />

      <div className='grid grid-cols-1 gap-6 md:grid-cols-[1.6fr_1fr]'>
        <div className='h-fit'>
          <Suspense fallback={<SkeletonCard />}>
            <MyOrgsWrapper />
          </Suspense>
        </div>

        <div className='sticky top-32 h-fit space-y-6'>
          <QuickActions />
          <AccessControl />
        </div>
      </div>
    </section>
  );
}

async function MyOrgsWrapper() {
  const service = await getOrgService(ROUTES.organization.href);
  const response = await service.listMyOrgs();

  if (response.type === 'error') throw new Error(response.payload.message);

  return <MyOrganizations organizations={response.payload} />;
}
