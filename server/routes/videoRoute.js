const express = require("express");
const router = express.Router();
const { getVidoes } = require("../controllers/videosController");

const validateCourseId = (req, res, next) => {
  const { courseid } = req.params;
  if (!courseid || isNaN(courseid)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing course ID",
    });
  }
  next();
};

router.get("/:courseid", validateCourseId, getVidoes);

module.exports = router;
