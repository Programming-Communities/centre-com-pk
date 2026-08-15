// types/wordpress/user.types.ts
// User related types for WordPress

export interface WordPressAuthResponse {
  login?: {
    authToken: string;
    refreshToken: string;
    user: WordPressUser;
  };
  registerUser?: {
    user: WordPressUser;
  };
}

export interface WordPressUser {
  id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
  };
  roles?: {
    nodes: Array<{
      name: string;
    }>;
  };
}

export interface AuthTokens {
  authToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserSession {
  user: WordPressUser;
  tokens: AuthTokens;
  expiresAt: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
export interface UserType {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  role?: string;
}