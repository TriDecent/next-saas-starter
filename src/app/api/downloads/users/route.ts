import { getUserService } from '@/infrastructure/composition/factory';
import { ROUTES } from '@/shared/constants';
import { NextResponse, type NextRequest } from 'next/server';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';
import z from 'zod';

export async function GET(request: NextRequest) {
  const service = await getUserService(ROUTES.home.href);

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

  const { readable, writable } = new TransformStream();
  const { signal, abort } = new AbortController();

  pipeline(
    service.getUsersForDownloads(), // Call this method on `service` to preserve its `this` context; if passing it as a reference, bind it to `service`
    type === 'txt'
      ? convertObjectToJsonLines
      : type === 'csv'
        ? convertObjectToCsv
        : convertObjectToJsonArray,
    createGzip(),
    writable,
    { signal }
  ).catch(error => {
    console.log('An error from download users pipeline', error);
    abort();
  });

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'application/gzip',
      'Content-Disposition': `attachment; filename="users.${type}.gz"`,
    },
  });
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
