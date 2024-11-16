// const { supabase } = require("../supabase");
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DATABASE_USER, // Replace with your PostgreSQL username
  host: process.env.DATABASE_HOST,
  database: "AI-Language-Platform",
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

const getLessons = async (req, res) => {
  const { learning_language } = req.user;

  if (!learning_language) {
    return res
      .status(400)
      .json({ error: "User learning language is not set." });
  }

  try {
    const query = "SELECT * FROM lessons WHERE language = $1";
    const { rows: lessons } = await pool.query(query, [learning_language]);

    if (lessons.length === 0) {
      return res
        .status(404)
        .json({ error: "No lessons found for the specified language" });
    }

    res.json({ lessons });
  } catch (err) {
    console.error("Unexpected error fetching lessons:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLessonById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM lessons WHERE id = $1";
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const lesson = rows[0]; // Extract the single lesson from the rows array
    res.json({ lesson });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getLessons, getLessonById };
