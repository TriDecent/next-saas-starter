import { ajRestrictiveAuthenticated, respondToDenial } from '@/lib/arcjet';
import { getUserService } from '@/services';
import { ROUTES } from '@/shared/constants';
import { NextResponse, type NextRequest } from 'next/server';
import z from 'zod';

const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const service = await getUserService(ROUTES.home.href);

  const decision = await ajRestrictiveAuthenticated.protect(request, {
    action: 'get-users',
    userId: service.actor.id,
  });
  if (decision.isDenied()) return respondToDenial(decision);

  const { keyword, pageIndex, pageSize } = querySchema.parse(
    Object.fromEntries(request.nextUrl.searchParams)
  );

  const result = await service.getUsers(
    pageIndex,
    Math.min(pageSize, MAX_PAGE_SIZE),
    [{ createdAt: 'desc' }],
    keyword
  );

  return result.type === 'success'
    ? NextResponse.json(result.payload)
    : NextResponse.json(result.payload, { status: 400 });
}

const querySchema = z.object({
  keyword: z.string().optional(),
  pageIndex: z.coerce.number().int().nonnegative().default(DEFAULT_PAGE_INDEX),
  pageSize: z.coerce.number().positive().default(DEFAULT_PAGE_SIZE),
});
