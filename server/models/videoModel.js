const { Pool } = require("pg");
const pool = require("../db");

/**
 * Fetch all videos for a given course ID.
 * @param {number} courseid - The ID of the course to fetch videos for.
 * @returns {Promise<object[]>} - List of videos or throws an error.
 */
const fetchAllVideosForCourseId = async (courseid) => {
  const client = await pool.connect(); // Establish a connection
  try {
    console.log(`[INFO] Fetching videos for course ID: ${courseid}`);
    const query = `
        SELECT * 
        FROM videos
        WHERE courseid = $1
      `;
    console.log("[DEBUG] Executing query:", query);

    const { rows: videos } = await client.query(query, [courseid]);
    console.log(`[DEBUG] Query result: ${JSON.stringify(videos)}`);

    return videos; // Return the fetched videos
  } catch (err) {
    console.error(`[ERROR] Error in fetchAllVideosForCourseId: ${err.message}`);
    throw new Error("Failed to fetch videos for the given course ID");
  } finally {
    client.release(); // Release the connection
  }
};

module.exports = { fetchAllVideosForCourseId };
