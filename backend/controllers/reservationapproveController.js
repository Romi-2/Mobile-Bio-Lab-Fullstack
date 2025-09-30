import { db } from "../server.js";

// Get pending reservations
export const getPendingReservations = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM reservations WHERE status = 'pending'"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching pending reservations:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update reservation status (approve/reject)
export const updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE reservations SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json({ message: `Reservation ${id} updated to ${status}` });
  } catch (err) {
    console.error("Error updating reservation:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
