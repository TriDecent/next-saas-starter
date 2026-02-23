import { ajRestrictiveAuthenticated, respondToDenial } from '@/lib/arcjet';
import { getUserService } from '@/services';
import { ROUTES } from '@/shared/constants';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const service = await getUserService(ROUTES.home.href);

  const decision = await ajRestrictiveAuthenticated.protect(request, {
    action: 'get-users',
    userId: service.actor.id,
  });
  if (decision.isDenied()) return respondToDenial(decision);

  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword') ?? undefined;

  const result = await service.getUsers(
    0,
    20,
    [{ createdAt: 'desc' }],
    keyword
  );

  if (result.type === 'success') return NextResponse.json(result.payload);

  return NextResponse.json(result.payload, { status: 400 });
}
