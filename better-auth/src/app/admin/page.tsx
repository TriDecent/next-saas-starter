import { UsersTable } from '@/features/admin';
import type { Prisma } from '@/generated/prisma/client';
import { ensureSession, hasPermission, prisma } from '@/lib';
import { Loading, SectionHeader } from '@/shared/components';
import {
  createSortingState,
  tableSearchParamsSchema,
} from '@/shared/components/DataTable';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

export const metadata: Metadata = ROUTES.admin.metadata;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  return (
    <section className='min-h-screen space-y-8'>
      <SectionHeader
        icon={MdOutlineAdminPanelSettings}
        title={'Admin Panel'}
        description='Manage users and their preferences here'
      />
      <Suspense fallback={<Loading />}>
        <AdminWrapper searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function AdminWrapper({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  const [headersList, unknownQueries] = await Promise.all([
    headers(),
    searchParams,
  ]);

  const session = await ensureSession(headersList, ROUTES.admin.href);
  const canListUser = await hasPermission(session.user.id, { user: ['list'] });

  if (!canListUser) notFound();

  const { tablePageIndex, tablePageSize, tableSort, tableSearch } =
    tableSearchParamsSchema.parse(unknownQueries);

  const whereClause: Prisma.UserWhereInput = tableSearch
    ? {
        OR: [
          { id: tableSearch },
          { email: { mode: 'insensitive', contains: tableSearch } },
          { name: { mode: 'insensitive', contains: tableSearch } },
        ],
      }
    : {};
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip: tablePageIndex * tablePageSize,
      take: tablePageSize,
      where: whereClause,
      orderBy: tableSort ?? [],
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  return (
    <UsersTable
      users={users}
      total={total}
      paginationState={{ pageIndex: tablePageIndex, pageSize: tablePageSize }}
      sortingState={tableSort ? createSortingState(tableSort) : []}
      globalFilter={tableSearch ?? ''}
    />
  );
}
