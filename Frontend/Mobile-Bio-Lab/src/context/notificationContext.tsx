// frontend/src/context/notificationContext.tsx
import React, { createContext, useState, useEffect } from "react";
import { getNotifications } from "../services/notificationservice";

interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // ✅ Only one version of fetchNotifications
  const fetchNotifications = async () => {
    try {
      const user = localStorage.getItem("loggedInUser");
      if (!user) {
        console.warn("⚠️ No loggedInUser found in localStorage");
        return;
      }

      const parsed = JSON.parse(user);
      console.log("🔍 Fetching notifications for user ID:", parsed.id);

      const data = await getNotifications(parsed.id);
      console.log("✅ Fetched notifications from backend:", data);

      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
