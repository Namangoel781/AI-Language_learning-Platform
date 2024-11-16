const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const client = require("../redis");
const { v4: uuidv4 } = require("uuid"); // For generating UUID tokens
require("dotenv").config();
const { Pool } = require("pg");
// const { supabase } = require("../supabase");

const pool = new Pool({
  user: process.env.DATABASE_USER, // Replace with your PostgreSQL username
  host: process.env.DATABASE_HOST,
  database: "AI-Language-Platform",
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json;

      try {
        // Check if user exists in the database
        const userQuery = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        let currentUser = userQuery.rows[0];

        if (!currentUser) {
          const insertQuery = `
            INSERT INTO users (email, name, native_language, learning_language, needs_language_setup)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
          `;
          const insertValues = [email, name, null, null, true];
          const insertResult = await pool.query(insertQuery, insertValues);

          currentUser = insertResult.rows[0];
        }

        const { id, needs_language_setup } = currentUser;

        // Generate session token and store in Redis
        const sessionToken = uuidv4();
        try {
          await client.set(sessionToken, currentUser.id, { EX: 60 * 60 * 24 }); // 24-hour expiry
          // console.log("Session token stored in Redis:", sessionToken);
        } catch (redisError) {
          console.error("Error storing session token in Redis:", redisError);
          return done(redisError);
        }
        return done(null, {
          ...currentUser,
          sessionToken,
          needsLanguageSetup: needs_language_setup,
        });
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // console.log("Serializing User:", user);
  done(null, { id: user.id, sessionToken: user.sessionToken });
});

passport.deserializeUser(async ({ id, sessionToken }, done) => {
  try {
    const userId = await client.get(sessionToken);
    if (!userId) {
      console.error(
        "No user ID found in Redis for session token:",
        sessionToken
      );
      return done(null, false);
    }

    const userQuery = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    const user = userQuery.rows[0];

    if (!user) {
      console.error("User not found in database for ID:", userId);
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    console.error("Error in deserializeUser:", err.message);
    done(err);
  }
});

module.exports = passport;
