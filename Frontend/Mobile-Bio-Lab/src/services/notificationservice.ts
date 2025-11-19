// frontend/src/services/notificationservice.ts
import axios from "axios";
import type { Notification } from "../context/notificationContext";

const API_URL = "http://localhost:5000/api/notifications";

export interface CreateNotificationData {
  user_id: number;
  title: string;
  message: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export const getNotifications = async (userId: number): Promise<Notification[]> => {
  try {
    const res = await axios.get<Notification[]>(`${API_URL}/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    throw error;
  }
};

export const markAsRead = async (notificationId: number): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${notificationId}/read`);
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    throw error;
  }
};

export const createNotification = async (data: CreateNotificationData): Promise<void> => {
  try {
    await axios.post(API_URL, data);
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    throw error;
  }
};