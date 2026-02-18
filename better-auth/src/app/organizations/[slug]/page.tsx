import { OrgContextProvider } from '@/features/organizations/[slug]/context';
import { OrganizationDetails } from '@/features/organizations/[slug]/details';
import { OrganizationOverview } from '@/features/organizations/[slug]/overview';
import { getOrgRepo } from '@/infrastructure/repositories';
import { getOrgService } from '@/infrastructure/service';
import { SectionHeader, SkeletonCard } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import { FaBuilding } from 'react-icons/fa6';

export async function generateMetadata({
  params,
}: SlugParams): Promise<Metadata> {
  const slug = (await params).slug;
  const org = await getFullOrg(slug);

  return {
    ...ROUTES.organization.nested.slug.metadata,
    title: `${org.name} Organization`,
    description: `Details and settings of ${org.name} organization.`,
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getOrgRepo().model.findMany({ select: { slug: true } });

  return slugs.length > 1 ? slugs : [{ slug: 'does-not-exist' }];
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
  const org = await getFullOrg(slug);

  return (
    <OrgContextProvider value={{ slug }}>
      <OrganizationOverview org={org} />
      <OrganizationDetails org={org} />
    </OrgContextProvider>
  );
}

const getFullOrg = cache(async (slug: string) => {
  const service = await getOrgService(`${ROUTES.organization.href}/${slug}`);

  const result = await service.getFullOrganization({
    organizationSlug: slug,
    membersLimit: 100,
  });
  if (result.type === 'error') throw new Error(result.payload.message);
  if (!result.payload) notFound();

  return result.payload;
});
