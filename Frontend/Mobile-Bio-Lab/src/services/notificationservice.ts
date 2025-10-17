// src/services/notificationService.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications"; // backend endpoint

export const getNotifications = async (userId: number) => {
  const res = await axios.get(`${API_URL}/user/${userId}`);
  return res.data;
};


export const markAsRead = async (notificationId: number) => {
  await axios.put(`${API_URL}/${notificationId}/read`);
};

export const createNotification = async (data: {
  user_id: number;
  title: string;
  message: string;
}) => {
  await axios.post(API_URL, data);
};
