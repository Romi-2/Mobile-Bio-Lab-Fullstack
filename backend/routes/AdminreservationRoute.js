// backend/routes/AdminreservationRoute.js
import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { db } from "../models/Database.js";

const router = express.Router();

// ✅ Admin gets all reservations - UPDATED TO MATCH DATABASE
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    console.log("=== ADMIN FETCHING RESERVATIONS ===");

    const [rows] = await db.query("SELECT COUNT(*) AS total FROM reservations");
    console.log("🔹 Total reservations in DB:", rows[0].total);

    const [results] = await db.query(`
      SELECT 
        r.id,
        CONCAT(u.first_name, ' ', u.last_name) AS user_name,
        u.email,
        u.vu_id,
        r.slot_id,
        r.reservation_date,
        r.reservation_time,
        r.duration,
        r.status,
        r.geo_location,
        r.created_at
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);

    console.log(`🔹 Query returned: ${results.length} rows`);
    console.log(JSON.stringify(results, null, 2));

    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching reservations:", error);
    res.status(500).json({ message: error.message });
  }
});


// ✅ 3. Admin updates reservation status
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    console.log(`🔄 Updating reservation ${id} to status: ${status}`);

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const [result] = await db.query(
      "UPDATE reservations SET status = ? WHERE id = ?", 
      [status, id]
    );

    if (result.affectedRows === 0) {
      console.log(`❌ Reservation ${id} not found for update`);
      return res.status(404).json({ message: "Reservation not found" });
    }

    console.log(`✅ Successfully updated reservation ${id} to ${status}`);
    res.json({ message: `Reservation ${status} successfully` });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ 
      message: "Server error while updating status",
      error: error.message 
    });
  }
});

export default router;