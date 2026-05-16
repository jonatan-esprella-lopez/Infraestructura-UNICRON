import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer, apiPost, apiGet, type TestServer } from './helpers/test-server.js';

const DEMO_USERS = [
  { email: 'admin@intersim.bo',       password: 'admin123',   role: 'admin',  name: 'Carlos Mendoza' },
  { email: 'agente@intersim.bo',      password: 'agente123',  role: 'agent',  name: 'María García'   },
  { email: 'propietario@intersim.bo', password: 'prop123',    role: 'owner',  name: 'Roberto Vargas' },
  { email: 'cliente@intersim.bo',     password: 'cliente123', role: 'client', name: 'Ana López'      },
];

describe('Auth Module', () => {
  let server: TestServer;
  let BASE: string;

  before(async () => {
    server = await startTestServer(4091);
    BASE = server.baseUrl;
    console.log(`\n  Test server running at ${BASE}\n`);
  });

  after(async () => {
    await server.close();
  });

  // ─── Health ─────────────────────────────────────────────────────────────────

  it('GET /live → 200', async () => {
    const res = await fetch(`http://127.0.0.1:4091/live`);
    assert.equal(res.status, 200);
  });

  it('GET /health → 200 con estado de servicios', async () => {
    const res = await fetch(`http://127.0.0.1:4091/health`);
    assert.equal(res.status, 200);
    const body = await res.json() as Record<string, unknown>;
    assert.ok(body['data'] !== undefined || body['status'] !== undefined, 'Debe incluir estado de servicios');
  });

  // ─── Login ───────────────────────────────────────────────────────────────────

  for (const user of DEMO_USERS) {
    it(`POST /auth/login → ${user.role} (${user.email}) devuelve token válido`, async () => {
      const { status, body } = await apiPost(BASE, '/auth/login', {
        email: user.email,
        password: user.password,
      });

      assert.equal(status, 200, `Login fallido para ${user.email}: ${JSON.stringify(body)}`);

      const data = (body['data'] as Record<string, unknown>);
      assert.ok(data['token'], 'Debe incluir token');
      assert.ok(data['user'],  'Debe incluir datos de usuario');

      const apiUser = data['user'] as Record<string, unknown>;
      assert.equal(apiUser['email'], user.email);
      assert.deepEqual(apiUser['roles'], [user.role]);
      assert.equal(apiUser['tenantId'], 'tenant_intersim');

      // Decodificar token y verificar payload
      const token = data['token'] as string;
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8')) as Record<string, unknown>;
      assert.equal(decoded['email'], user.email);
      assert.ok((decoded['roles'] as string[]).includes(user.role));

      console.log(`    ✓  ${user.name} (${user.role}) → token OK`);
    });
  }

  it('POST /auth/login → credenciales incorrectas devuelve 400', async () => {
    const { status, body } = await apiPost(BASE, '/auth/login', {
      email: 'noexiste@intersim.bo',
      password: 'wrongpass',
    });
    assert.equal(status, 400);
    assert.ok((body['error'] as string).length > 0);
  });

  it('POST /auth/login → password vacío devuelve 400', async () => {
    const { status } = await apiPost(BASE, '/auth/login', {
      email: 'admin@intersim.bo',
      password: '',
    });
    assert.equal(status, 400);
  });

  // ─── /me ─────────────────────────────────────────────────────────────────────

  it('GET /auth/me → con token válido devuelve usuario', async () => {
    // Obtener token de admin
    const { body: loginBody } = await apiPost(BASE, '/auth/login', {
      email: 'admin@intersim.bo',
      password: 'admin123',
    });
    const token = (loginBody['data'] as Record<string, unknown>)['token'] as string;

    const { status, body } = await apiGet(BASE, '/auth/me', token);
    assert.equal(status, 200);
    const me = (body['data'] as Record<string, unknown>);
    assert.equal(me['email'], 'admin@intersim.bo');
  });

  it('GET /auth/me → sin token devuelve 400', async () => {
    const { status } = await apiGet(BASE, '/auth/me');
    assert.equal(status, 400);
  });

  // ─── PropTech endpoint (smoke) ────────────────────────────────────────────────

  it('GET /proptech → devuelve capacidades del módulo', async () => {
    const { status, body } = await apiGet(BASE, '/proptech');
    assert.equal(status, 200);
    const data = body['data'] as Record<string, unknown>;
    assert.ok(Array.isArray(data['capabilities']), 'Debe incluir lista de capabilities');
  });
});
