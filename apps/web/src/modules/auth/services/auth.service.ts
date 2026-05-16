import { environment } from '@bootstrap/environment';
import { ROLE_PERMISSIONS } from '@core/constants/permissions.constants';
import type { Role } from '@core/enums/roles.enum';
import type { AppUser } from '@core/types/auth.types';

const BASE = `${environment.apiBaseUrl}/v1/auth`;

interface LoginApiResponse {
  data: {
    token: string;
    user: { id: string; email: string; name: string; roles: string[]; tenantId: string };
  };
}

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: AppUser }> {
    const res = await fetch(`${BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error ?? 'Credenciales incorrectas');
    }
    const data = (await res.json()) as LoginApiResponse;
    const { token, user } = data.data;
    const roles = user.roles as Role[];
    const permissions = roles.flatMap((r) => ROLE_PERMISSIONS[r] ?? []);
    const appUser: AppUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles,
      permissions,
      tenantId: user.tenantId,
    };
    return { token, user: appUser };
  },
};
