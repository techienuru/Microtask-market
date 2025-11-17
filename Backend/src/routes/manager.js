const express = require("express");
const { query, getOne, getMany, transaction } = require("../lib/db");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Middleware to check if user is a task manager
const requireManager = async (req, res, next) => {
  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Manager access required" });
  }
  next();
};

// GET /api/manager/disputes - Get disputed tasks
router.get("/disputes", authenticateToken, requireManager, async (req, res) => {
  try {
    const disputes = await getMany(`
      SELECT 
        t.*,
        u.name as poster_name, u.phone as poster_phone,
        w.name as worker_name, w.phone as worker_phone,
        r.reason as dispute_reason, r.created_at as disputed_at
      FROM tasks t
      JOIN resolutions r ON t.id = r.task_id
      LEFT JOIN users u ON t.poster_id = u.id
      LEFT JOIN users w ON t.worker_id = w.id
      WHERE t.status = 'disputed' AND r.status = 'pending'
      ORDER BY r.created_at ASC
    `);

    res.json({
      disputes: disputes.map((dispute) => ({
        id: dispute.id,
        title: dispute.title,
        description: dispute.description,
        pay: parseFloat(dispute.pay),
        location: dispute.location,
        status: dispute.status,
        disputeReason: dispute.dispute_reason,
        disputedAt: dispute.disputed_at,
        poster: {
          name: dispute.poster_name,
          phone: dispute.poster_phone,
        },
        worker: dispute.worker_name
          ? {
              name: dispute.worker_name,
              phone: dispute.worker_phone,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Get disputes error:", error);
    res.status(500).json({ message: "Failed to fetch disputes" });
  }
});

// POST /api/manager/disputes/:taskId/resolve - Resolve dispute
router.post(
  "/disputes/:taskId/resolve",
  authenticateToken,
  requireManager,
  async (req, res) => {
    try {
      const { resolution, payAmount } = req.body; // resolution: 'paid', 'partial', 'rework', 'cancelled'

      const task = await getOne("SELECT * FROM tasks WHERE id = $1", [
        req.params.taskId,
      ]);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.status !== "disputed") {
        return res.status(400).json({ message: "Task is not disputed" });
      }

      await transaction(async (client) => {
        let newStatus = "paid";
        let actualPayAmount = parseFloat(payAmount || task.pay);

        switch (resolution) {
          case "paid":
            newStatus = "paid";
            actualPayAmount = parseFloat(task.pay);
            break;
          case "partial":
            newStatus = "paid";
            actualPayAmount = parseFloat(payAmount || task.pay * 0.5);
            break;
          case "rework":
            newStatus = "active";
            actualPayAmount = 0;
            break;
          case "cancelled":
            newStatus = "cancelled";
            actualPayAmount = 0;
            break;
          default:
            throw new Error("Invalid resolution type");
        }

        // Update task status
        await client.query(
          `
        UPDATE tasks 
        SET status = $1, confirmed_at = NOW()
        WHERE id = $2
      `,
          [newStatus, req.params.taskId]
        );

        // Update resolution record
        await client.query(
          `
        UPDATE resolutions 
        SET status = 'resolved', resolution = $1, resolved_by = $2, resolved_at = NOW()
        WHERE task_id = $3 AND status = 'pending'
      `,
          [resolution, req.user.id, req.params.taskId]
        );

        // If payment involved, update worker earnings
        if (actualPayAmount > 0 && task.worker_id) {
          await client.query(
            `
          UPDATE users 
          SET earnings = earnings + $1, completed_count = completed_count + 1
          WHERE id = $2
        `,
            [actualPayAmount, task.worker_id]
          );

          // Check if user should become trusted
          const user = await client.query(
            "SELECT completed_count FROM users WHERE id = $1",
            [task.worker_id]
          );

          if (user.rows[0] && user.rows[0].completed_count >= 3) {
            await client.query(
              "UPDATE users SET trusted = true WHERE id = $1",
              [task.worker_id]
            );
          }
        }

        // Log manager action
        await client.query(
          `
        INSERT INTO audit_logs (
          user_id, action, resource_type, resource_id, details, created_at
        )
        VALUES ($1, 'resolve_dispute', 'task', $2, $3, NOW())
      `,
          [
            req.user.id,
            req.params.taskId,
            JSON.stringify({ resolution, payAmount: actualPayAmount }),
          ]
        );
      });

      res.json({
        message: "Dispute resolved successfully",
        resolution,
        payAmount: actualPayAmount,
      });
    } catch (error) {
      console.error("Resolve dispute error:", error);
      res.status(500).json({ message: "Failed to resolve dispute" });
    }
  }
);

// GET /api/manager/overdue - Get overdue confirmations
router.get("/overdue", authenticateToken, requireManager, async (req, res) => {
  try {
    const overdueHours = 6;

    const overdueTasks = await getMany(`
      SELECT 
        t.*,
        u.name as poster_name, u.phone as poster_phone,
        w.name as worker_name, w.phone as worker_phone
      FROM tasks t
      LEFT JOIN users u ON t.poster_id = u.id
      LEFT JOIN users w ON t.worker_id = w.id
      WHERE t.status = 'completed' 
        AND t.completed_at < NOW() - INTERVAL '${overdueHours} hours'
      ORDER BY t.completed_at ASC
    `);

    res.json({
      overdueTasks: overdueTasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        pay: parseFloat(task.pay),
        location: task.location,
        completedAt: task.completed_at,
        hoursOverdue: Math.floor(
          (Date.now() - new Date(task.completed_at)) / (1000 * 60 * 60)
        ),
        poster: {
          name: task.poster_name,
          phone: task.poster_phone,
        },
        worker: task.worker_name
          ? {
              name: task.worker_name,
              phone: task.worker_phone,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Get overdue tasks error:", error);
    res.status(500).json({ message: "Failed to fetch overdue tasks" });
  }
});

// GET /api/manager/stats - Get manager dashboard stats
router.get("/stats", authenticateToken, requireManager, async (req, res) => {
  try {
    const stats = await getOne(`
      SELECT 
        COUNT(CASE WHEN status = 'disputed' THEN 1 END) as active_disputes,
        COUNT(CASE WHEN status = 'completed' AND completed_at < NOW() - INTERVAL '6 hours' THEN 1 END) as overdue_confirmations,
        COUNT(CASE WHEN status = 'paid' AND confirmed_at > NOW() - INTERVAL '24 hours' THEN 1 END) as resolved_today
      FROM tasks
    `);

    res.json({
      activeDisputes: parseInt(stats.active_disputes),
      overdueConfirmations: parseInt(stats.overdue_confirmations),
      resolvedToday: parseInt(stats.resolved_today),
    });
  } catch (error) {
    console.error("Get manager stats error:", error);
    res.status(500).json({ message: "Failed to fetch manager stats" });
  }
});

module.exports = router;
