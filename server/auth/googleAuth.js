const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { supabase } = require("../supabase");
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
          const needsLanguageSetup =
            !user.native_language || !user.learning_language;
          console.log(
            "Existing user:",
            user,
            "Needs language setup:",
            needsLanguageSetup
          );
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

          console.log("New user created and retrieved:", newUser);
          return done(null, { ...newUser, needsLanguageSetup: true });
        }
      } catch (err) {
        console.error("Unexpected error during Google authentication:", err);
        return done(err);
      }
    }
  )
);

// Serialize the user by storing their ID in the session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, { id: user.id, needsLanguageSetup: user.needsLanguageSetup });
});

// Deserialize the user by retrieving their data from the database using their ID
passport.deserializeUser(async (userObj, done) => {
  // if (!userObj) {
  //   return done(new Error("Invalid user ID during deserialization"));
  // }

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
    console.log("Deserialized user:", user);
    done(null, user);
  } catch (err) {
    console.error("Unexpected error during deserialization:", err);
    done(err);
  }
});

module.exports = passport;
