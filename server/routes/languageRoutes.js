const express = require("express");
const { fetchPhases } = require("../controllers/phaseController");
const { fetchLessonsByPhase } = require("../controllers/lessonController");
const languageController = require("../controllers/languageController");

const router = express.Router();

// Route to get all available languages
router.get("/", languageController.getLanguages);

// Route to add a language pair
router.post("/", languageController.addLanguagePair);

router.get("/:languageId/phases", fetchPhases);

router.get("/:languageId/phases/:phaseId/lessons", fetchLessonsByPhase);

module.exports = router;
