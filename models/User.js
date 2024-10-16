// models/User.js
const { v4: uuidv4 } = require("uuid"); // For generating unique user IDs
const { executeQuery } = require("../db/connect.js"); // Import the executeQuery function

class User {
  constructor(name, email, password, role = "user") {
    this.id = uuidv4(); // Generate a unique ID for the user
    this.name = name;
    this.email = email;
    this.password = password; // Password should be hashed before storing
    this.role = role;
    this.likedRecipes = []; // To store liked recipe IDs
    this.dislikedRecipes = []; // To store disliked recipe IDs
    this.recipesCreated = []; // To store created recipe IDs
  }

  // Method to save the user to the database
  async save() {
    const query = `
            INSERT INTO users (id, name, email, password, role, liked_recipes, disliked_recipes, recipes_created)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      this.id,
      this.name,
      this.email,
      this.password, // Ensure you hash the password before calling this method
      this.role,
      this.likedRecipes,
      this.dislikedRecipes,
      this.recipesCreated,
    ];

    try {
      await executeQuery(query, params);
      console.log("User saved successfully");
    } catch (error) {
      console.error("Error saving user:", error);
      throw error; // Optionally re-throw the error
    }
  }

  // Static method to find a user by email
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    try {
      const result = await executeQuery(query, [email]);
      if (result.rowLength === 0) return null; // User not found
      return result.rows[0]; // Return the found user
    } catch (error) {
      console.error("Error finding user:", error);
      throw error; // Optionally re-throw the error
    }
  }

  // Method to compare passwords (should be called after retrieving the user from DB)
  static async comparePassword(storedPassword, candidatePassword) {
    const bcrypt = require("bcryptjs");
    return await bcrypt.compare(candidatePassword, storedPassword);
  }
}

module.exports = User;
