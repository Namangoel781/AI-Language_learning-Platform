const { fetchAllVideosForCourseId } = require("../models/videoModel");

const getVidoes = async (req, res) => {
  const { courseid } = req.params; // Extract courseid from the route parameters
  console.log("[DEBUG] Request received for course ID:", courseid);

  if (!courseid) {
    console.error("[ERROR] No course ID provided.");
    return res.status(400).json({
      success: false,
      message: "Invalid or missing course ID",
    });
  }

  try {
    const videos = await fetchAllVideosForCourseId(courseid);
    console.log("[DEBUG] Videos fetched:", videos);

    res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      data: videos,
    });
  } catch (error) {
    console.error("[ERROR] Error fetching videos for course:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos for the course",
      error: error.message,
    });
  }
};

module.exports = { getVidoes };
