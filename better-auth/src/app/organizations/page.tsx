import { AccessControl } from '@/features/organizations/access-control';
import { MyOrganizations } from '@/features/organizations/my-organizations';
import { QuickActions } from '@/features/organizations/quick-actions';
import { SectionHeader } from '@/shared/components';
import { FaBuilding } from 'react-icons/fa';

export default async function OrganizationsPage() {
  return (
    <section className='space-y-6'>
      <SectionHeader
        icon={FaBuilding}
        title='Organizations'
        description='Manage your organizations, members, and access in one place.'
      />

      <div className='grid grid-cols-1 gap-6 md:grid-cols-[1.6fr_1fr]'>
        <MyOrganizations organizations={organizations} />

        <div className='space-y-6'>
          <QuickActions />
          <AccessControl />
        </div>
      </div>
    </section>
  );
}

// TODO: replace with real data fetch
const organizations: ({
  name: string;
  id: string;
  slug: string;
  logo: string | null;
  createdAt: Date;
  metadata: string | null;
} & {
  membersCount?: number;
  roleLabel?: string;
})[] = [
  {
    id: 'org_01J2Z7KQ3W9H8N1A2B3C4D5E6F',
    name: 'Better Auth Studio',
    slug: 'better-auth-studio',
    logo: null,
    createdAt: new Date('2025-10-12T09:15:00.000Z'),
    metadata: JSON.stringify({ plan: 'pro', region: 'ap-southeast-1' }),
    membersCount: 12,
    roleLabel: 'Owner',
  },
  {
    id: 'org_01J2Z7M1N2P3Q4R5S6T7U8V9W0',
    name: 'Acme Commerce',
    slug: 'acme-commerce',
    logo: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=128&h=128&fit=crop',
    createdAt: new Date('2025-08-03T14:30:00.000Z'),
    metadata: JSON.stringify({ plan: 'team' }),
    membersCount: 47,
    roleLabel: 'Admin',
  },
  {
    id: 'org_01J2Z7N9A8B7C6D5E4F3G2H1I0',
    name: 'VN Moderation Guild',
    slug: 'vn-moderation-guild',
    logo: null,
    createdAt: new Date('2025-11-01T08:00:00.000Z'),
    metadata: null,
    membersCount: 6,
    roleLabel: 'Moderator',
  },
  {
    id: 'org_01J2Z7P8Q7R6S5T4U3V2W1X0Y9',
    name: 'Personal Sandbox',
    slug: 'personal-sandbox',
    logo: null,
    createdAt: new Date('2026-01-05T16:20:00.000Z'),
    metadata: JSON.stringify({ plan: 'free' }),
    membersCount: 1,
    roleLabel: 'Member',
  },
];
