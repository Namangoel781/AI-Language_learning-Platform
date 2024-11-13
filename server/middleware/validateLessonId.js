const { validate: isUUID } = require("uuid");

const validateLessonId = (req, res, next) => {
  const { id } = req.params;
  if (!isUUID(id)) {
    return res.status(400).json({ error: "Invalid lesson ID format" });
  }
  next();
};

module.exports = validateLessonId;
