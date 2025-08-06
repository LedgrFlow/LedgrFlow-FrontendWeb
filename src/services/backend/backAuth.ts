import api, { setRefreshToken, setToken, getToken } from "@/config/axios";
import type {
  AuthResponse,
  CurrentUserResponse,
  LoginPayload,
  RegisterPayload,
  UpdateUserPayload,
} from "@/types/backend/auth-back.types";

/**
 * Registra un nuevo usuario con los datos proporcionados.
 */
async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("auth/register", payload);
  setToken(res.data.access_token);
  setRefreshToken(res.data.refresh_token);
  return res.data;
}

/**
 * Inicia sesión con las credenciales del usuario.
 */
async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("auth/login", payload);
  setToken(res.data.access_token);
  setRefreshToken(res.data.refresh_token);
  return res.data;
}

/**
 * Obtiene los datos del usuario autenticado actualmente.
 */
async function getCurrentUser(): Promise<CurrentUserResponse> {
  const res = await api.get<CurrentUserResponse>("users/me");
  return res.data;
}

/**
 * Actualiza los datos del usuario autenticado actualmente.
 * Nota: No necesita enviar ID, backend usa token para identificar.
 */
async function updateCurrentUser(
  payload: UpdateUserPayload
): Promise<CurrentUserResponse> {
  const res = await api.put<CurrentUserResponse>("users/me", payload);
  return res.data;
}

/**
 * Elimina al usuario autenticado actualmente.
 */
async function deleteCurrentUser(): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>("users/me");
  return res.data;
}

/**
 * Valida si el token actual es válido haciendo una petición al backend.
 * Si no hay token, retorna `false`.
 */
async function validateToken(): Promise<boolean> {
  const localToken = getToken();
  if (!localToken) return false;

  try {
    const res = await api.get("auth/validate-token");
    return res?.data?.valid ?? false;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

export const BackendAuth = {
  register,
  login,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  validateToken,
};
