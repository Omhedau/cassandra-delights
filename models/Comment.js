// models/Comment.js
const { v4: uuidv4 } = require("uuid"); // For generating unique comment IDs
const { executeQuery } = require("../db/connect"); // Import the executeQuery function

class Comment {
  constructor(content, userId, recipeId) {
    this.id = uuidv4(); // Generate a unique ID for the comment
    this.content = content;
    this.userId = userId; // Store user ID directly
    this.recipeId = recipeId; // Store recipe ID directly
    this.createdAt = new Date(); // Default to now
    this.updatedAt = null; // Default to null, update later if needed
  }

  // Method to save the comment to the database
  async save() {
    const query = `
            INSERT INTO comments (id, content, user_id, recipe_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`;

    const params = [
      this.id,
      this.content,
      this.userId,
      this.recipeId,
      this.createdAt,
      this.updatedAt,
    ];

    try {
      await executeQuery(query, params);
      console.log("Comment saved successfully");
    } catch (error) {
      console.error("Error saving comment:", error);
      throw error; // Optionally re-throw the error
    }
  }

  // Static method to find a comment by ID
  static async findById(commentId) {
    const query = "SELECT * FROM comments WHERE id = ?";
    try {
      const result = await executeQuery(query, [commentId]);
      if (result.rowLength === 0) return null; // Comment not found
      return result.rows[0]; // Return the found comment
    } catch (error) {
      console.error("Error finding comment:", error);
      throw error; // Optionally re-throw the error
    }
  }

  // Method to update the comment
  async update(content) {
    this.content = content;
    this.updatedAt = new Date(); // Update the timestamp

    const query = `
            UPDATE comments 
            SET content = ?, updated_at = ?
            WHERE id = ?`;

    const params = [this.content, this.updatedAt, this.id];

    try {
      await executeQuery(query, params);
      console.log("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error; // Optionally re-throw the error
    }
  }
}

module.exports = Comment;
