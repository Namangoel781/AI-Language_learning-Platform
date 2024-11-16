const client = require("../redis");

async function isAuthenticated(req, res, next) {
  const sessionToken = req.cookies?.session_token; // Get the session token from the cookies

  if (req.isAuthenticated() && sessionToken) {
    // Check if the user is authenticated and session token is available
    try {
      // console.log(
      //   `sessionToken: ${sessionToken} (type: ${typeof sessionToken})`
      // );

      // Fetch the userId associated with the session token from Redis
      const userId = await client.get(sessionToken); // Use sessionToken as key in Redis
      if (userId) {
        // console.log(`UserId found for sessionToken: ${sessionToken}`);
        // If the userId is found, attach it to req.user and proceed to next middleware
        req.user.id = userId; // Set the userId in req.user
        return next();
      } else {
        console.log(
          `Token not found in Redis for sessionToken: ${sessionToken}`
        );
      }
    } catch (error) {
      console.error("Error fetching token from Redis:", error); // Handle Redis errors
    }
  }

  // If no valid session token is found, respond with 401 Unauthorized
  res.status(401).json({ error: "User not authenticated" });
}

module.exports = { isAuthenticated };
