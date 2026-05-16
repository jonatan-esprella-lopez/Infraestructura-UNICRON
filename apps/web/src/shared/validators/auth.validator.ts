import { isEmail } from '@shared/utils/validation.utils';

export function validateLogin(payload: { email: string; password: string }) {
  return isEmail(payload.email) && payload.password.length >= 8;
}
