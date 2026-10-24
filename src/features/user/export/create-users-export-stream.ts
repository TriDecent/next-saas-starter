import type { User } from '@/generated/prisma/client';
import { ZipArchive } from 'archiver';
import { Readable } from 'node:stream';
import { ReadableStream, TransformStream } from 'node:stream/web';
import type { ExportType } from './schema';

export function createUsersExportStream({
  source,
  type,
}: {
  source: AsyncGenerator<User>;
  type: ExportType['type'];
}) {
  async function* transformDataStream() {
    const transformFn =
      type === 'txt'
        ? convertObjectToJsonLines
        : type === 'csv'
          ? convertObjectToCsv
          : convertObjectToJsonArray;

    yield* transformFn(source);
  }

  const zip = new ZipArchive({ zlib: { level: 9 } });

  (async () => {
    const { readable, writable } = new TransformStream();

    zip.append(Readable.fromWeb(readable), { name: `users-export.${type}` });

    await ReadableStream.from(transformDataStream()).pipeTo(writable);

    await zip.finalize();
  })().catch(error => {
    zip.destroy(error);
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
