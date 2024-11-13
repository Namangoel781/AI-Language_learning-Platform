const { fetchLanguages } = require("../models/languageModel");
const { addPair } = require("../models/languagePairModel");

// Controller to get all languages
const getLanguages = async (req, res) => {
  try {
    const languages = await fetchLanguages();

    if (!Array.isArray(languages)) {
      return res
        .status(500)
        .json({ error: "Data is not in the correct format." });
    }
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to add a language pair
const addLanguagePair = async (req, res) => {
  const { nativeLanguageId, learningLanguageId } = req.body;

  if (!nativeLanguageId || !learningLanguageId) {
    return res
      .status(400)
      .json({ error: "Both native and learning language IDs are required." });
  }

  try {
    const languagePair = await addPair(nativeLanguageId, learningLanguageId);
    res.status(201).json(languagePair);
  } catch (error) {
    console.error("Error adding language pair:", error);
    res.status(500).json({ error: "Failed to add language pair." });
  }
};

module.exports = {
  getLanguages,
  addLanguagePair,
};
