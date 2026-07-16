// ---------------------------------------------------------------------------
// SHARED API CLIENT
// Thin HTTP wrapper that every service module uses. Right now it just adds a
// mock delay; when Django is live, set BASE_URL and every service call
// automatically goes through this with auth headers and error handling.
// ---------------------------------------------------------------------------

const BASE_URL = ''; // Set to your Django REST API base when ready

const MOCK_LATENCY = 400;

// ----- Token storage (swap for SecureStore / AsyncStorage later) -----------
let _token: string | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
}

export function getAuthToken(): string | null {
  return _token;
}

// ----- Mock delay helper ---------------------------------------------------
export function delay<T>(value: T, ms = MOCK_LATENCY): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// ----- HTTP primitives (unused while mocking, ready for the swap) ----------
function headers(): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (_token) h['Authorization'] = `Bearer ${_token}`;
  return h;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'GET', headers: headers() });
  return handleResponse<T>(res);
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

export async function patch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

export async function del(path: string): Promise<void> {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: headers() });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body}`);
  }
}
