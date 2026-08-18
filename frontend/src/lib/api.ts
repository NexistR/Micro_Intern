export type AuthUser = {
  id: string;
  email: string;
  createdAt: string;
};

type AuthResponse = {
  success: true;
  message: string;
  user: AuthUser;
};

type ApiErrorPayload = {
  code?: string;
  message?: string | string[];
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export class ApiError extends Error {
  readonly code?: string;
  readonly status: number;

  constructor(status: number, payload: ApiErrorPayload) {
    const message = Array.isArray(payload.message)
      ? payload.message.join(' ')
      : payload.message ?? '请求失败，请稍后重试';
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = payload.code;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return typeof value === 'object' && value !== null;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(0, { message: '无法连接后端服务，请确认 API 已启动' });
  }

  const payload: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      isApiErrorPayload(payload) ? payload : {},
    );
  }

  return payload as T;
}

export function signUp(credentials: AuthCredentials) {
  return requestJson<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function login(credentials: AuthCredentials) {
  return requestJson<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser() {
  return requestJson<{ success: true; user: AuthUser }>('/auth/me');
}

export function logout() {
  return requestJson<{ success: true; message: string }>('/auth/logout', {
    method: 'POST',
  });
}
