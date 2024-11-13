// services/lessonService.js
const { supabase } = require("../supabase"); // Make sure your Supabase client is properly configured

/**
 * Fetch lessons based on the specified language.
 * @param {string} language - The language used for filtering lessons.
 * @returns {Promise<object[]>} - List of lessons or throws an error.
 */
const fetchLessonsByLanguage = async (language) => {
  try {
    // Query Supabase to fetch lessons by language
    const { data: lessons, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("language", language); // Filter lessons by the 'language' column

    // If an error occurred during the query
    if (error) {
      throw new Error(error.message); // Throw the error for further handling
    }

    return lessons; // Return the fetched lessons
  } catch (err) {
    console.error(`Error in fetchLessonsByLanguage: ${err.message}`);
    throw new Error("Failed to fetch lessons by language");
  }
};

module.exports = { fetchLessonsByLanguage };
