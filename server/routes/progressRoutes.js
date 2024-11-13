const express = require("express");
const { handleProgressUpdate } = require("../controllers/progressController");

const router = express.Router();

router.post("/", handleProgressUpdate);

module.exports = router;
