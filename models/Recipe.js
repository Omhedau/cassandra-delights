// models/Recipe.js
const { v4: uuidv4 } = require("uuid"); // For generating unique recipe IDs
const { executeQuery } = require("../db/connect"); // Import the executeQuery function

class Recipe {
  constructor(
    strMeal,
    categoryId,
    strArea,
    strInstructions,
    strMealThumb,
    strTags = [],
    ingredients = [],
    strYoutube = null,
    strSource = null,
    strImageSource = null,
    createdBy
  ) {
    this.id = uuidv4(); // Generate a unique ID for the recipe
    this.strMeal = strMeal;
    this.categoryId = categoryId; // Store category as a string or ID
    this.strArea = strArea;
    this.strInstructions = strInstructions;
    this.strMealThumb = strMealThumb;
    this.strTags = strTags; // Store tags as an array
    this.strYoutube = strYoutube;
    this.ingredients = ingredients; // Store ingredients as an array
    this.strSource = strSource;
    this.strImageSource = strImageSource;
    this.createdBy = createdBy; // Store creator's user ID
    this.createdAt = new Date(); // Default to now
    this.likes = []; // To store liked user IDs
    this.dislikes = []; // To store disliked user IDs
    this.comments = []; // To store comment IDs
  }

  // Method to save the recipe to the database
  async save() {
    const query = `
            INSERT INTO recipes (id, str_meal, category_id, str_area, str_instructions, str_meal_thumb, str_tags, ingredients, str_youtube, str_source, str_image_source, created_by, created_at, likes, dislikes, comments)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      this.id,
      this.strMeal,
      this.categoryId,
      this.strArea,
      this.strInstructions,
      this.strMealThumb,
      this.strTags,
      this.ingredients,
      this.strYoutube,
      this.strSource,
      this.strImageSource,
      this.createdBy,
      this.createdAt,
      this.likes,
      this.dislikes,
      this.comments,
    ];

    try {
      await executeQuery(query, params);
      console.log("Recipe saved successfully");
    } catch (error) {
      console.error("Error saving recipe:", error);
      throw error; // Optionally re-throw the error
    }
  }

  // Static method to find a recipe by ID
  static async findById(recipeId) {
    const query = "SELECT * FROM recipes WHERE id = ?";
    try {
      const result = await executeQuery(query, [recipeId]);
      if (result.rowLength === 0) return null; // Recipe not found
      return result.rows[0]; // Return the found recipe
    } catch (error) {
      console.error("Error finding recipe:", error);
      throw error; // Optionally re-throw the error
    }
  }

  // Additional methods can be added for liking, disliking, etc.
}

module.exports = Recipe;
