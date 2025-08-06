import axios from "axios";
import { API_CONFIG, AUTH_CONFIG } from "@/config/api";

// Create an Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
});

let isRefreshing = false; // Prevents multiple refresh requests simultaneously
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

/**
 * Processes the queue of failed requests during a token refresh.
 * If the refresh was successful, retries requests with the new token.
 * If not, rejects all queued promises.
 *
 * @param error - Error object from failed refresh (if any).
 * @param token - The newly refreshed access token, if available.
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Removes both access and refresh tokens from local storage.
 */
function logout() {
  localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
}

/**
 * Retrieves the current access token from local storage.
 * @returns The stored access token, or null if missing.
 */
function getToken(): string | null {
  return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
}

/**
 * Retrieves the current refresh token from local storage.
 * @returns The stored refresh token, or null if missing.
 */
function getRefreshToken(): string | null {
  return localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
}

/**
 * Stores a new access token in local storage.
 * @param token - The new access token to store.
 */
function setToken(token: string) {
  localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
}

/**
 * Stores a new refresh token in local storage.
 * @param token - The new refresh token to store.
 */
function setRefreshToken(token: string) {
  localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, token);
}

/**
 * Attempts to refresh the access token using the stored refresh token.
 * If the refresh fails, logs the user out.
 *
 * @returns A promise resolving to the new access token, or null if refresh failed.
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<{ access_token: string }>(
      `${API_CONFIG.BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          ...API_CONFIG.HEADERS,
        },
      }
    );

    const newAccessToken = response.data.access_token;
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    logout();
    return null;
  }
}

// [DEBUG] Count and log requests
let requestCount = 0; // Increment this to log requests
let endpointStats: Record<string, number> = {}; // Track request counts by endpoint

/**
 * Returns the current request count and endpoint stats.
 * @returns Object containing total request count and per-endpoint request counts.
 */
function getAxiosDebugStats() {
  return {
    totalRequests: requestCount,
    perEndpoint: { ...endpointStats },
  };
}

// Automatically attach access token to every outgoing request
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // [DEBUG] Count and log requests
  requestCount++;
  const endpoint = config.url || "unknown";
  endpointStats[endpoint] = (endpointStats[endpoint] || 0) + 1;

  if (import.meta.env.MODE === "development") {
    console.debug(`[Axios][Request #${requestCount}]`, {
      method: config.method,
      url: config.url,
      total: requestCount,
      stats: endpointStats,
    });
  }

  return config;
});

/**
 * Axios response interceptor to handle 401 Unauthorized errors.
 * If the token is expired, attempts to refresh it and retry the original request.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          return Promise.reject(new Error("Unable to refresh token"));
        }

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export {
  logout,
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  getAxiosDebugStats,
};
export default axiosInstance;
