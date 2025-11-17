const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

/**
 * Execute a parameterized query
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === "development") {
      console.log("📊 Query executed:", {
        text,
        duration: `${duration}ms`,
        rows: result.rowCount,
      });
    }

    return result;
  } catch (error) {
    console.error("❌ Database query error:", error);
    throw error;
  }
};

/**
 * Get a single row by query
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object|null>} Single row or null
 */
const getOne = async (text, params = []) => {
  const result = await query(text, params);
  return result.rows[0] || null;
};

/**
 * Get multiple rows by query
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Array of rows
 */
const getMany = async (text, params = []) => {
  const result = await query(text, params);
  return result.rows;
};

/**
 * Execute transaction
 * @param {Function} callback - Transaction callback
 * @returns {Promise<any>} Transaction result
 */
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  query,
  getOne,
  getMany,
  transaction,
  pool,
};
