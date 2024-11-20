const { fetchAllCourses } = require("../models/courseModel");

const getAllCourses = async (req, res) => {
  try {
    console.log("[INFO] API request received to fetch all courses.");

    const courses = await fetchAllCourses();
    if (courses.length === 0) {
      console.log("No courses found in the database.");
      return res.status(404).json({
        success: false,
        message: "No courses found.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

module.exports = { getAllCourses };
