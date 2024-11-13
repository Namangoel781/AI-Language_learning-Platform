const express = require("express");
const router = express.Router();
const {
  getLessons,
  getLessonById,
} = require("../controllers/lessonController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const validateLessonId = require("../middleware/validateLessonId");

router.get("/", isAuthenticated, getLessons);

router.get("/:id", validateLessonId, getLessonById);

module.exports = router;
