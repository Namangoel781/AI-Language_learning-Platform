const express = require("express");
const router = express.Router();

const { getPhasesByLanguageId } = require("../controllers/phaseController");

router.get("/:languageId", getPhasesByLanguageId);

module.exports = router;
