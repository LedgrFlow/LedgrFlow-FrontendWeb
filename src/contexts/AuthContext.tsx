import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { BackendAuth } from "../services/backend/backAuth";
import { getToken, logout as logoutAxios } from "@/config/axios";
import { BackendSettings } from "@/services/backend/backSettings";
import type { UserSettingsData } from "@/types/backend/settings-back.types";
import { BackendActivity } from "@/services/backend/backActivity";
import type { UserActivity } from "@/types/backend/user-activity.types";

interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  login_type: string;
  created_at: string;
  description?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  validateAuth: () => Promise<void>;
  getUserSettings: () => Promise<void>;
  settings: UserSettingsData | undefined;
  updateTemporalSettings: (updates: Partial<UserSettingsData>) => void;
  updateSettings: () => Promise<void>;
  isLoadingUploadSettings: boolean;
  temporalUser: User | null;
  updateTemporalUser: (updates: Partial<User>) => void;
  updateUser: () => void;
  deleteUser: () => void;
  isLoadingUploadUser: boolean;
  userActivities: UserActivity[];
  getUserActivity: () => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [temporalUser, setTemporalUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoagindUploadSettings, setIsLoagindUploadSettings] = useState(false);
  const [isLoadingUploadUser, setIsLoadingUploadUser] = useState(false);
  const [settings, setSettings] = useState<UserSettingsData | undefined>();
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [temporalSettings, setTemporalSettings] = useState<
    UserSettingsData | undefined
  >();

  const allowedFields: (keyof User)[] = [
    "username",
    "first_name",
    "last_name",
    "avatar_url",
    "description",
  ];

  const validateAuth = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setTemporalUser(null);
        return;
      }

      const isValid = await BackendAuth.validateToken();

      if (isValid) {
        const currentUser = await BackendAuth.getCurrentUser();
        setUser(currentUser.user);
        setTemporalUser(currentUser.user);
        setIsAuthenticated(true);
        BackendActivity.createActivity({
          event: "login",
        }).then((res) => {
          console.log(res);
        });
      } else {
        // Token inválido, limpiar localStorage
        logoutAxios();
        setUser(null);
        setTemporalUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error validating auth:", error);
      logoutAxios();
      setUser(null);
      setTemporalUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Elimina todas las claves que no estén en la lista de campos permitidos.
   *
   * @param {object} data - El objeto con los datos a limpiar.
   * @param {string[]} allowedFields - Lista de claves permitidas.
   * @returns {object} Un nuevo objeto solo con los campos válidos.
   */
  function cleanUserData<T extends object>(
    data: T,
    allowedFields: (keyof T)[]
  ): Partial<T> {
    const cleaned: Partial<T> = {};
    for (const key of allowedFields) {
      if (key in data) {
        cleaned[key] = data[key];
      }
    }
    return cleaned;
  }

  const getUserSettings = async () => {
    return BackendSettings.get().then((response) => {
      if (response) {
        setSettings(response.data);
        setTemporalSettings(response.data);
      }
    });
  };

  const deleteUser = async () => {
    return BackendAuth.deleteCurrentUser()
      .then((response) => {
        if (response) {
          setUser(null);
          setTemporalUser(null);
          setIsAuthenticated(false);
          logoutAxios();
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const updateSettings = async () => {
    if (!temporalSettings) return;

    setIsLoagindUploadSettings(true);
    BackendSettings.update(temporalSettings)
      .then(() => {
        BackendSettings.get().then((res) => {
          if (res) {
            getUserSettings();
            BackendActivity.createActivity({
              event: "settings_update",
            });
          }
        });
        setIsLoagindUploadSettings(false);
      })
      .catch((error) => {
        console.error("Error updating settings:", error);
        setIsLoagindUploadSettings(false);
      });
  };

  const updateUser = () => {
    if (!temporalUser) return;

    setIsLoadingUploadUser(true);

    const cleanedUser = cleanUserData(temporalUser, allowedFields);
    BackendAuth.updateCurrentUser(cleanedUser)
      .then(() => {
        BackendAuth.getCurrentUser().then((response) => {
          setUser(response.user);
          setTemporalUser(response.user);
          setIsLoadingUploadUser(false);
          BackendActivity.createActivity({
            event: "user_update",
          });
        });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setIsLoadingUploadUser(false);
      });
  };

  const getUserActivity = async () => {
    return BackendActivity.getUserActivities().then((res) => {
      setUserActivities(res.activities);
    });
  };

  const updateTemporalSettings = (updates: Partial<UserSettingsData>) => {
    if (temporalSettings) {
      setTemporalSettings({ ...temporalSettings, ...updates });
    }
  };

  const updateTemporalUser = (updates: Partial<User>) => {
    if (temporalUser) {
      setTemporalUser({ ...temporalUser, ...updates });
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string
  ): Promise<boolean> => {
    try {
      const response = await BackendAuth.register({
        email,
        password,
        username,
        first_name: firstName,
        last_name: lastName,
      });
      setUser(response.user);
      setTemporalUser(response.user);
      setIsAuthenticated(true);
      BackendActivity.createActivity({
        event: "register",
      }).then((res) => {
        console.log(res);
      });
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await BackendAuth.login({ email, password });
      setUser(response.user);
      setTemporalUser(response.user);
      setIsAuthenticated(true);
      BackendActivity.createActivity({
        event: "login",
      }).then((res) => {
        console.log(res);
      });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    logoutAxios();
    setUser(null);
    setTemporalUser(null);
    setIsAuthenticated(false);
    BackendActivity.createActivity({
      event: "logout",
    }).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      getUserSettings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    validateAuth();
  }, []);

  if (import.meta.env.MODE === "development") {
    useEffect(() => {
      console.groupCollapsed("📦 AuthContext");
      console.log("user:", user);
      console.log("isAuthenticated:", isAuthenticated);
      console.log("isLoading:", isLoading);
      console.log("settings:", settings);
      console.log("temporalSettings:", temporalSettings);
      console.log("currentSettingsUser:", temporalUser);
      console.log("userActivities:", userActivities);
      console.groupEnd();
    }, [
      user,
      isAuthenticated,
      isLoading,
      settings,
      temporalSettings,
      temporalUser,
    ]);
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    settings,
    login,
    logout,
    validateAuth,
    getUserSettings,
    updateTemporalSettings,
    updateTemporalUser,
    updateSettings,
    updateUser,
    deleteUser,
    isLoadingUploadUser,
    temporalUser,
    isLoadingUploadSettings: isLoagindUploadSettings,
    userActivities,
    getUserActivity,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
