const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

const SEED_USERS = [
  {
    name: "Aunty Z",
    email: "aunty.z@example.com",
    phone: "08030000001",
    password: "password123",
    role: "poster",
    lga: "Lafia",
    neighbourhood: "New Market",
    trusted: true,
    completedCount: 5,
    earnings: 2400,
  },
  {
    name: "Jide",
    email: "jide@example.com",
    phone: "08030000002",
    password: "password123",
    role: "worker",
    lga: "Lafia",
    neighbourhood: "Tudun Gwandara",
    trusted: false,
    completedCount: 2,
    earnings: 800,
  },
  {
    name: "Ngozi",
    email: "ngozi@example.com",
    phone: "08030000003",
    password: "password123",
    role: "worker",
    lga: "Keffi",
    neighbourhood: "Angwan Lambu",
    trusted: true,
    completedCount: 8,
    earnings: 4200,
  },
  {
    name: "Sani",
    email: "sani@example.com",
    phone: "08040000004",
    password: "password123",
    role: "manager",
    lga: "Lafia",
    neighbourhood: "Shabu",
    trusted: true,
    completedCount: 15,
    earnings: 0, // Task Manager
  },
];

const SEED_TASKS = [
  {
    title: "Clean market stall",
    description:
      "Need help cleaning my vegetable stall after market hours. Should take about 2 hours.",
    pay: 800,
    location: "Lafia New Market",
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    mode: "single",
    proofRequired: true,
    category: "cleaning",
    status: "active",
  },
  {
    title: "Deliver documents to office",
    description:
      "Pick up documents from my house and deliver to office in town.",
    pay: 1200,
    location: "Lafia Town",
    dateTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    mode: "applications",
    proofRequired: true,
    category: "delivery",
    status: "active",
  },
  {
    title: "Help move furniture",
    description:
      "Need 2 people to help move furniture from old apartment to new one.",
    pay: 6000,
    location: "Lafia GRA",
    dateTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
    mode: "applications",
    proofRequired: false,
    category: "moving",
    status: "active",
  },
];

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log("🌱 Starting database seed...");

    // Clear existing data
    await client.query(
      "TRUNCATE TABLE audit_logs, notifications, resolutions, escrow, proofs, applications, tasks, otps, users RESTART IDENTITY CASCADE"
    );
    console.log("✅ Cleared existing data");

    // Insert users
    const userIds = [];
    for (const user of SEED_USERS) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const result = await client.query(
        `
        INSERT INTO users (
          name, email, phone, password_hash, role, lga, neighbourhood,
          trusted, completed_count, earnings, email_verified
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
        RETURNING id
      `,
        [
          user.name,
          user.email,
          user.phone,
          hashedPassword,
          user.role,
          user.lga,
          user.neighbourhood,
          user.trusted,
          user.completedCount,
          user.earnings,
        ]
      );

      userIds.push(result.rows[0].id);
      console.log(`✅ Created user: ${user.name} (${user.role})`);
    }

    // Insert tasks
    for (let i = 0; i < SEED_TASKS.length; i++) {
      const task = SEED_TASKS[i];
      const posterId = userIds[0]; // Aunty Z posts all tasks

      const result = await client.query(
        `
        INSERT INTO tasks (
          title, description, pay, location, date_time, mode, proof_required,
          category, status, poster_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `,
        [
          task.title,
          task.description,
          task.pay,
          task.location,
          task.dateTime,
          task.mode,
          task.proofRequired,
          task.category,
          task.status,
          posterId,
        ]
      );

      console.log(`✅ Created task: ${task.title}`);

      // Add sample application for the delivery task
      if (i === 1) {
        // Delivery task
        await client.query(
          `
          INSERT INTO applications (task_id, user_id, note, distance)
          VALUES ($1, $2, $3, $4)
        `,
          [
            result.rows[0].id,
            userIds[1], // Jide applies
            "I have a bike, can deliver quickly",
            2.5,
          ]
        );
        console.log("✅ Added sample application");
      }
    }

    // Add sample notifications
    await client.query(
      `
      INSERT INTO notifications (user_id, title, message, read)
      VALUES 
        ($1, 'Welcome to Micro-Task Market!', 'Start earning by completing tasks in your area.', false),
        ($2, 'New Task Available', 'A cleaning task has been posted near you.', false)
    `,
      [userIds[1], userIds[2]]
    );
    console.log("✅ Added sample notifications");

    console.log("🎉 Database seeded successfully!");
    console.log(
      `📊 Created ${SEED_USERS.length} users and ${SEED_TASKS.length} tasks`
    );
  } catch (error) {
    console.error("❌ Seed error:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
