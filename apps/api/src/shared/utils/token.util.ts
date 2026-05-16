import { createHmac } from 'node:crypto';

export function signDevelopmentToken(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}
