const express = require("express");
const { query, getOne } = require("../lib/db");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Middleware to check admin access
const requireAdmin = (req, res, next) => {
  const adminKey = req.headers["x-admin-key"];

  if (adminKey === process.env.ADMIN_SEED_KEY) {
    return next();
  }

  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Admin access required" });
};

// POST /api/admin/seed - Seed database with demo data
router.post("/seed", requireAdmin, async (req, res) => {
  try {
    // Run seed script
    const { spawn } = require("child_process");
    const seedProcess = spawn("node", ["scripts/seed.js"], {
      cwd: process.cwd(),
      env: process.env,
    });

    let output = "";
    let error = "";

    seedProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    seedProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    seedProcess.on("close", (code) => {
      if (code === 0) {
        res.json({
          message: "Database seeded successfully",
          output: output.trim(),
        });
      } else {
        res.status(500).json({
          message: "Seed script failed",
          error: error.trim(),
        });
      }
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ message: "Failed to run seed script" });
  }
});

// POST /api/admin/reset - Reset database
router.post("/reset", requireAdmin, async (req, res) => {
  try {
    // Clear all data (be careful!)
    await query(
      "TRUNCATE TABLE audit_logs, notifications, resolutions, escrow, proofs, applications, tasks, otps, users RESTART IDENTITY CASCADE"
    );

    res.json({ message: "Database reset successfully" });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({ message: "Failed to reset database" });
  }
});

// GET /api/admin/stats - Get admin dashboard stats
router.get("/stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await getOne(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM tasks) as total_tasks,
        (SELECT COUNT(*) FROM tasks WHERE status = 'active') as active_tasks,
        (SELECT COUNT(*) FROM tasks WHERE status = 'completed') as completed_tasks,
        (SELECT COUNT(*) FROM tasks WHERE status = 'disputed') as disputed_tasks,
        (SELECT COUNT(*) FROM applications) as total_applications,
        (SELECT SUM(earnings) FROM users) as total_earnings
    `);

    res.json({
      totalUsers: parseInt(stats.total_users),
      totalTasks: parseInt(stats.total_tasks),
      activeTasks: parseInt(stats.active_tasks),
      completedTasks: parseInt(stats.completed_tasks),
      disputedTasks: parseInt(stats.disputed_tasks),
      totalApplications: parseInt(stats.total_applications),
      totalEarnings: parseFloat(stats.total_earnings || 0),
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

// GET /api/admin/users - Get all users (admin only)
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await query(`
      SELECT 
        id, name, email, phone, role, trusted, completed_count, earnings, 
        email_verified, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      users: users.rows.map((user) => ({
        ...user,
        earnings: parseFloat(user.earnings),
      })),
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
