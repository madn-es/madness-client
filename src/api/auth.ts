const BASE_URL = 'https://api.madn.es';

export interface LoginResult {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).message ?? `로그인 실패 (${res.status})`);
  }

  return res.json() as Promise<LoginResult>;
}

export async function signup(
  email: string,
  username: string,
  password: string,
): Promise<LoginResult> {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).message ?? `회원가입 실패 (${res.status})`);
  }

  return res.json() as Promise<LoginResult>;
}
