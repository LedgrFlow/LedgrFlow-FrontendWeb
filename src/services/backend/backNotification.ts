import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos
export type NotificationImportance = "low" | "medium" | "high";

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  importance: NotificationImportance;
  is_read: boolean;
  created_at: string;
}

export interface NotificationCreateData {
  title: string;
  message: string;
  importance?: NotificationImportance;
}

export interface NotificationUpdateData {
  title?: string;
  message?: string;
  importance?: NotificationImportance;
  is_read?: boolean;
}

export interface NotificationPaginationResponse {
  success: boolean;
  data: NotificationItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

export const NotificationService = {
  async getUserNotifications(
    is_read?: boolean,
    importance?: NotificationImportance,
    limit: number = 50,
    offset: number = 0
  ): Promise<NotificationPaginationResponse> {
    const res = await api.get("/notifications", {
      params: {
        is_read,
        importance,
        limit,
        offset,
      },
    });
    return res.data;
  },

  async getNotificationById(
    notificationId: string
  ): Promise<{ success: boolean; data: NotificationItem }> {
    const res = await api.get(`/notifications/${notificationId}`);
    return res.data;
  },

  async createNotification(
    data: NotificationCreateData
  ): Promise<{ success: boolean; data: NotificationItem }> {
    const res = await api.post("/notifications", data);
    return res.data;
  },

  async createSystemNotification(
    data: NotificationItem
  ): Promise<{ success: boolean; data: NotificationItem }> {
    const res = await api.post("/notifications/system", data);
    return res.data;
  },

  async updateNotification(
    notificationId: string,
    data: NotificationUpdateData
  ): Promise<{ success: boolean; data: NotificationItem }> {
    const res = await api.put(`/notifications/${notificationId}`, data);
    return res.data;
  },

  async deleteNotification(
    notificationId: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/notifications/${notificationId}`);
    return res.data;
  },

  async markAsRead(
    notificationId: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await api.post(`/notifications/${notificationId}/read`);
    return res.data;
  },

  async markAsUnread(
    notificationId: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await api.post(`/notifications/${notificationId}/unread`);
    return res.data;
  },

  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/notifications/read-all");
    return res.data;
  },

  async getUnreadCount(): Promise<{
    success: boolean;
    data: { unread_count: number };
  }> {
    const res = await api.get("/notifications/unread-count");
    return res.data;
  },
};
