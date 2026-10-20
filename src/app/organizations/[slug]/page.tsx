import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import { FaBuilding } from 'react-icons/fa6';

import {
  OrganizationDetails,
  OrganizationOverview,
  OrgQuickActions,
} from '@/features/organizations';
import {
  OrgContextProvider,
  ToggleOrgStatus,
} from '@/features/organizations/client';
import { getUsersInfiniteQueryOptions } from '@/features/user';
import {
  getOrgService,
  getUserService,
} from '@/infrastructure/composition/factory';
import { getQueryClient } from '@/lib/tanstack-query';
import { SectionHeader, SkeletonCard } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { RouteContextProvider } from '@/shared/context';
import { PAGINATION_DEFAULTS } from '@/shared/pagination';

type PageParams = { params: Promise<{ slug: string }> };

const getOrgDetails = cache(async (slug: string) => {
  const service = await getOrgService(`${ROUTES.organizations.href}/${slug}`);

  const result = await service.getOrgDetails({
    slug,
    memberQuery: {
      page: PAGINATION_DEFAULTS.page,
      limit: PAGINATION_DEFAULTS.limit,
    },
    invitationQuery: { page: 1, limit: 100 },
  });

  if (result.type === 'error') throw new Error(result.payload.message);
  if (!result.payload) notFound();

  return {
    data: result.payload,
    isActive: service.getActiveOrgId() === result.payload.org.id,
  };
});

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const {
    data: { org },
  } = await getOrgDetails(slug);

  return {
    ...ROUTES.organizations.nested.slug.metadata,
    title: `${org.name} Organization`,
    description: `Details and settings of ${org.name} organization.`,
  };
}

export default function OrgDetailsPage({ params }: PageParams) {
  return (
    <section className='space-y-6'>
      <SectionHeader
        icon={FaBuilding}
        title='Organization'
        description='Details of the organization you are currently working in.'
      />

      <Suspense fallback={<SkeletonCard />}>
        <MainContent params={params} />
      </Suspense>
    </section>
  );
}

async function MainContent({ params }: PageParams) {
  const { slug } = await params;
  const { data, isActive } = await getOrgDetails(slug);
  const { org, invitation, member } = data;

  const callbackUrl = `${ROUTES.organizations.href}/${org.slug}`;

  const queryClient = getQueryClient();
  const userService = await getUserService(callbackUrl);
  const { page, limit } = PAGINATION_DEFAULTS;

  queryClient.infiniteQuery({
    ...getUsersInfiniteQueryOptions({ limit }),
    queryFn: async () => {
      const result = await userService.listUsers({
        page,
        limit,
        orderBy: [{ email: 'asc' }],
      });
      if (result.type === 'error') throw new Error(result.payload.message);
      return result.payload;
    },
  });

  return (
    <OrgContextProvider value={{ ...org, isActive }}>
      <RouteContextProvider value={{ callbackUrl }}>
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
                  nativeButton
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
            <HydrationBoundary state={dehydrate(queryClient)}>
              <OrganizationDetails
                org={org}
                invitations={invitation.data}
                members={member.data}
                callbackUrl={callbackUrl}
              />
            </HydrationBoundary>
          </div>
        </div>
      </RouteContextProvider>
    </OrgContextProvider>
  );
}
