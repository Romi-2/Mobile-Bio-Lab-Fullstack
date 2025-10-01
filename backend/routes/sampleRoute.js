// backend/routes/sampleRoutes.js
import express from "express";
import { db } from "../server.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      reservationId,
      sampleId,
      sampleType,
      collectionDate,
      collectionTime,
      geoLocation,
      temperature,
      pH,
      salinity,
    } = req.body;

    await db.query(
      `INSERT INTO samples 
      (reservation_id, sample_id, sample_type, collection_date, collection_time, geo_location, temperature, pH, salinity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [reservationId, sampleId, sampleType, collectionDate, collectionTime, geoLocation, temperature, pH, salinity]
    );

    res.status(201).json({ msg: "Sample data submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error submitting sample data" });
  }
});

export default router;
