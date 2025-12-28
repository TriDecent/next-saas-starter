'use server';

import type { User } from 'better-auth';
import { importJWK, jwtVerify, SignJWT } from 'jose';

const BASE64_PRIVATE_KEY = process.env.SUDO_CLIENT_ACTION_PRIVATE_KEY!;
const BASE64_PUBLIC_KEY = process.env.SUDO_CLIENT_ACTION_PUBLIC_KEY!;
const ISSUER = process.env.ISSUER!;

const PRIVATE_KEY = await importJWK(
  JSON.parse(Buffer.from(BASE64_PRIVATE_KEY, 'base64').toString('utf-8')),
  'ES256'
);

const PUBLIC_KEY = await importJWK(
  JSON.parse(Buffer.from(BASE64_PUBLIC_KEY, 'base64').toString('utf-8')),
  'ES256'
);

export async function createSudoToken(userId: User['id']) {
  return await new SignJWT()
    .setProtectedHeader({
      alg: 'ES256',
    })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setSubject(userId)
    .setExpirationTime('1m')
    .sign(PRIVATE_KEY);
}

export async function verifySudoToken(
  token: string,
  expectedUserId: User['id']
) {
  try {
    const payload = await jwtVerify(token, PUBLIC_KEY, {
      issuer: ISSUER,
      subject: expectedUserId,
    });

    return payload;
  } catch {
    return null;
  }
}
