import { ajRestrictiveAuthenticated, respondToDenial } from '@/lib/arcjet';
import { getUserService, type GetUsersResponse } from '@/services';
import { ROUTES } from '@/shared/constants';
import { PAGINATION_DEFAULTS } from '@/shared/utils';
import { NextResponse, type NextRequest } from 'next/server';
import z from 'zod';

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetUsersResponse> | NextResponse> {
  const service = await getUserService(ROUTES.home.href);

  const decision = await ajRestrictiveAuthenticated.protect(request, {
    action: 'get-users',
    userId: service.actor.id,
  });
  if (decision.isDenied()) return respondToDenial(decision);

  const parsedResult = QuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );
  if (!parsedResult.success)
    return NextResponse.json(
      {
        message: 'Invalid query parameters',
      },
      { status: 400 }
    );

  const { keyword, page, limit } = parsedResult.data;

  const result = await service.getUsers({
    page,
    limit,
    orderBy: [{ email: 'asc' }],
    keyword,
  });

  return result.type === 'success'
    ? NextResponse.json(result.payload)
    : NextResponse.json(result.payload, { status: 400 });
}

const QuerySchema = z.object({
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
