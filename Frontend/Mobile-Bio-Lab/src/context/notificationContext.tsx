// frontend/src/context/notificationContext.tsx
import React, { createContext, useState, useEffect } from "react";
import { getNotifications } from "../services/notificationservice";

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
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

  const fetchNotifications = async () => {
    try {
      const user = localStorage.getItem("loggedInUser");
      if (!user) return;
      const parsed = JSON.parse(user);
      const data = await getNotifications(parsed.id);
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
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

// ✅ Default export if you want to import context directly somewhere
export default NotificationContext;
