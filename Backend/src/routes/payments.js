const express = require("express");
const { query, getOne, transaction } = require("../lib/db");
const { authenticateToken } = require("./auth");

const router = express.Router();

// POST /api/payments/escrow/create - Create escrow for high-value tasks
router.post("/escrow/create", authenticateToken, async (req, res) => {
  try {
    const { taskId, amount, proofImageUrl } = req.body;

    if (!taskId || !amount) {
      return res.status(400).json({ message: "Task ID and amount required" });
    }

    const task = await getOne("SELECT * FROM tasks WHERE id = $1", [taskId]);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.poster_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (parseFloat(amount) !== parseFloat(task.pay)) {
      return res.status(400).json({ message: "Amount must match task pay" });
    }

    // Create escrow record
    const result = await query(
      `
      INSERT INTO escrow (
        task_id, poster_id, amount, proof_image_url, status, created_at
      )
      VALUES ($1, $2, $3, $4, 'held', NOW())
      RETURNING *
    `,
      [taskId, req.user.id, amount, proofImageUrl]
    );

    const escrow = result.rows[0];

    // Update task to mark escrow as created
    await query(
      `
      UPDATE tasks SET escrow_required = true, escrow_id = $1
      WHERE id = $2
    `,
      [escrow.id, taskId]
    );

    res.status(201).json({
      message: "Escrow created successfully",
      escrow: {
        id: escrow.id,
        taskId: escrow.task_id,
        amount: parseFloat(escrow.amount),
        status: escrow.status,
        createdAt: escrow.created_at,
      },
    });
  } catch (error) {
    console.error("Create escrow error:", error);
    res.status(500).json({ message: "Failed to create escrow" });
  }
});

// POST /api/payments/escrow/:id/release - Release escrow payment
router.post("/escrow/:id/release", authenticateToken, async (req, res) => {
  try {
    const { recipientId } = req.body;

    const escrow = await getOne(
      `
      SELECT e.*, t.poster_id, t.worker_id
      FROM escrow e
      JOIN tasks t ON e.task_id = t.id
      WHERE e.id = $1
    `,
      [req.params.id]
    );

    if (!escrow) {
      return res.status(404).json({ message: "Escrow not found" });
    }

    if (escrow.poster_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (escrow.status !== "held") {
      return res.status(400).json({ message: "Escrow already processed" });
    }

    const recipient = recipientId || escrow.worker_id;

    if (!recipient) {
      return res.status(400).json({ message: "No recipient specified" });
    }

    await transaction(async (client) => {
      // Release escrow
      await client.query(
        `
        UPDATE escrow 
        SET status = 'released', recipient_id = $1, released_at = NOW()
        WHERE id = $2
      `,
        [recipient, req.params.id]
      );

      // Update user earnings
      await client.query(
        `
        UPDATE users 
        SET earnings = earnings + $1, completed_count = completed_count + 1
        WHERE id = $2
      `,
        [escrow.amount, recipient]
      );

      // Check if user should become trusted
      const user = await client.query(
        "SELECT completed_count FROM users WHERE id = $1",
        [recipient]
      );

      if (user.rows[0] && user.rows[0].completed_count >= 3) {
        await client.query("UPDATE users SET trusted = true WHERE id = $1", [
          recipient,
        ]);
      }

      // Update task status
      await client.query(
        `
        UPDATE tasks SET status = 'paid', confirmed_at = NOW()
        WHERE id = $1
      `,
        [escrow.task_id]
      );
    });

    res.json({ message: "Escrow released successfully" });
  } catch (error) {
    console.error("Release escrow error:", error);
    res.status(500).json({ message: "Failed to release escrow" });
  }
});

// GET /api/payments/escrow - Get user's escrow records
router.get("/escrow", authenticateToken, async (req, res) => {
  try {
    const escrows = await query(
      `
      SELECT e.*, t.title, t.description
      FROM escrow e
      JOIN tasks t ON e.task_id = t.id
      WHERE e.poster_id = $1 OR e.recipient_id = $1
      ORDER BY e.created_at DESC
    `,
      [req.user.id]
    );

    res.json({
      escrows: escrows.rows.map((escrow) => ({
        id: escrow.id,
        taskId: escrow.task_id,
        taskTitle: escrow.title,
        amount: parseFloat(escrow.amount),
        status: escrow.status,
        createdAt: escrow.created_at,
        releasedAt: escrow.released_at,
      })),
    });
  } catch (error) {
    console.error("Get escrow error:", error);
    res.status(500).json({ message: "Failed to fetch escrow records" });
  }
});

module.exports = router;
