// backend/routes/notificationRoute.ts  (if using TypeScript)
import express from "express";
import {
  getUserNotifications,
  markAsRead,
  createNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/user/:id", getUserNotifications);
router.put("/:id/read", markAsRead);
router.post("/", createNotification);

export default router;