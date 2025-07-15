export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'VIEWER';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}
