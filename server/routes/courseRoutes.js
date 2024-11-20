const express = require("express");
const { getAllCourses } = require("../controllers/coursesController");

const router = express.Router();

router.get("/", getAllCourses);

module.exports = router;
