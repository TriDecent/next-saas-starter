import z from 'zod';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from './constants';
import { createOrderByObjectArray } from './utils';

export const tableSearchParamsSchema = z.object({
  tablePageIndex: z.coerce
    .number()
    .int()
    .nonnegative()
    .catch(DEFAULT_PAGE_INDEX),
  tablePageSize: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .catch(DEFAULT_PAGE_SIZE),
  tableSort: z
    .string()
    .optional()
    .transform(val => (val ? createOrderByObjectArray(val) : undefined)),
  tableSearch: z.string().optional(),
});

export type TableSearchParams = z.infer<typeof tableSearchParamsSchema>;
