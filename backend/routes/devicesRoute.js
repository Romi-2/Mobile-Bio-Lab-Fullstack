// routes/devicesRoute.js
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * POST /api/devices/register
 * Body: { ble_id, name, services? }
 * Inserts or updates device info and returns device record.
 */
router.post('/register', async (req, res) => {
  const { ble_id, name, services } = req.body;
  if (!ble_id) return res.status(400).json({ error: 'ble_id required' });

  try {
    const [rows] = await db.execute(
      `INSERT INTO devices (ble_id, name, services, last_seen)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), services = VALUES(services), last_seen = NOW()`,
      [ble_id, name || null, services ? JSON.stringify(services) : null]
    );

    // fetch device
    const [deviceRows] = await db.execute(`SELECT * FROM devices WHERE ble_id = ?`, [ble_id]);
    res.json({ device: deviceRows[0] });
  } catch (err) {
    console.error('register device error', err);
    res.status(500).json({ error: 'internal_server_error' });
  }
});

/**
 * GET /api/devices
 * Query: ?limit=20
 */
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  try {
    const [rows] = await db.execute(`SELECT * FROM devices ORDER BY last_seen DESC LIMIT ?`, [limit]);
    res.json({ devices: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_server_error' });
  }
});

/**
 * GET /api/devices/:id
 */
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.execute(`SELECT * FROM devices WHERE id = ?`, [id]);
    if (!rows.length) return res.status(404).json({ error: 'not_found' });
    res.json({ device: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_server_error' });
  }
});

module.exports = router;
