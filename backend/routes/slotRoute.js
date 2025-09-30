// backend/routes/slotRoutes.js
import express from "express";
import { db } from "../server.js";

const router = express.Router();

// ✅ Create a new slot
router.post("/", async (req, res) => {
  try {
    const { city, date, start_time, end_time } = req.body;
    await db.query(
      "INSERT INTO available_slots (city, date, start_time, end_time) VALUES (?, ?, ?, ?)",
      [city, date, start_time, end_time]
    );
    res.status(201).json({ msg: "Slot created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating slot" });
  }
});

// ✅ Get slots by city
router.get("/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const [slots] = await db.query(
      "SELECT * FROM available_slots WHERE city=? AND isBooked=0 ORDER BY date, start_time",
      [city]
    );
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching slots" });
  }
});

export default router;
