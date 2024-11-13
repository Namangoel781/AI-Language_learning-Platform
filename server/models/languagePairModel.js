// models/languagePairModel.js
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Add a new language pair (native and learning)
const addPair = async (nativeLanguageId, learningLanguageId) => {
  try {
    console.log("Inserting language pair:", {
      nativeLanguageId,
      learningLanguageId,
    });

    const { data, error } = await supabase
      .from("LanguagePairs")
      .insert([
        {
          native_language_id: nativeLanguageId,
          learning_language_id: learningLanguageId,
        },
      ])
      .select();

    // Detailed logging for success/failure cases
    if (error) {
      console.error("Error inserting language pair into Supabase:", error);
      throw new Error(`Insertion failed: ${error.message}`);
    }

    console.log("Language pair added successfully:", data);
    return data;
  } catch (err) {
    console.error("Error occurred in addLanguagePair:", err);
    throw err;
  }
};

// Fetch language pairs (optional)
async function getLanguagePairs() {
  const { data, error } = await supabase.from("LanguagePairs").select();
  if (error) throw new Error(error.message);
  return data;
}

module.exports = {
  addPair,
  getLanguagePairs,
};
