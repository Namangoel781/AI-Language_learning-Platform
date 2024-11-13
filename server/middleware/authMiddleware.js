function isAuthenticated(req, res, next) {
  console.log("Is Authenticated:", req.isAuthenticated());
  console.log("User:", req.user);
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "User not authenticated" });
}

module.exports = { isAuthenticated };
