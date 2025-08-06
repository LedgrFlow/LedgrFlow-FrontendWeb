import api from "@/config/axios";
import type {
  CreateActivityPayload,
  UpdateActivityPayload,
  UserActivity,
} from "@/types/backend/user-activity.types";

/**
 * Crear una nueva actividad para el usuario autenticado.
 */
async function createActivity(
  payload: CreateActivityPayload
): Promise<{ activity: UserActivity }> {
  const res = await api.post<{ activity: UserActivity }>("activity/", payload);
  return res.data;
}

/**
 * Obtener todas las actividades del usuario autenticado.
 */
async function getUserActivities(): Promise<{ activities: UserActivity[] }> {
  const res = await api.get<{ activities: UserActivity[] }>("activity/user");
  return res.data;
}

/**
 * Obtener actividades del usuario autenticado en un rango de fechas.
 * @param start Fecha inicio en formato ISO (ejemplo: "2025-08-01")
 * @param end Fecha fin en formato ISO (ejemplo: "2025-08-31")
 */
async function getUserActivitiesByDate(
  start: string,
  end: string
): Promise<{ activities: UserActivity[] }> {
  const res = await api.get<{ activities: UserActivity[] }>(
    "activity/user/range",
    {
      params: { start, end },
    }
  );
  return res.data;
}

/**
 * Actualizar una actividad por su ID (solo del mismo usuario).
 */
async function updateActivity(
  activityId: string,
  payload: UpdateActivityPayload
): Promise<{ message: string }> {
  const res = await api.patch<{ message: string }>(
    `activity/${activityId}`,
    payload
  );
  return res.data;
}

/**
 * Eliminar una actividad por su ID (solo del mismo usuario).
 */
async function deleteActivity(
  activityId: string
): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(`activity/${activityId}`);
  return res.data;
}

export const BackendActivity = {
  createActivity,
  getUserActivities,
  getUserActivitiesByDate,
  updateActivity,
  deleteActivity,
};
