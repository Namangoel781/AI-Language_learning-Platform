const express = require("express");
const passport = require("./auth/googleAuth");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const { isAuthenticated } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoutes");
const lessonRoutes = require("./routes/lessonsRoutes");

const supabase = require("./supabase");
const helmet = require("helmet");

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(helmet());
app.use(express.json());

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? CLIENT_URL
      : "http://localhost:5173",

  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));
}

// API Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lessons", lessonRoutes);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    if (!req.user) {
      console.error("User object is missing in req.user");
      return res.redirect(`${CLIENT_URL}/login`);
    }

    console.log("Authenticated user:", req.user);

    if (req.user.needsLanguageSetup) {
      console.log("Redirecting to /select-language");
      return res.redirect(`${CLIENT_URL}/select-language`);
    }
    console.log("Redirecting to Home Page");
    return res.redirect(CLIENT_URL);
  }
);

app.get("/api/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      isAuthenticated: true,
      user: req.user, // Make sure the user object includes the needsLanguageSetup flag
    });
  }

  return res.json({
    isAuthenticated: false,
    user: null,
  });
});

app.get("/refresh-session", (req, res) => {
  if (req.isAuthenticated()) {
    req.session.cookie.maxAge = 1000 * 60 * 60;
    return res.json({ message: "Session refreshed" });
  }
  res.status(401).json({ error: "Not Authenticated" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
