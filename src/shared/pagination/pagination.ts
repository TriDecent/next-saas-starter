import z from 'zod';
import { PAGINATION_DEFAULTS } from './utils';

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
