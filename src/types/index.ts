export enum Role {
  USER = 'USER',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  POSTED = 'POSTED',
  FAILED = 'FAILED',
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: any;
}
