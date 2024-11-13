const googleAuthRedirect = (req, res) => {
  res.redirect("http://localhost:5173/");
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    // Set CORS headers for the logout response
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Frontend URL
    res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies)

    // Redirect after successful logout
    res.redirect("http://localhost:5173/login");
  });
};

module.exports = { googleAuthRedirect, logout };
