const { getPhases } = require("../models/languageModel");

const fetchPhases = async (req, res) => {
  try {
    const { languageId } = req.params;
    const phases = await getPhases(languageId);
    res.json(phases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPhasesByLanguageId = async (req, res) => {
  const { languageId } = req.params;

  try {
    const phases = await getPhases(languageId); // Call getPhases directly

    if (phases.length === 0) {
      return res
        .status(404)
        .json({ message: "No phases found for this language." });
    }
    res.status(200).json(phases);
  } catch (error) {
    console.error("Error fetching phases:", error);
    res.status(500).json({ message: "Error fetching phases." });
  }
};

module.exports = { fetchPhases, getPhasesByLanguageId };
