// models/Category.js
const { v4: uuidv4 } = require("uuid"); // For generating unique category IDs
const { executeQuery } = require("../db/connect"); // Import the executeQuery function

class Category {
  constructor(strCategory, strCategoryThumb, strCategoryDescription) {
    this.id = uuidv4(); // Generate a unique ID for the category
    this.strCategory = strCategory;
    this.strCategoryThumb = strCategoryThumb;
    this.strCategoryDescription = strCategoryDescription;
  }

  // Method to save the category to the database
  async save() {
    const query = `
            INSERT INTO categories (id, str_category, str_category_thumb, str_category_description)
            VALUES (?, ?, ?, ?)`;

    const params = [
      this.id,
      this.strCategory,
      this.strCategoryThumb,
      this.strCategoryDescription,
    ];

    try {
      await executeQuery(query, params);
      console.log("Category saved successfully");
    } catch (error) {
      console.error("Error saving category:", error);
      throw error; // Optionally re-throw the error
    }
  }

  // Static method to find a category by ID
  static async findById(categoryId) {
    const query = "SELECT * FROM categories WHERE id = ?";
    try {
      const result = await executeQuery(query, [categoryId]);
      if (result.rowLength === 0) return null; // Category not found
      return result.rows[0]; // Return the found category
    } catch (error) {
      console.error("Error finding category:", error);
      throw error; // Optionally re-throw the error
    }
  }

  // Method to update the category
  async update(strCategory, strCategoryThumb, strCategoryDescription) {
    this.strCategory = strCategory;
    this.strCategoryThumb = strCategoryThumb;
    this.strCategoryDescription = strCategoryDescription;

    const query = `
            UPDATE categories 
            SET str_category = ?, str_category_thumb = ?, str_category_description = ?
            WHERE id = ?`;

    const params = [
      this.strCategory,
      this.strCategoryThumb,
      this.strCategoryDescription,
      this.id,
    ];

    try {
      await executeQuery(query, params);
      console.log("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      throw error; // Optionally re-throw the error
    }
  }
}

module.exports = Category;
