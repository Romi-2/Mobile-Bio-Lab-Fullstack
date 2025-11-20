import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { db } from "../models/Database.js";

const router = express.Router();

// ✅ Get logged-in user's reservations
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`=== USER ${userId} FETCHING THEIR RESERVATIONS ===`);

    const [results] = await db.query(`
      SELECT 
        r.id,
        r.user_id,
        r.slot_id,
        r.reservation_date,
        r.reservation_time,
        r.duration,
        r.status,
        r.sample_id,
        r.sample_type,
        r.collection_date,
        r.collection_time,
        r.geo_location,
        r.temperature,
        r.pH,
        r.salinity,
        r.created_at,
        r.updated_at
      FROM reservations r
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);

    console.log(`🔹 User reservations fetched: ${results.length} rows`);
    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching user reservations:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
