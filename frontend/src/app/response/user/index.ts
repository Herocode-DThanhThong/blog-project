export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterResponse {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  avatar: string;
}

export interface UserResponse {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  avatar?: string;
  role?: 'MANAGER' | 'USER' | 'ADMIN';
}

export interface GetNewAccessTokenResponse {
  access_token: string;
  refresh_token: string;
}
