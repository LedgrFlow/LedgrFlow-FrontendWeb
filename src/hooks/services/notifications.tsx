// hooks/useNotificationManager.ts
import { useEffect, useState } from "react";
import { LedgerApi } from "@/services/backend/ledger";
import { FileStorage } from "@/utils/bd-local";
import { toast } from "react-toastify";
import { formatCurrency } from "@/utils/format";
import dayjs from "dayjs";

export interface unusualExpenses {
  id: string;
  account: string;
  month: string;
  amount: number;
  average: number;
  alert: string;
  createdAt: number;
}

interface NotificationType {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

const notificationUnusualExpenses = (items: unusualExpenses[]) => {
  items.forEach((item) => {
    toast.warn(
      `[${item.account?.replaceAll(":", " > ")}] ${
        item.alert
      } :: ${formatCurrency(item.amount)}`,
      {
        autoClose: 7000,
        toastId: item.id, // evita duplicados
        position: "bottom-right", // puedes ajustar esto
      }
    );
  });
};

export function useNotificationManager() {
  const [notifications, setNotifications] = useState({});
  const [notifficationsui, setNotificationsUI] = useState<NotificationType[]>();
  const [unusualExpenses, setUnusualExpenses] = useState();
  const [file, setFile] = useState<File | null>(null);

  function convertToNotificationArray(
    data: Record<string, any[]>
  ): NotificationType[] {
    let id = 1;
    const notifications: NotificationType[] = [];

    for (const [category, entries] of Object.entries(data)) {
      for (const entry of entries) {
        const notification: NotificationType = {
          id: id++,
          title: entry.alert || "Alerta",
          message: `Se detectó un gasto de ${formatCurrency(
            entry.amount
          )} en ${entry.account?.replaceAll(":", " > ")} durante ${
            entry.month
          }. El promedio usual es de ${formatCurrency(entry.average)}.`,
          time: dayjs().fromNow(),
          unread: true,
        };
        notifications.push(notification);
      }
    }

    return notifications;
  }

  useEffect(() => {
    FileStorage.getAllFiles()
      .then((loadedFile) => {
        if (loadedFile) {
          setFile(loadedFile[0]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!file) return;

    LedgerApi.unusualExpenses(file)
      .then((data) => {
        notificationUnusualExpenses(data);
        setUnusualExpenses(data);
        setNotifications({
          ...notifications,
          unusualExpenses: data,
        });
      })
      .catch(console.error);
  }, [file]);

  useEffect(() => {
    if (notifications) {
      const notificationsUI = convertToNotificationArray(notifications);
      setNotificationsUI(notificationsUI);
    }
  }, [notifications]);

  useEffect(() => {
    console.log("Notifications", notifications);
    console.log("Unusual Expenses", unusualExpenses);
  }, [unusualExpenses, notifications]);

  return {
    notifications,
    notifficationsui,
  };
}
