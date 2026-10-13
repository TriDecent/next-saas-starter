import type { User } from '@/generated/prisma/client';
import { getUserService } from '@/infrastructure/composition/factory';
import { ajRestrictiveAuthenticated, respondToDenial } from '@/lib/arcjet';
import { ROUTES } from '@/shared/constants';
import { ZipArchive } from 'archiver';
import { NextResponse, type NextRequest } from 'next/server';
import { Readable } from 'node:stream';
import z from 'zod';

export async function GET(request: NextRequest) {
  const service = await getUserService(ROUTES.home.href);

  const decision = await ajRestrictiveAuthenticated.protect(request, {
    action: 'download-users',
    userId: service.actor.id,
  });
  if (decision.isDenied()) return respondToDenial(decision);

  const parsedResult = QuerySchema.safeParse(
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

function createUsersExportStream({
  source,
  type,
}: {
  source: AsyncGenerator<User>;
  type: QueryType['type'];
}) {
  const controller = new AbortController(); // avoid losing the "this" context
  const { signal } = controller;

  async function* transformDataStream() {
    const transformFn =
      type === 'txt'
        ? convertObjectToJsonLines
        : type === 'csv'
          ? convertObjectToCsv
          : convertObjectToJsonArray;

    for await (const chunk of transformFn(source)) {
      signal.throwIfAborted();
      yield chunk;
    }
  }

  const zip = new ZipArchive({ zlib: { level: 9 } });
  const userStream = Readable.from(transformDataStream());

  zip.on('error', () => controller.abort());
  zip.on('close', () => controller.abort());

  userStream.on('error', error => zip.destroy(error));

  zip.append(userStream, { name: `users-export.${type}` });

  zip.finalize().catch(error => {
    zip.destroy(error);
    controller.abort();
  });

  return { readable: Readable.toWeb(zip) };
}

const NEW_LINE = '\n';

async function* convertObjectToJsonLines(
  source: AsyncIterable<unknown>
): AsyncGenerator<string> {
  for await (const obj of source) {
    yield JSON.stringify(obj) + NEW_LINE;
  }
}

async function* convertObjectToCsv<T extends object>(
  source: AsyncIterable<T>
): AsyncGenerator<string> {
  let isFirstRow = true;

  for await (const obj of source) {
    if (isFirstRow) {
      const headers = Object.keys(obj);
      yield headers.join(',') + NEW_LINE;
      isFirstRow = false;
    }

    const values = Object.values(obj).map(val => {
      if (val === null || val === undefined) return '';
      const strVal = String(val);
      if (
        strVal.includes(',') ||
        strVal.includes('"') ||
        strVal.includes(NEW_LINE)
      )
        return `"${strVal.replace(/"/g, '""')}"`;

      return strVal;
    });

    yield values.join(',') + NEW_LINE;
  }
}

async function* convertObjectToJsonArray<T>(
  source: AsyncIterable<T>
): AsyncGenerator<string, void, unknown> {
  yield '[' + NEW_LINE;

  let isFirst = true;
  for await (const obj of source) {
    const prefix = isFirst ? '  ' : '  ,';

    yield prefix + JSON.stringify(obj) + NEW_LINE;
    isFirst = false;
  }

  yield ']';
}

const QuerySchema = z.object({
  type: z.literal(['json', 'txt', 'csv']),
});
export type QueryType = z.infer<typeof QuerySchema>;
