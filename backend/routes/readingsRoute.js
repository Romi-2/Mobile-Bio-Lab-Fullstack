// backend/routes/readingsRoute.js
import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

/**
 * POST /api/readings
 */
router.post("/", async (req, res) => {
  try {
    const { device_id, ble_id, temperature, pH, salinity, timestamp } = req.body;

    if (!device_id && !ble_id) {
      return res.status(400).json({ error: "device_id or ble_id required" });
    }

    // find device_id if ble_id given
    let dId = device_id;
    if (!dId && ble_id) {
      const [deviceRows] = await db.query(`SELECT id FROM devices WHERE ble_id = ?`, [ble_id]);
      if (deviceRows.length) {
        dId = deviceRows[0].id;
      } else {
        // optionally create device record automatically
        const [ins] = await db.query(
          `INSERT INTO devices (ble_id, name, last_seen) VALUES (?, ?, NOW())`,
          [ble_id, ble_id]
        );
        dId = ins.insertId;
      }
    }

    if (!dId) return res.status(400).json({ error: "unable_to_resolve_device" });

    const ts = timestamp ? new Date(timestamp) : new Date();

    await db.query(
      `INSERT INTO readings (device_id, temperature, ph, salinity, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [dId, temperature ?? null, pH ?? null, salinity ?? null, ts]
    );

    await db.query(`UPDATE devices SET last_seen = NOW() WHERE id = ?`, [dId]);

    res.json({ success: true });
  } catch (err) {
    console.error("insert reading error:", err);
    res.status(500).json({ error: "internal_server_error" });
  }
});

/**
 * GET /api/readings/latest/:deviceId
 */
router.get("/latest/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const [rows] = await db.query(
      `SELECT * FROM readings WHERE device_id = ? ORDER BY created_at DESC LIMIT 1`,
      [deviceId]
    );
    res.json({ reading: rows[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal_server_error" });
  }
});

/**
 * GET /api/readings/history/:deviceId
 */
router.get("/history/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const [rows] = await db.query(
      `SELECT * FROM readings WHERE device_id = ? ORDER BY created_at DESC LIMIT ?`,
      [deviceId, limit]
    );
    res.json({ readings: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal_server_error" });
  }
});

/**
 * GET /api/readings/recent
 */
router.get("/recent", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const [rows] = await db.query(
      `SELECT r.*, d.ble_id, d.name AS device_name
       FROM readings r
       LEFT JOIN devices d ON r.device_id = d.id
       ORDER BY r.created_at DESC
       LIMIT ?`,
      [limit]
    );
    res.json({ readings: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal_server_error" });
  }
});

export default router;
