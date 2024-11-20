const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const passport = require("./auth/googleAuth");
const { isAuthenticated } = require("./middleware/authMiddleware");
require("dotenv").config();
const { Pool } = require("pg");
const RedisStore = require("connect-redis").default;
const redisClient = require("./redis");

const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const videoRoutes = require("./routes/videoRoute");

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT || 5432, // Default PostgreSQL port
  database: process.env.DATABASE_NAME, // Default database name (set in .env)
});

//middlewares

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
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
app.use("/api/courses", courseRoutes);
app.use("/api/videos", videoRoutes);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    try {
      console.log("User authenticated successfully.");
      return res.redirect(CLIENT_URL);
    } catch (error) {
      console.error("Error in authentication callback:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

app.get("/api/check-auth", isAuthenticated, (req, res) => {
  res.json({
    isAuthenticated: true,
    user: req.user,
  });
});

app.get("/refresh-session", async (req, res) => {
  try {
    const sessionToken = req.cookies?.session_token;
    if (req.isAuthenticated() && sessionToken) {
      const userId = await redisClient.get(sessionToken);
      if (userId) {
        req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // Reset cookie expiration
        return res.json({ message: "Session refreshed" });
      }
    }
    return res
      .status(401)
      .json({ error: "User not authenticated or session invalid" });
  } catch (err) {
    console.error("Error refreshing session:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }
  res
    .status(err.status || 500)
    .json({ error: err.message || "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
