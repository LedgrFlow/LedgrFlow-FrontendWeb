import app from "@/config/axios";
import type {
  ResponseUserSettings,
  UserSettingsData,
} from "@/types/backend/settings-back.types";

export const BackendSettings = {
  /**
   * Obtiene las configuraciones del usuario autenticado
   */
  get: async (): Promise<ResponseUserSettings> => {
    const response = await app.get("users/settings");
    return response.data;
  },

  /**
   * Crea nuevas configuraciones para el usuario autenticado
   * Solo debe usarse si el usuario no tiene configuraciones previas
   */
  create: async (
    settings: Partial<ResponseUserSettings>
  ): Promise<UserSettingsData> => {
    const response = await app.post("users/settings", settings);
    return response.data;
  },

  /**
   * Actualiza las configuraciones existentes del usuario autenticado
   */
  update: async (
    updates: Partial<UserSettingsData>
  ): Promise<UserSettingsData> => {
    const response = await app.put("users/settings", updates);
    return response.data;
  },

  /**
   * Elimina completamente las configuraciones del usuario
   */
  remove: async (): Promise<ResponseUserSettings> => {
    const response = await app.delete("users/settings");
    return response.data;
  },

  /**
   * Resetea las configuraciones del usuario a los valores por defecto
   */
  reset: async (): Promise<ResponseUserSettings> => {
    const response = await app.post(`users/settings/reset`);
    return response.data;
  },
};
