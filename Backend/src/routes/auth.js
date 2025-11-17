const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query, getOne } = require("../lib/db");

const router = express.Router();

// Generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

// Middleware to verify JWT
const authenticateToken = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getOne("SELECT * FROM users WHERE id = $1", [
      decoded.userId,
    ]);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role, lga, neighbourhood } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        message: "Missing required fields",
        errors: {
          required: "Name, email, phone, password, and role are required",
        },
      });
    }

    // Check if user exists
    const existingUser = await getOne(
      "SELECT id FROM users WHERE email = $1 OR phone = $2",
      [email, phone]
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        errors: { unique: "Email or phone number already registered" },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      `
      INSERT INTO users (name, email, phone, password_hash, role, lga, neighbourhood, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, name, email, phone, role, lga, neighbourhood, created_at
    `,
      [
        name,
        email,
        phone,
        hashedPassword,
        role,
        lga || null,
        neighbourhood || null,
      ]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        lga: user.lga,
        neighbourhood: user.neighbourhood,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// POST /api/auth/request-otp
router.post("/request-otp", async (req, res) => {
  try {
    const { identifier } = req.body; // email or phone

    if (!identifier) {
      return res.status(400).json({ message: "Email or phone required" });
    }

    // Find user
    const user = await getOne(
      "SELECT id, email, phone FROM users WHERE email = $1 OR phone = $1",
      [identifier]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    await query(
      `
      INSERT INTO otps (user_id, otp, expires_at, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        otp = EXCLUDED.otp,
        expires_at = EXCLUDED.expires_at,
        created_at = EXCLUDED.created_at
    `,
      [user.id, otp, expiresAt]
    );

    // In development, return OTP in response
    const response = { message: "OTP sent successfully" };
    if (process.env.NODE_ENV === "development") {
      response.otp = otp; // For testing
    }

    res.json(response);
  } catch (error) {
    console.error("OTP request error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ message: "Identifier and OTP required" });
    }

    // Find user and OTP
    const result = await getOne(
      `
      SELECT u.*, o.otp, o.expires_at
      FROM users u
      JOIN otps o ON u.id = o.user_id
      WHERE (u.email = $1 OR u.phone = $1) AND o.otp = $2
    `,
      [identifier, otp]
    );

    if (!result) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > new Date(result.expires_at)) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Mark user as verified and delete OTP
    await query("UPDATE users SET email_verified = true WHERE id = $1", [
      result.id,
    ]);
    await query("DELETE FROM otps WHERE user_id = $1", [result.id]);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(result.id);

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        role: result.role,
        trusted: result.trusted,
        completedCount: result.completed_count,
        earnings: parseFloat(result.earnings),
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Email/phone and password required" });
    }

    // Find user
    const user = await getOne(
      "SELECT * FROM users WHERE email = $1 OR phone = $1",
      [identifier]
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30 days or 7 days
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        trusted: user.trusted,
        completedCount: user.completed_count,
        earnings: parseFloat(user.earnings),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

// GET /api/auth/me
router.get("/me", authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    trusted: req.user.trusted,
    completedCount: req.user.completed_count,
    earnings: parseFloat(req.user.earnings),
  });
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
