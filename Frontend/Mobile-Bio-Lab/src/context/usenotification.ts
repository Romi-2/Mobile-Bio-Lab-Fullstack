// usenotification.ts
import { useContext } from "react";
import NotificationContext from "./notificationContext";
export interface Notification {
  id: number;
  title: string;          // ✅ Add
  message: string;
  is_read: boolean;
  created_at: string;     // ✅ Add
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
