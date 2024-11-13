const { updateUserProgress } = require("../models/progressModel");

const handleProgressUpdate = async (req, res) => {
  try {
    const { userId, phaseId, lessonId } = req.body;
    console.log("Request body:", req.body);
    await updateUserProgress(userId, phaseId, lessonId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error in handleProgressUpdate:", error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
};

module.exports = {
  handleProgressUpdate,
};
