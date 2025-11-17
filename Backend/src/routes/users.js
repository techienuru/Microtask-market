const express = require("express");
const { query, getOne, getMany } = require("../lib/db");
const { authenticateToken } = require("./auth");

const router = express.Router();

// GET /api/users/:id - Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await getOne(
      `
      SELECT 
        id, name, email, phone, role, lga, neighbourhood,
        trusted, completed_count, earnings, created_at
      FROM users 
      WHERE id = $1
    `,
      [req.params.id]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      lga: user.lga,
      neighbourhood: user.neighbourhood,
      trusted: user.trusted,
      completedCount: user.completed_count,
      earnings: parseFloat(user.earnings),
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// PUT /api/users/:id - Update user profile
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    const { name, lga, neighbourhood } = req.body;

    const result = await query(
      `
      UPDATE users 
      SET name = COALESCE($1, name),
          lga = COALESCE($2, lga),
          neighbourhood = COALESCE($3, neighbourhood),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, email, phone, role, lga, neighbourhood, trusted, completed_count, earnings
    `,
      [name, lga, neighbourhood, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        lga: user.lga,
        neighbourhood: user.neighbourhood,
        trusted: user.trusted,
        completedCount: user.completed_count,
        earnings: parseFloat(user.earnings),
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// GET /api/users/me/postings - Get user's posted tasks
router.get("/me/postings", authenticateToken, async (req, res) => {
  try {
    const tasks = await getMany(
      `
      SELECT 
        t.*,
        COUNT(a.id) as applicant_count,
        w.name as worker_name,
        w.trusted as worker_trusted
      FROM tasks t
      LEFT JOIN applications a ON t.id = a.task_id
      LEFT JOIN users w ON t.worker_id = w.id
      WHERE t.poster_id = $1
      GROUP BY t.id, w.name, w.trusted
      ORDER BY t.created_at DESC
    `,
      [req.user.id]
    );

    res.json({
      tasks: tasks.map((task) => ({
        ...task,
        pay: parseFloat(task.pay),
        applicantCount: parseInt(task.applicant_count),
        worker: task.worker_name
          ? {
              name: task.worker_name,
              trusted: task.worker_trusted,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Get user postings error:", error);
    res.status(500).json({ message: "Failed to fetch postings" });
  }
});

// GET /api/users/me/jobs - Get user's job history
router.get("/me/jobs", authenticateToken, async (req, res) => {
  try {
    const tasks = await getMany(
      `
      SELECT 
        t.*,
        u.name as poster_name,
        u.trusted as poster_trusted
      FROM tasks t
      JOIN users u ON t.poster_id = u.id
      WHERE t.worker_id = $1
      ORDER BY t.created_at DESC
    `,
      [req.user.id]
    );

    res.json({
      tasks: tasks.map((task) => ({
        ...task,
        pay: parseFloat(task.pay),
        poster: {
          name: task.poster_name,
          trusted: task.poster_trusted,
        },
      })),
    });
  } catch (error) {
    console.error("Get user jobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// GET /api/users/me/wallet - Get user's wallet info
router.get("/me/wallet", authenticateToken, async (req, res) => {
  try {
    const wallet = await getOne(
      `
      SELECT 
        earnings,
        completed_count,
        (SELECT COUNT(*) FROM tasks WHERE worker_id = $1 AND status = 'active') as active_jobs,
        (SELECT COUNT(*) FROM tasks WHERE worker_id = $1 AND status = 'completed') as pending_confirmations
      FROM users
      WHERE id = $1
    `,
      [req.user.id]
    );

    if (!wallet) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      balance: parseFloat(wallet.earnings),
      completedTasks: wallet.completed_count,
      activeJobs: parseInt(wallet.active_jobs),
      pendingConfirmations: parseInt(wallet.pending_confirmations),
    });
  } catch (error) {
    console.error("Get wallet error:", error);
    res.status(500).json({ message: "Failed to fetch wallet info" });
  }
});

module.exports = router;
