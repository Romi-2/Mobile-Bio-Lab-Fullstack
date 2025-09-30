// backend/routes/reservationPendingRoute.js
import express from "express";
import { db } from "../server.js";
import { getPendingReservations, updateReservationStatus } from "../controllers/reservationapproveController.js";

const router = express.Router();

router.get("/pending", getPendingReservations);
router.put("/:id", updateReservationStatus);

// Extra: reject logic → free slot again
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query("UPDATE reservations SET status=? WHERE id=?", [status, id]);

    if (status === "rejected") {
      const [[reservation]] = await db.query(
        "SELECT slot_id FROM reservations WHERE id=?",
        [id]
      );
      if (reservation?.slot_id) {
        await db.query("UPDATE available_slots SET isBooked=0 WHERE id=?", [
          reservation.slot_id,
        ]);
      }
    }

    res.json({ msg: "Reservation updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating reservation" });
  }
});

export default router;
