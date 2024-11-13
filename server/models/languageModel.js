// models/languageModel.js
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Fetch all languages
const fetchLanguages = async () => {
  const { data, error } = await supabase.from("Languages").select(); // Fetch all languages from the Languages table

  if (error) {
    throw new Error(error.message);
  }

  return data; // Return fetched languages
};

const getPhases = async (languageId) => {
  const { data, error } = await supabase
    .from("phases")
    .select("*")
    .eq("language_id", languageId);

  if (error) throw new Error(error.message);
  return data;
};

module.exports = {
  fetchLanguages,
  getPhases,
};
