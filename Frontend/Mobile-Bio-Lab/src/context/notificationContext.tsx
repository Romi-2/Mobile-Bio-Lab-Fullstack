// frontend/src/context/notificationContext.tsx
import React, { createContext, useState, useEffect} from "react";
import type{ ReactNode } from "react";
import { getNotifications, createNotification, markAsRead } from "../services/notificationservice";

// Notification interface
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Context type
export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  addNotification: (title: string, message: string) => Promise<void>;
  markNotificationAsRead: (id: number) => Promise<void>;
}

// Create context
const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

// NotificationProvider component
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchNotifications = async (): Promise<void> => {
    try {
      const user = localStorage.getItem("loggedInUser");
      if (!user) return;

      const parsed = JSON.parse(user);
      const data = await getNotifications(parsed.id);
      const typedData: Notification[] = Array.isArray(data) ? data : [];

      setNotifications(typedData);
      setUnreadCount(typedData.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const addNotification = async (title: string, message: string) => {
    try {
      const user = localStorage.getItem("loggedInUser");
      if (!user) return;

      const parsed = JSON.parse(user);

      await createNotification({
        user_id: parsed.id,
        title,
        message,
      });

      await fetchNotifications();
    } catch (err) {
      console.error("Error creating notification:", err);
    }
  };

  const markNotificationAsRead = async (id: number) => {
    try {
      await markAsRead(id);

      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    fetchNotifications,
    addNotification,
    markNotificationAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext; // Only component export in this file
