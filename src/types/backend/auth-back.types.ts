export interface RegisterPayload {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password?: string;
  login_type?: string;
  avatar_url?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    login_type: string;
    created_at: string;
  };
  access_token: string;
  refresh_token: string;
}

export interface CurrentUserResponse {
  user: AuthResponse["user"];
}

export type UpdateUserPayload = Partial<{
  username: string;
  first_name: string;
  last_name: string;
  privilege: "standard" | "admin" | "moderator";
  avatar_url: string | null;
  description: string | null;
}>;
