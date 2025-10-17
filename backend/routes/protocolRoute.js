import express from "express";
import { db } from "../models/Database.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// --------------------
// GET /api/protocols - Get all protocols (PUBLIC - no auth required)
// --------------------
router.get("/", async (req, res) => {
  try {
    const [protocols] = await db.query(`
      SELECT 
        p.*, 
        CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
      FROM protocols p
      LEFT JOIN users u ON p.created_by = u.id
      ORDER BY p.created_at DESC
    `);

    const parsedProtocols = protocols.map(protocol => ({
      ...protocol,
      steps:
        typeof protocol.steps === "string"
          ? JSON.parse(protocol.steps || "[]")
          : protocol.steps || [],
    }));

    res.json(parsedProtocols);
  } catch (error) {
    console.error("Error fetching protocols:", error);
    res.status(500).json({ message: "Error fetching protocols", error });
  }
});

// --------------------
// GET /api/protocols/my-protocols - Get current user's protocols (PROTECTED)
// --------------------
router.get("/my-protocols", protect, async (req, res) => {
  try {
    console.log("User making request:", req.user);

    const userId = req.user.id;

    const [protocols] = await db.query(
      `
      SELECT 
        p.*, 
        CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
      FROM protocols p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.created_by = ?
      ORDER BY p.created_at DESC
    `,
      [userId]
    );

    const parsedProtocols = protocols.map(protocol => ({
      ...protocol,
      steps:
        typeof protocol.steps === "string"
          ? JSON.parse(protocol.steps || "[]")
          : protocol.steps || [],
    }));

    res.json(parsedProtocols);
  } catch (error) {
    console.error("Error fetching user protocols:", error);
    res.status(500).json({ message: "Error fetching user protocols", error });
  }
});

// --------------------
// POST /api/protocols - Create new protocol (PROTECTED)
// --------------------
// --------------------
// POST /api/protocols - Create new protocol (ADMIN ONLY)
// --------------------
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, category, steps } = req.body;
    const created_by = req.user.id;

    if (!title || !category || !steps) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      "INSERT INTO protocols (title, description, category, steps, created_by) VALUES (?, ?, ?, ?, ?)",
      [title, description, category, JSON.stringify(steps), created_by]
    );

    res.status(201).json({
      message: "Protocol created successfully",
      protocolId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating protocol:", error);
    res.status(500).json({ message: "Error creating protocol", error });
  }
});

// --------------------
// PUT /api/protocols/:id - Update protocol (ADMIN ONLY)
// --------------------
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const protocolId = req.params.id;
    const { title, description, category, steps } = req.body;

    const [existing] = await db.query("SELECT * FROM protocols WHERE id = ?", [protocolId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Protocol not found" });
    }

    await db.query(
      "UPDATE protocols SET title = ?, description = ?, category = ?, steps = ?, updated_at = NOW() WHERE id = ?",
      [title, description, category, JSON.stringify(steps), protocolId]
    );

    res.json({ message: "Protocol updated successfully" });
  } catch (error) {
    console.error("Error updating protocol:", error);
    res.status(500).json({ message: "Error updating protocol", error });
  }
});

// --------------------
// DELETE /api/protocols/:id - Delete protocol (ADMIN ONLY)
// --------------------
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const protocolId = req.params.id;

    const [existing] = await db.query("SELECT * FROM protocols WHERE id = ?", [protocolId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Protocol not found" });
    }

    await db.query("DELETE FROM protocols WHERE id = ?", [protocolId]);
    res.json({ message: "Protocol deleted successfully" });
  } catch (error) {
    console.error("Error deleting protocol:", error);
    res.status(500).json({ message: "Error deleting protocol", error });
  }
});

export default router;
