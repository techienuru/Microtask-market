const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { query, getOne, getMany, transaction } = require("../lib/db");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"));
    }
  },
});

// GET /api/tasks - List tasks
router.get("/", async (req, res) => {
  try {
    const { status, workerId, posterId, limit = 50, offset = 0 } = req.query;

    let whereClause = "WHERE 1=1";
    const params = [];
    let paramCount = 0;

    if (status) {
      whereClause += ` AND t.status = $${++paramCount}`;
      params.push(status);
    }

    if (workerId) {
      whereClause += ` AND t.worker_id = $${++paramCount}`;
      params.push(workerId);
    }

    if (posterId) {
      whereClause += ` AND t.poster_id = $${++paramCount}`;
      params.push(posterId);
    }

    const tasks = await getMany(
      `
      SELECT 
        t.*,
        u.name as poster_name,
        u.trusted as poster_trusted,
        w.name as worker_name,
        w.trusted as worker_trusted,
        COUNT(a.id) as applicant_count
      FROM tasks t
      LEFT JOIN users u ON t.poster_id = u.id
      LEFT JOIN users w ON t.worker_id = w.id
      LEFT JOIN applications a ON t.id = a.task_id
      ${whereClause}
      GROUP BY t.id, u.name, u.trusted, w.name, w.trusted
      ORDER BY t.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `,
      [...params, limit, offset]
    );

    // Get applicants for each task
    const tasksWithApplicants = await Promise.all(
      tasks.map(async (task) => {
        const applicants = await getMany(
          `
          SELECT a.*, u.name, u.trusted, u.completed_count
          FROM applications a
          JOIN users u ON a.user_id = u.id
          WHERE a.task_id = $1
          ORDER BY a.created_at ASC
        `,
          [task.id]
        );

        return {
          ...task,
          pay: parseFloat(task.pay),
          applicants: applicants.map((app) => ({
            userId: app.user_id,
            name: app.name,
            trusted: app.trusted,
            completedCount: app.completed_count,
            note: app.note,
            appliedAt: app.created_at,
            distance: parseFloat(app.distance) || 0,
          })),
        };
      })
    );

    res.json({ tasks: tasksWithApplicants });
  } catch (error) {
    console.error("List tasks error:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// GET /api/tasks/:id - Get task details
router.get("/:id", async (req, res) => {
  try {
    const task = await getOne(
      `
      SELECT 
        t.*,
        u.name as poster_name,
        u.trusted as poster_trusted,
        u.phone as poster_phone,
        w.name as worker_name,
        w.trusted as worker_trusted,
        w.phone as worker_phone
      FROM tasks t
      LEFT JOIN users u ON t.poster_id = u.id
      LEFT JOIN users w ON t.worker_id = w.id
      WHERE t.id = $1
    `,
      [req.params.id]
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Get applicants
    const applicants = await getMany(
      `
      SELECT a.*, u.name, u.trusted, u.completed_count
      FROM applications a
      JOIN users u ON a.user_id = u.id
      WHERE a.task_id = $1
      ORDER BY a.created_at ASC
    `,
      [task.id]
    );

    // Get proof if exists
    const proof = await getOne(
      `
      SELECT * FROM proofs WHERE task_id = $1
    `,
      [task.id]
    );

    res.json({
      ...task,
      pay: parseFloat(task.pay),
      poster: task.poster_name
        ? {
            name: task.poster_name,
            trusted: task.poster_trusted,
            phone: task.poster_phone,
          }
        : null,
      worker: task.worker_name
        ? {
            name: task.worker_name,
            trusted: task.worker_trusted,
            phone: task.worker_phone,
          }
        : null,
      applicants: applicants.map((app) => ({
        userId: app.user_id,
        name: app.name,
        trusted: app.trusted,
        completedCount: app.completed_count,
        note: app.note,
        appliedAt: app.created_at,
        distance: parseFloat(app.distance) || 0,
      })),
      proofSubmitted: proof
        ? {
            type: proof.type,
            beforeImage: proof.before_image_url,
            afterImage: proof.after_image_url,
            code: proof.code,
            submittedAt: proof.created_at,
          }
        : null,
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
});

// POST /api/tasks - Create task
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      pay,
      location,
      dateTime,
      mode,
      proofRequired,
      category,
    } = req.body;

    if (!title || !pay || !location || !dateTime) {
      return res.status(400).json({
        message: "Missing required fields",
        errors: { required: "Title, pay, location, and dateTime are required" },
      });
    }

    const payAmount = parseFloat(pay);
    if (payAmount <= 0) {
      return res.status(400).json({
        message: "Invalid pay amount",
        errors: { pay: "Pay must be greater than 0" },
      });
    }

    const result = await query(
      `
      INSERT INTO tasks (
        title, description, pay, location, date_time, mode, proof_required, 
        category, poster_id, status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active', NOW())
      RETURNING *
    `,
      [
        title,
        description || "",
        payAmount,
        location,
        dateTime,
        mode || "single",
        proofRequired || false,
        category || "general",
        req.user.id,
      ]
    );

    const task = result.rows[0];

    res.status(201).json({
      message: "Task created successfully",
      task: {
        ...task,
        pay: parseFloat(task.pay),
      },
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// POST /api/tasks/:id/reserve - Reserve task (single mode)
router.post("/:id/reserve", authenticateToken, async (req, res) => {
  try {
    const task = await getOne("SELECT * FROM tasks WHERE id = $1", [
      req.params.id,
    ]);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status !== "active") {
      return res.status(400).json({ message: "Task is not available" });
    }

    if (task.mode !== "single") {
      return res
        .status(400)
        .json({ message: "Task does not support direct reservation" });
    }

    if (task.poster_id === req.user.id) {
      return res.status(400).json({ message: "Cannot reserve your own task" });
    }

    // Reserve the task
    await query(
      `
      UPDATE tasks 
      SET status = 'reserved', worker_id = $1, reserved_at = NOW()
      WHERE id = $2 AND status = 'active'
    `,
      [req.user.id, req.params.id]
    );

    res.json({ message: "Task reserved successfully" });
  } catch (error) {
    console.error("Reserve task error:", error);
    res.status(500).json({ message: "Failed to reserve task" });
  }
});

// POST /api/tasks/:id/apply - Apply for task (applications mode)
router.post("/:id/apply", authenticateToken, async (req, res) => {
  try {
    const { note } = req.body;

    const task = await getOne("SELECT * FROM tasks WHERE id = $1", [
      req.params.id,
    ]);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status !== "active") {
      return res.status(400).json({ message: "Task is not available" });
    }

    if (task.mode !== "applications") {
      return res
        .status(400)
        .json({ message: "Task does not accept applications" });
    }

    if (task.poster_id === req.user.id) {
      return res.status(400).json({ message: "Cannot apply to your own task" });
    }

    // Check if already applied
    const existingApplication = await getOne(
      "SELECT id FROM applications WHERE task_id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied to this task" });
    }

    // Check application limit
    const applicationCount = await getOne(
      "SELECT COUNT(*) as count FROM applications WHERE task_id = $1",
      [req.params.id]
    );

    if (parseInt(applicationCount.count) >= 3) {
      return res.status(400).json({ message: "Maximum applications reached" });
    }

    // Create application
    await query(
      `
      INSERT INTO applications (task_id, user_id, note, distance, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `,
      [req.params.id, req.user.id, note || "", Math.random() * 10]
    ); // Random distance for demo

    res.json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Apply task error:", error);
    res.status(500).json({ message: "Failed to apply for task" });
  }
});

// POST /api/tasks/:id/proof - Upload task completion proof
router.post(
  "/:id/proof",
  authenticateToken,
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { type, code } = req.body;

      const task = await getOne("SELECT * FROM tasks WHERE id = $1", [
        req.params.id,
      ]);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.worker_id !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to submit proof for this task" });
      }

      if (task.status !== "reserved") {
        return res
          .status(400)
          .json({ message: "Task is not in reserved state" });
      }

      let beforeImageUrl = null;
      let afterImageUrl = null;

      if (req.files) {
        if (req.files.beforeImage) {
          beforeImageUrl = `/uploads/${req.files.beforeImage[0].filename}`;
        }
        if (req.files.afterImage) {
          afterImageUrl = `/uploads/${req.files.afterImage[0].filename}`;
        }
      }

      // Create proof record
      await query(
        `
      INSERT INTO proofs (task_id, type, before_image_url, after_image_url, code, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (task_id) DO UPDATE SET
        type = EXCLUDED.type,
        before_image_url = EXCLUDED.before_image_url,
        after_image_url = EXCLUDED.after_image_url,
        code = EXCLUDED.code,
        created_at = EXCLUDED.created_at
    `,
        [req.params.id, type || "photo", beforeImageUrl, afterImageUrl, code]
      );

      // Update task status
      await query(
        `
      UPDATE tasks SET status = 'completed', completed_at = NOW()
      WHERE id = $1
    `,
        [req.params.id]
      );

      res.json({ message: "Proof uploaded successfully" });
    } catch (error) {
      console.error("Upload proof error:", error);
      res.status(500).json({ message: "Failed to upload proof" });
    }
  }
);

// GET /api/tasks/:id/applicants - Get task applicants (poster only)
router.get("/:id/applicants", authenticateToken, async (req, res) => {
  try {
    const task = await getOne("SELECT * FROM tasks WHERE id = $1", [
      req.params.id,
    ]);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.poster_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view applicants" });
    }

    const applicants = await getMany(
      `
      SELECT a.*, u.name, u.trusted, u.completed_count, u.phone
      FROM applications a
      JOIN users u ON a.user_id = u.id
      WHERE a.task_id = $1
      ORDER BY a.created_at ASC
    `,
      [req.params.id]
    );

    res.json({
      applicants: applicants.map((app) => ({
        userId: app.user_id,
        name: app.name,
        trusted: app.trusted,
        completedCount: app.completed_count,
        phone: app.phone,
        note: app.note,
        appliedAt: app.created_at,
        distance: parseFloat(app.distance) || 0,
      })),
    });
  } catch (error) {
    console.error("Get applicants error:", error);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
});

module.exports = router;
