import {
  OrganizationDetails,
  OrganizationOverview,
  OrgQuickActions,
} from '@/features/organizations';
import {
  OrgContextProvider,
  ToggleOrgStatus,
} from '@/features/organizations/client';
import { getOrgService } from '@/infrastructure/composition/factory';
import { SectionHeader, SkeletonCard } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { RouteContextProvider } from '@/shared/context';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import { FaBuilding } from 'react-icons/fa6';

export async function generateMetadata({
  params,
}: SlugParams): Promise<Metadata> {
  const slug = (await params).slug;
  const {
    data: { org },
  } = await getOrgDetails(slug);

  return {
    ...ROUTES.organizations.nested.slug.metadata,
    title: `${org.name} Organization`,
    description: `Details and settings of ${org.name} organization.`,
  };
}

type SlugParams = { params: Promise<{ slug: string }> };

export default function OrgDetailsPage({ params }: SlugParams) {
  return (
    <section className='space-y-6'>
      <SectionHeader
        icon={FaBuilding}
        title='Organization'
        description='Details of the organization you are currently working in.'
      />

      <div className='space-y-6'>
        <Suspense fallback={<SkeletonCard />}>
          <Wrapper params={params} />
        </Suspense>
      </div>
    </section>
  );
}

async function Wrapper({ params }: SlugParams) {
  const slug = (await params).slug;
  const { data, isActive } = await getOrgDetails(slug);
  const { org, invitation, member } = data;
  const callbackUrl = `${ROUTES.organizations.href}/${org.slug}`;

  return (
    <OrgContextProvider value={{ ...org, isActive }}>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <OrganizationOverview org={data} isActive={isActive} />
        </div>
        <div className='lg:sticky lg:top-32 lg:col-start-3'>
          <OrgQuickActions
            render={
              <Button
                className={`justify-start ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-300'
                    : ''
                }`}
                variant='outline'
                nativeButton={true}
                render={
                  <ToggleOrgStatus
                    orgId={!isActive ? org.id : null}
                    isActive={isActive}
                  />
                }
              />
            }
          />
        </div>
        <div className='lg:col-span-2'>
          <RouteContextProvider
            value={{
              callbackUrl,
            }}
          >
            <OrganizationDetails
              org={org}
              invitations={invitation.data}
              members={member.data}
              callbackUrl={callbackUrl}
            />
          </RouteContextProvider>
        </div>
      </div>
    </OrgContextProvider>
  );
}

const getOrgDetails = cache(async (slug: string) => {
  const service = await getOrgService(`${ROUTES.organizations.href}/${slug}`);

  const result = await service.getOrgDetails({
    slug,
    memberQuery: { page: 1, limit: 100 },
    invitationQuery: { page: 1, limit: 100 },
  });
  if (result.type === 'error') throw new Error(result.payload.message);
  if (!result.payload) notFound();

  return {
    data: result.payload,
    isActive: service.getActiveOrgId() === result.payload.org.id,
  };
});
