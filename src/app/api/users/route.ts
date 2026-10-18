import type { ListUsersResult } from '@/features/user/server';
import { getUserService } from '@/infrastructure/composition/factory';
import { ajRestrictiveAuthenticated, respondToDenial } from '@/lib/arcjet';
import { ROUTES } from '@/shared/constants';
import { QuerySchema } from '@/shared/pagination';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ListUsersResult> | NextResponse> {
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

  const result = await service.listUsers({
    page,
    limit,
    orderBy: [{ email: 'asc' }],
    keyword,
  });

  return result.type === 'success'
    ? NextResponse.json(result.payload)
    : NextResponse.json(result.payload, { status: 400 });
}
