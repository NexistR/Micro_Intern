import type { Request } from 'express';

export type SessionUser = {
  id: string;
};

export type AuthRequest = Omit<Request, 'cookies'> & {
  cookies?: Record<string, string | undefined>;
  user?: SessionUser;
};

export type AuthenticatedRequest = AuthRequest & {
  user: SessionUser;
};
