const client = require("../redis");

const googleAuthRedirect = (req, res) => {
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

  // Send session token as an HTTP-only cookie
  try {
    res.cookie("session_token", req.user.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    const redirectUrl = req.user.needsLanguageSetup
      ? `${CLIENT_URL}/select-language`
      : CLIENT_URL;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error during Google Auth redirect:", error);
    return res.status(500).send("An error occurred during authentication.");
  }
};

const logout = (req, res, next) => {
  try {
    const sessionToken = req.cookies.session_token; // Retrieve session token from cookies

    req.logout(async (err) => {
      if (err) {
        console.error("Error during req.logout:", err);
        return next(err);
      }

      if (sessionToken) {
        await client.del(sessionToken); // Delete session token from Redis
      }

      res.clearCookie("session_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      return res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).send("An error occurred during logout.");
  }
};

module.exports = { logout, googleAuthRedirect };
