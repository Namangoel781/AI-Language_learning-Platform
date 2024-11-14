const client = require("../redis");

const googleAuthRedirect = (req, res) => {
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

  if (req.user?.needsLanguageSetup) {
    return res.redirect(`${CLIENT_URL}/select-language`);
  }

  return res.redirect(CLIENT_URL);
};

const logout = (req, res, next) => {
  const userId = req.user?.id;

  req.logout(async (err) => {
    if (err) {
      return next(err);
    }

    if (userId) {
      await client.del(userId);
    }

    // Set CORS headers for the logout response
    res.setHeader("Access-Control-Allow-Origin", CLIENT_URL); // Frontend URL
    res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies)
    res.redirect("http://localhost:5173/login");
  });
};

module.exports = { googleAuthRedirect, logout };
