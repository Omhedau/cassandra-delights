// models/Area.js
const { v4: uuidv4 } = require("uuid"); // For generating unique area IDs
const { executeQuery } = require("../db/connect"); // Import the executeQuery function

class Area {
  constructor(areaName, imageUrl) {
    this.id = uuidv4(); // Generate a unique ID for the area
    this.areaName = areaName;
    this.imageUrl = imageUrl;
  }

  // Method to save the area to the database
  async save() {
    const query = `
            INSERT INTO areas (id, area_name, image_url)
            VALUES (?, ?, ?)`;

    const params = [this.id, this.areaName, this.imageUrl];

    try {
      await executeQuery(query, params);
      console.log("Area saved successfully");
    } catch (error) {
      console.error("Error saving area:", error);
      throw error; // Optionally re-throw the error
    }
  }

  // Static method to find an area by ID
  static async findById(areaId) {
    const query = "SELECT * FROM areas WHERE id = ?";
    try {
      const result = await executeQuery(query, [areaId]);
      if (result.rowLength === 0) return null; // Area not found
      return result.rows[0]; // Return the found area
    } catch (error) {
      console.error("Error finding area:", error);
      throw error; // Optionally re-throw the error
    }
  }

  // Method to update the area
  async update(areaName, imageUrl) {
    this.areaName = areaName;
    this.imageUrl = imageUrl;

    const query = `
            UPDATE areas 
            SET area_name = ?, image_url = ?
            WHERE id = ?`;

    const params = [this.areaName, this.imageUrl, this.id];

    try {
      await executeQuery(query, params);
      console.log("Area updated successfully");
    } catch (error) {
      console.error("Error updating area:", error);
      throw error; // Optionally re-throw the error
    }
  }
}

module.exports = Area;
