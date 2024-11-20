const pool = require("../db"); // Ensure the pool is correctly imported from your DB setup

/**
 * Fetch all courses from the database.
 * @returns {Promise<object[]>} - List of courses or throws an error.
 */
const fetchAllCourses = async () => {
  const client = await pool.connect(); // Establish a connection
  try {
    console.log("[INFO] Connecting to the database...");
    console.log("[DEBUG] Query to execute: SELECT * FROM courses");
    // Query to fetch all courses
    const query = `
      SELECT * 
      FROM courses
    `;

    const { rows: courses } = await client.query(query); // Execute the query

    console.log(`Fetched ${courses.length} courses from the database.`);

    return courses; // Return the fetched courses
  } catch (err) {
    console.error(`Error in fetchAllCourses: ${err.message}`);
    throw new Error("Failed to fetch courses from the database");
  } finally {
    client.release(); // Release the connection
  }
};

module.exports = { fetchAllCourses };
