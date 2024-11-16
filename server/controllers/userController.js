const User = require("../models/userModel");

const updateUserLanguages = async (req, res) => {
  try {
    const { native_language, learning_language } = req.body;
    const userId = req.user?.id;

    // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Validate input
    if (!native_language || !learning_language) {
      return res.status(400).json({
        error: "Both native_language and learning_language are required.",
      });
    }

    // Call the model method to update the user's languages
    const { error, message } = await User.updateLanguages(
      userId,
      native_language,
      learning_language
    );

    if (error) {
      console.error("Error updating languages:", error);
      return res.status(500).json({ error: "Error updating languages." });
    }

    // Successfully updated
    return res.status(200).json({ message });
  } catch (err) {
    console.error("Unexpected error updating languages:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { updateUserLanguages };
