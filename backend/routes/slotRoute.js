// backend/routes/slotRoute.js
import express from "express";
import { db } from "../server.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [slots] = await db.query(
      "SELECT id, city, date, start_time, end_time, isBooked FROM available_slots WHERE isBooked=0 ORDER BY city, date, start_time"
    );
    console.log("Fetched slots:", slots); // will log DB result
    res.json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ msg: "Error fetching slots", error: error.message });
  }
});

export default router;
