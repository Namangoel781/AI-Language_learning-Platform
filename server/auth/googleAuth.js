const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { supabase } = require("../supabase");
const client = require("../redis");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json;
      // const userId = profile.id;

      try {
        // Attempt to retrieve the user by email
        const { data: user, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error retrieving user:", fetchError);
          return done(fetchError);
        }

        if (user) {
          console.log(
            `Setting token for userId: ${user.id.toString()} with token: ${accessToken}`
          );
          await client.set(user.id.toString(), accessToken, {
            EX: 60 * 60 * 24,
          });

          const needsLanguageSetup =
            !user.native_language || !user.learning_language;
          return done(null, { ...user, needsLanguageSetup });
        } else {
          const { error: upsertError } = await supabase.from("users").upsert(
            [
              {
                email,
                name,
                native_language: null,
                learning_language: null,
              },
            ],
            { onConflict: ["email"] }
          );
          if (upsertError) {
            console.error("Error creating new user:", upsertError);
            return done(new Error("User creation failed"));
          }

          const { data: newUser, error: fetchNewUserError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

          if (fetchNewUserError || !newUser) {
            console.error(
              "Error fetching new user after upsert:",
              fetchNewUserError
            );
            return done(new Error("User creation and retrieval failed"));
          }
          console.log(
            `Setting token for new userId: ${newUser.id.toString()} with token: ${accessToken}`
          );

          await client.set(newUser.id, String(accessToken), {
            EX: 60 * 60 * 24,
          });
          return done(null, { ...newUser, needsLanguageSetup: true });
        }
      } catch (err) {
        console.error("Unexpected error during Google authentication:", err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, { id: user.id, needsLanguageSetup: user.needsLanguageSetup });
});

passport.deserializeUser(async (userObj, done) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userObj.id)
      .single();

    if (error) {
      console.error("Error during deserialization:", error);
      return done(error);
    }
    // Ensure needsLanguageSetup is passed after deserialization
    user.needsLanguageSetup = !user.native_language || !user.learning_language;
    done(null, user);
  } catch (err) {
    console.error("Unexpected error during deserialization:", err);
    done(err);
  }
});

module.exports = passport;
