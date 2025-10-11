// backend/routes/sampleRoute.js
import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

// GET /api/sample/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Query the reservations table instead of samples
    const [rows] = await db.query(
      `SELECT 
        id,
        sample_id as name,
        collection_date as date,
        sample_type,
        geo_location,
        temperature,
        pH,
        salinity,
        created_at
      FROM reservations 
      WHERE sample_id = ? OR id = ?`, 
      [id, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Sample not found" });
    }

    const sample = rows[0];
    
    // Transform the data to match frontend expectations
    const transformedSample = {
      id: sample.name || sample.id,
      name: sample.name || `Sample-${sample.id}`,
      date: sample.date || sample.collection_date,
      value: sample.temperature || sample.pH || sample.salinity || 0,
      // Include additional fields for future use
      sample_type: sample.sample_type,
      geo_location: sample.geo_location,
      temperature: sample.temperature,
      pH: sample.pH,
      salinity: sample.salinity
    };

    res.json(transformedSample);
  } catch (error) {
    console.error("Error fetching sample:", error);
    res.status(500).json({ message: "Error fetching sample", error });
  }
});

export default router;