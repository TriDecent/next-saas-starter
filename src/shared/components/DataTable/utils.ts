import type { SortingState } from '@tanstack/react-table';

export function createSortParam(sort: SortingState) {
  return sort
    .map(column => `${column.id}:${column.desc ? 'desc' : 'asc'}`)
    .join(',');
}

export function createOrderByObjectArray(sortParam: string) {
  return sortParam.split(',').map(part => {
    const [field, direction] = part.split(':');

    return { [field]: direction === 'desc' ? 'desc' : 'asc' } as const;
  });
}

export function createSortingState(
  input: string | Record<string, 'asc' | 'desc'>[]
): SortingState {
  if (typeof input === 'string') return createSortingStateFromSortParam(input);

  return createSortingStateFromOrderByObjectArray(input);
}

function createSortingStateFromSortParam(sortParam: string): SortingState {
  return sortParam.split(',').map(part => {
    const [field, direction] = part.split(':');

    return {
      id: field,
      desc: direction === 'desc',
    };
  });
}

function createSortingStateFromOrderByObjectArray(
  obj: Record<string, 'asc' | 'desc'>[]
): SortingState {
  return obj.map(item => {
    const [key, value] = Object.entries(item)[0]; // it should have only one key-value pair

    return {
      id: key,
      desc: value === 'desc',
    };
  });
}
