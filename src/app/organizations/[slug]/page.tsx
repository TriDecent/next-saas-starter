import {
  OrganizationDetails,
  OrganizationOverview,
  OrgQuickActions,
} from '@/features/organizations';
import {
  OrgContextProvider,
  ToggleActiveOrg,
} from '@/features/organizations/client';
import { getOrgService } from '@/services';
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
  const { organization } = await getFullOrg(slug);

  return {
    ...ROUTES.organizations.nested.slug.metadata,
    title: `${organization.name} Organization`,
    description: `Details and settings of ${organization.name} organization.`,
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
  const { organization, isActive } = await getFullOrg(slug);
  const callbackUrl = `${ROUTES.organizations.href}/${organization.slug}`;

  return (
    <OrgContextProvider value={{ ...organization, isActive }}>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <OrganizationOverview org={organization} isActive={isActive} />
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
                render={
                  <ToggleActiveOrg
                    orgId={!isActive ? organization.id : null}
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
            <OrganizationDetails org={organization} callbackUrl={callbackUrl} />
          </RouteContextProvider>
        </div>
      </div>
    </OrgContextProvider>
  );
}

const getFullOrg = cache(async (slug: string) => {
  const service = await getOrgService(`${ROUTES.organizations.href}/${slug}`);

  const result = await service.getFullOrganization({
    organizationSlug: slug,
    membersLimit: 100,
  });
  if (result.type === 'error') throw new Error(result.payload.message);
  if (!result.payload) notFound();

  return {
    organization: result.payload,
    isActive: service.getActiveOrgId() === result.payload.id,
  };
});
