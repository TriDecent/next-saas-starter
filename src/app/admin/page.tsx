import { UsersTable } from '@/features/admin/client';
import { ExportUsersButton } from '@/features/user/export';
import { getUserService } from '@/infrastructure/composition/factory';
import { Loading, SectionHeader } from '@/shared/components';
import {
  createSortingState,
  tableSearchParamsSchema,
} from '@/shared/components/DataTable';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
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

      <div className='ml-auto w-fit'>
        <ExportUsersButton />
      </div>

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
  const unknownQueries = await searchParams;

  const { tablePageIndex, tablePageSize, tableSort, tableSearch } =
    tableSearchParamsSchema.parse(unknownQueries);

  const userService = await getUserService(ROUTES.admin.href);
  const { type, payload } = await userService.getUsers({
    page: tablePageIndex + 1,
    limit: tablePageSize,
    orderBy: tableSort,
    keyword: tableSearch,
  });
  if (type === 'error') notFound();

  return (
    <UsersTable
      users={payload.users}
      total={payload.pagination.totalItems}
      paginationState={{ pageIndex: tablePageIndex, pageSize: tablePageSize }}
      sortingState={tableSort ? createSortingState(tableSort) : []}
      globalFilter={tableSearch ?? ''}
    />
  );
}
