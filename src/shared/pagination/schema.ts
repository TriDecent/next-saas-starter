import z from 'zod';
import { PAGINATION_DEFAULTS } from './utils';

export const PaginationSchema = z.object({
  totalPages: z.coerce.number(),
  currentPage: z.coerce.number(),
  hasPreviousPage: z.coerce.boolean(),
  hasNextPage: z.coerce.boolean(),
  limit: z.coerce.number(),
  totalItems: z.coerce.number(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const QuerySchema = z.object({
  keyword: z.string().optional(),
  page: z.coerce
    .number()
    .pipe(z.int().positive())
    .default(PAGINATION_DEFAULTS.page),
  limit: z.coerce
    .number()
    .pipe(z.int().positive())
    .pipe(
      z.transform(value =>
        value > PAGINATION_DEFAULTS.maxLimit
          ? PAGINATION_DEFAULTS.maxLimit
          : value
      )
    )
    .default(PAGINATION_DEFAULTS.limit),
});

export type Query = z.infer<typeof QuerySchema>;
