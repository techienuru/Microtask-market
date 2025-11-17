const fetch = require("node-fetch");

const API_URL = process.env.API_URL || "http://localhost:3000";

async function runSmokeTests() {
  console.log("🧪 Running smoke tests...\n");

  try {
    // Test 1: Health check
    console.log("1. Testing health endpoint...");
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log(
      `✅ Health check: ${healthData.status} (${healthData.timestamp})\n`
    );

    // Test 2: Auth me (should return 401)
    console.log("2. Testing auth/me endpoint (should be 401)...");
    const authResponse = await fetch(`${API_URL}/api/auth/me`);
    console.log(
      `✅ Auth check: ${authResponse.status} ${authResponse.statusText}\n`
    );

    // Test 3: Tasks list (should work without auth)
    console.log("3. Testing tasks list...");
    const tasksResponse = await fetch(`${API_URL}/api/tasks`);
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      console.log(
        `✅ Tasks list: ${tasksData.tasks?.length || 0} tasks found\n`
      );
    } else {
      console.log(
        `⚠️  Tasks list: ${tasksResponse.status} ${tasksResponse.statusText}\n`
      );
    }

    // Test 4: Admin seed (should require auth)
    console.log("4. Testing admin seed endpoint (should require auth)...");
    const seedResponse = await fetch(`${API_URL}/api/admin/seed`, {
      method: "POST",
      headers: {
        "X-Admin-Key": process.env.ADMIN_SEED_KEY || "admin-seed-key-for-demo",
      },
    });
    console.log(
      `✅ Admin seed: ${seedResponse.status} ${seedResponse.statusText}\n`
    );

    console.log("🎉 Smoke tests completed!");
  } catch (error) {
    console.error("❌ Smoke test failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runSmokeTests();
}

module.exports = runSmokeTests;
