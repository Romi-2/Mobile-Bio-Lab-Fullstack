// backend/routes/protocolRoute.js
import express from "express";
import { db } from "../models/Database.js";

const router = express.Router();

// --------------------
// GET /api/protocols - Get all protocols
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

    // Parse JSON steps
    const parsedProtocols = protocols.map(protocol => ({
      ...protocol,
      steps: JSON.parse(protocol.steps || "[]"),
    }));

    res.json(parsedProtocols);
  } catch (error) {
    console.error("Error fetching protocols:", error);
    res.status(500).json({ message: "Error fetching protocols", error });
  }
});

// --------------------
// GET /api/protocols/:id - Get single protocol
// --------------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [protocols] = await db.query(`
      SELECT 
        p.*, 
        CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
      FROM protocols p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = ?
    `, [id]);

    if (protocols.length === 0) {
      return res.status(404).json({ message: "Protocol not found" });
    }

    const protocol = {
      ...protocols[0],
      steps: JSON.parse(protocols[0].steps || "[]"),
    };

    res.json(protocol);
  } catch (error) {
    console.error("Error fetching protocol:", error);
    res.status(500).json({ message: "Error fetching protocol", error });
  }
});

// --------------------
// POST /api/protocols - Create new protocol
// --------------------
router.post("/", async (req, res) => {
  try {
    const { title, description, category, steps, created_by } = req.body;

    if (!title || !category || !steps || !created_by) {
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
// PUT /api/protocols/:id - Update protocol
// --------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, steps } = req.body;

    const [result] = await db.query(
      "UPDATE protocols SET title = ?, description = ?, category = ?, steps = ? WHERE id = ?",
      [title, description, category, JSON.stringify(steps), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Protocol not found" });
    }

    res.json({ message: "Protocol updated successfully" });
  } catch (error) {
    console.error("Error updating protocol:", error);
    res.status(500).json({ message: "Error updating protocol", error });
  }
});

// --------------------
// DELETE /api/protocols/:id - Delete protocol
// --------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM protocols WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Protocol not found" });
    }

    res.json({ message: "Protocol deleted successfully" });
  } catch (error) {
    console.error("Error deleting protocol:", error);
    res.status(500).json({ message: "Error deleting protocol", error });
  }
});

export default router;
