/**
 * General configuration for the API.
 * Defines the base URL, available authentication endpoints, and default headers.
 */
export const API_CONFIG = {
  /** Base URL for the API, can be overridden via environment variable */
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000",

  /** Default HTTP headers for JSON requests */
  HEADERS: {
    "Content-Type": "application/json",
  },
} as const;

/**
 * Configuration related to user authentication.
 * Defines keys for storing tokens in localStorage and the default token expiration.
 */
export const AUTH_CONFIG = {
  /** Key used to store the access token */
  TOKEN_KEY: "access_token",
  /** Key used to store the refresh token */
  REFRESH_TOKEN_KEY: "refresh_token",
} as const;
