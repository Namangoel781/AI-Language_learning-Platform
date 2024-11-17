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
const lessonRoutes = require("./routes/lessonsRoutes");

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
app.use("/api/lessons", lessonRoutes);

// app.post("/api/complete-language-setup", async (req, res) => {
//   const { userId, nativeLanguage, learningLanguage } = req.body;

//   // Check if required fields are provided
//   if (!userId || !nativeLanguage || !learningLanguage) {
//     console.error("Missing required fields:", {
//       userId,
//       nativeLanguage,
//       learningLanguage,
//     });
//     return res.status(400).json({
//       error: "User ID, native language, and learning language are required.",
//     });
//   }

//   try {
//     // Query the database to find user by userId
//     const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
//       userId,
//     ]);

//     // Check if user exists
//     if (userResult.rows.length === 0) {
//       console.error("User not found:", { userId });
//       return res.status(404).json({ error: "User not found." });
//     }

//     const user = userResult.rows[0]; // Get the first user from the result
//     console.log("User found:", user);

//     // Check if both nativeLanguage and learningLanguage are provided
//     if (nativeLanguage && learningLanguage) {
//       // Log the language values before the update to verify
//       console.log("Updating user languages:", {
//         nativeLanguage,
//         learningLanguage,
//       });

//       // Update the user’s languages and set needs_language_setup to false
//       const updateResult = await pool.query(
//         "UPDATE users SET native_language = $1, learning_language = $2, needs_language_setup = $3 WHERE id = $4 RETURNING *",
//         [nativeLanguage, learningLanguage, false, userId]
//       );

//       // Log the update query result to verify success
//       console.log("Update result:", updateResult.rows);

//       // Check if the update was successful
//       if (updateResult.rows.length === 0) {
//         console.error("Failed to update user:", { userId });
//         return res
//           .status(500)
//           .json({ error: "Failed to update user in the database." });
//       }

//       // Successfully updated
//       console.log("User language setup completed:", updateResult.rows[0]);

//       // Respond with success message and updated user data
//       return res.status(200).json({
//         message: "Language setup completed successfully.",
//         user: updateResult.rows[0], // Updated user
//       });
//     } else {
//       // If either nativeLanguage or learningLanguage is missing, don't change needs_language_setup
//       console.error("Invalid language data:", {
//         nativeLanguage,
//         learningLanguage,
//       });
//       return res.status(400).json({
//         error: "Both native language and learning language must be provided.",
//       });
//     }
//   } catch (error) {
//     console.error("Error while completing language setup:", error);
//     return res
//       .status(500)
//       .json({ error: "An error occurred while completing language setup." });
//   }
// });

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
