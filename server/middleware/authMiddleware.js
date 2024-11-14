const client = require("../redis");

async function isAuthenticated(req, res, next) {
  const userId = req.user?.id;

  if (req.isAuthenticated() && userId) {
    try {
      const userIdString = userId.toString();
      console.log(`userId: ${userIdString} (type: ${typeof userIdString})`);
      const token = await client.get(userIdString); // Ensure the userId is a string
      if (token) {
        console.log(`Token found for userId: ${userIdString}`);
        return next();
      } else {
        console.log(`Token not found for userId: ${userIdString}`);
      }
    } catch (error) {
      console.error("Error fetching token from Redis:", error);
    }
  }

  res.status(401).json({ error: "User not authenticated" }); // If not authenticated or userId is missing
}

module.exports = { isAuthenticated };
