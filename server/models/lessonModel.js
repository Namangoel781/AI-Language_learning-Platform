// const { supabase } = require("../supabase"); // Make sure your Supabase client is properly configured
const pool = require("../db");

/**
 * Fetch lessons based on the specified language.
 * @param {string} language - The language used for filtering lessons.
 * @returns {Promise<object[]>} - List of lessons or throws an error.
 */
const fetchLessonsByLanguage = async (language) => {
  const client = await pool.connect();
  try {
    console.log(`Fetching lessons for language: ${language}`);
    // Query Supabase to fetch lessons by language
    const query = `
      SELECT * 
      FROM lessons
      WHERE language = $1
    `;

    const { rows: lessons } = await client.query(query, [language]);

    console.log(`Fetched ${lessons.length} lessons for language: ${language}`);

    return lessons; // Return the fetched lessons
  } catch (err) {
    console.error(`Error in fetchLessonsByLanguage: ${err.message}`);
    throw new Error("Failed to fetch lessons by language");
  } finally {
    client.release();
  }
};

module.exports = { fetchLessonsByLanguage };
