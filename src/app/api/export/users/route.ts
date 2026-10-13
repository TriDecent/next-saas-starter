import { createUsersExportStream, ExportSchema } from '@/features/user/export';
import { getUserService } from '@/infrastructure/composition/factory';
import { ajRestrictiveAuthenticated, respondToDenial } from '@/lib/arcjet';
import { ROUTES } from '@/shared/constants';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const service = await getUserService(ROUTES.home.href);

  const decision = await ajRestrictiveAuthenticated.protect(request, {
    action: 'download-users',
    userId: service.actor.id,
  });
  if (decision.isDenied()) return respondToDenial(decision);

  const parsedResult = ExportSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams.entries())
  );
  if (!parsedResult.success)
    return NextResponse.json(
      {
        message: 'Invalid query parameters',
      },
      { status: 400 }
    );

  const { type } = parsedResult.data;

  const { readable } = createUsersExportStream({
    source: service.getUsersForDownloads(), // Call this method on `service` to preserve its `this` context; if passing it as a reference, bind it to `service`
    type,
  });

  return new NextResponse(
    readable as ReadableStream, // ? Ts still reports an error, even though this should be correct
    {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="users-export.zip"`,
      },
    }
  );
}
