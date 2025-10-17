import { db } from "../models/Database.js"; // adjust if your db connection file path differs

// ✅ Get all notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// ✅ Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    await db.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking as read:", err);
    res.status(500).json({ message: "Error marking as read" });
  }
};

// ✅ Create a new notification
export const createNotification = async (req, res) => {
  const { user_id, title, message } = req.body;

if (!user_id || !title || !message) {
  return res.status(400).json({ message: "Missing required fields" });
}

  try {
    await db.query(
      "INSERT INTO notifications (user_id, title, message, is_read, created_at) VALUES (?, ?, ?, 0, NOW())",
      [user_id, title, message]
    );
    res.status(201).json({ message: "Notification created successfully" });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ message: "Error creating notification" });
  }
};
