const express = require("express");
const router = express.Router();
const { updateUserLanguages } = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.post("/set-languages", isAuthenticated, updateUserLanguages);

module.exports = router;
