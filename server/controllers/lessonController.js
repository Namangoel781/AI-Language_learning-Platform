const { supabase } = require("../supabase");

const getLessons = async (req, res) => {
  const { learning_language } = req.user;

  if (!learning_language) {
    return res
      .status(400)
      .json({ error: "User learning language is not set." });
  }

  try {
    const { data: lessons, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("language", learning_language);

    if (error) {
      console.error("Error fetching lessons:", error);
      return res.status(500).json({ error: "Failed to fetch lessons" });
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
    // Query Supabase for a lesson by its ID
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id) // Use the id from the URL parameter
      .single(); // .single() ensures it returns a single object instead of an array

    if (error) {
      console.error("Error fetching lesson:", error);
      return res.status(404).json({ error: "Lesson not found" });
    }

    return res.json({ lesson });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getLessons, getLessonById };
