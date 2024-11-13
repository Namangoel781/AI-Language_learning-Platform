const User = require("../models/userModel");

const updateUserLanguages = async (req, res) => {
  const { native_language, learning_language } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const { error, message } = await User.updateLanguages(
    userId,
    native_language,
    learning_language
  );

  if (error) {
    console.error("Error updating languages:", error);
    return res.status(500).json({ error: "Error updating languages" });
  }

  res.status(200).json({ message });
};

module.exports = { updateUserLanguages };
