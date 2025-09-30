import express from "express";
import { db } from "../server.js";

const router = express.Router();

router.post("/", (req, res) => {
  const {
    reservation_id,
    sampleType,
    collectionDate,
    collectionTime,
    temperature,
    pH,
    salinity,
    location,
  } = req.body;

  if (!reservation_id) return res.status(400).json({ msg: "Reservation ID is required" });
  if (!sampleType) return res.status(400).json({ msg: "Sample type is required" });

  const sql = `
    INSERT INTO samples
    (reservation_id, sample_type, collection_date, collection_time, temperature, pH, salinity, location, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(
    sql,
    [reservation_id, sampleType, collectionDate, collectionTime, temperature, pH, salinity, location],
    (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err);
        return res.status(500).json({ msg: "Database error while saving sample" });
      }
      res.status(201).json({ msg: "Sample saved successfully", id: result.insertId });
    }
  );
});

router.get("/pending", async (req, res) => {
  try {
    const pending = await db.query("SELECT * FROM reservations WHERE status = 'pending'");
    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching reservations" });
  }
});

export default router;
