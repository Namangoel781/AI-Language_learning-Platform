const { supabase } = require("../supabase");

const User = {
  findOrCreate: async (
    email,
    name,
    nativeLanguage = "",
    learningLanguage = ""
  ) => {
    try {
      console.log(`Searching for user with email: ${email}`);

      // Use maybeSingle() to avoid the error when no rows are found
      const { data: existingUser, error: findError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle(); // This allows for no results without error

      // If an error occurs during the query, log and return it
      if (findError) {
        console.error("Error while checking for existing user:", error);
        return { error: findError };
      }

      // If user doesn't exist, create a new user
      if (!existingUser) {
        console.log("User not found, creating a new user");

        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              email,
              name,
              native_language: nativeLanguage,
              learning_language: learningLanguage,
            },
          ])
          .single(); // Ensure we get a single inserted row back

        if (insertError) {
          console.error("Error inserting new user:", insertError);
          return { error: insertError };
        }

        console.log("New user created:", newUser);
        return { data: newUser }; // Return newly created user data
      }

      console.log("User found:", existingUser);
      return { data: existingUser }; // Return existing user data if found
    } catch (err) {
      console.error("Unexpected error in findOrCreate:", err);
      return { error: err }; // Return unexpected errors
    }
  },
  updateLanguages: async (userId, nativeLanguage, learningLanguage) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          native_language: nativeLanguage,
          learning_language: learningLanguage,
        })
        .eq("id", userId);
      return error ? { error } : { message: "Language updated successfully" };
    } catch (error) {
      console.error("Unexpected error in updateLanguages:", error);
      return { error: err };
    }
  },
};

module.exports = User;
