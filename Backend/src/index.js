const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const tasksRoutes = require("./routes/tasks");
const paymentsRoutes = require("./routes/payments");
const managerRoutes = require("./routes/manager");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:4173", // Vite preview
      "https://localhost:5173",
      "https://localhost:4173",
    ];

    // Add production domains from env
    if (process.env.ALLOWED_ORIGINS) {
      allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(","));
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Key"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "dev-secret"));

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.code === "23505") {
    // Postgres unique violation
    return res.status(400).json({
      message: "Resource already exists",
      errors: { unique: "This value is already taken" },
    });
  }

  if (err.code === "23503") {
    // Postgres foreign key violation
    return res.status(400).json({
      message: "Invalid reference",
      errors: { reference: "Referenced resource does not exist" },
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    errors: err.errors || null,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
  );
  console.log(
    `🗄️  Database: ${process.env.DATABASE_URL ? "Connected" : "Not configured"}`
  );
});

module.exports = app;
