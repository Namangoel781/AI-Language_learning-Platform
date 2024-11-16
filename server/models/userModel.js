// const { supabase } = require("../supabase");
const pool = require("../db");

const User = {
  /**
   * Finds a user by email or creates a new user if not found.
   * @param {string} email - The user's email.
   * @param {string} name - The user's name.
   * @param {string} nativeLanguage - The user's native language (default: "").
   * @param {string} learningLanguage - The user's learning language (default: "").
   * @returns {Object} - Contains either the user data or an error.
   */
  findOrCreate: async (
    email,
    name,
    nativeLanguage = "",
    learningLanguage = ""
  ) => {
    const client = await pool.connect();
    try {
      console.log(`Searching for user with email: ${email}`);

      const query = `SELECT * users WHERE email = $1`;
      const { rows: existingUsers } = await client.query(query, [email]);

      // If an error occurs during the query, log and return it
      if (existingUsers.length > 0) {
        console.log("User found:", existingUsers[0]);
        return { data: existingUsers[0] };
      }

      console.log("User not found, creating a new user");

      // If user doesn't exist, create a new user
      const insertQuery = `
        INSERT INTO users (email, name, native_language, learning_language)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      const { rows: newUsers } = await client.query(insertQuery, [
        email,
        name,
        nativeLanguage,
        learningLanguage,
      ]);

      console.log("New user created:", newUsers[0]);
      return { data: newUsers[0] };
    } catch (err) {
      console.error("Error in findOrCreate:", err);
      return { error: err };
    } finally {
      client.release();
    }
  },

  /**
   * Updates a user's native and learning languages.
   * @param {number} userId - The user's ID.
   * @param {string} nativeLanguage - The user's native language.
   * @param {string} learningLanguage - The user's learning language.
   * @returns {Object} - Contains a success message or an error.
   */
  updateLanguages: async (userId, nativeLanguage, learningLanguage) => {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE users
        SET native_language = $1, learning_language = $2
        WHERE id = $3
        RETURNING *;
      `;
      const { rows } = await client.query(query, [
        nativeLanguage,
        learningLanguage,
        userId,
      ]);
      if (rows.length === 0) {
        return { error: "User not found or update failed" };
      }

      console.log("User languages updated:", rows[0]);
      return { message: "Languages updated successfully" };
    } catch (err) {
      console.error("Error in updateLanguages:", err);
      return { error: err.message || "Internal Server Error" };
    } finally {
      client.release();
    }
  },
};

module.exports = User;
