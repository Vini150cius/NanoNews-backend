export interface CreateUserDto {
  email: string;
  name: string;
  picture?: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture: string | null;
  createdAt: Date;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
