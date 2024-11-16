const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables from .env file

// Create a reusable pool for the application
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT || 5432, // Default PostgreSQL port
  database: process.env.DATABASE_NAME, // Default database name (set in .env)
});

(async () => {
  try {
    // Step 1: Check if the main database exists
    const tempPool = new Pool({
      user: process.env.DATABASE_USER,
      host: process.env.DATABASE_HOST,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT || 5432,
    });

    const dbCheck = await tempPool.query(
      `
      SELECT 1 FROM pg_database WHERE datname = $1;
    `,
      ["AI-Language-Platform"]
    );

    if (dbCheck.rowCount === 0) {
      await tempPool.query(`CREATE DATABASE "AI-Language-Platform";`);
      console.log("Database 'AI-Language-Platform' created successfully!");
    } else {
      console.log("Database 'AI-Language-Platform' already exists.");
    }

    // Close the temporary connection pool
    await tempPool.end();

    // Step 2: Create required tables in the target database
    const dbPool = new Pool({
      user: process.env.DATABASE_USER,
      host: process.env.DATABASE_HOST,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT || 5432,
      database: "AI-Language-Platform", // Connect to the target database
    });

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        native_language VARCHAR(255),
        learning_language VARCHAR(255),
        needs_language_setup BOOLEAN DEFAULT TRUE
      );
    `);
    console.log("Table 'users' created successfully!");

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        video_url TEXT,
        language VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table 'lessons' created successfully!");

    // Close the database-specific connection pool
    await dbPool.end();
  } catch (err) {
    console.error(
      "Error occurred during database initialization:",
      err.message
    );
  }
})();

// Export the main pool for application use
module.exports = pool;
