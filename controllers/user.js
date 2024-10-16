const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const cassandraClient = require("../db/connect"); // Assuming your Cassandra connection file is in a folder named db

// Adjust user functions to use Cassandra queries

const getUser = async (req, res) => {
  try {
    const { id } = req.user; // Get the user id from the request

    // Query to get user from Cassandra
    const query = "SELECT * FROM users WHERE id = ?"; // Adjust your table name and fields accordingly
    const params = [id];

    // If id is not a partition key, you might want to use ALLOW FILTERING
    // const query = "SELECT * FROM users WHERE id = ? ALLOW FILTERING";

    const result = await cassandraClient.executeQuery(query, params);

    if (!result.rows.length) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = result.rows[0];
    res.json({ id: user.id, name: user.name, email: user.email }); // Adjust according to your Cassandra table structure
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const register = async (req, res) => {
  const { username, email, password, role = "user" } = req.body; // Set default role to 'user'

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ msg: "Please add all values in the request body" });
  }

  // Check if user already exists
  const existingUserQuery =
    "SELECT * FROM users WHERE email = ? ALLOW FILTERING"; // Added ALLOW FILTERING
  const existingUserParams = [email];
  let foundUser;

  try {
    foundUser = await cassandraClient.executeQuery(
      existingUserQuery,
      existingUserParams
    );
    // Check if any user was found with the provided email
    if (foundUser && foundUser.rows && foundUser.rows.length > 0) {
      return res.status(400).json({ msg: "Email already in use" });
    }
  } catch (error) {
    console.error("Error checking existing user:", error);
    return res.status(500).json({ msg: "Error checking for existing user" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user in Cassandra
  const insertQuery =
    "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"; // Include role in the insert statement
  const userId = uuidv4(); // Generate a unique user ID
  const insertParams = [userId, username, email, hashedPassword, role]; // Add role to params

  try {
    await cassandraClient.executeQuery(insertQuery, insertParams);
    return res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Error inserting user into Cassandra:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  // Find user by email
  const userQuery = "SELECT * FROM users WHERE email = ? ALLOW FILTERING"; // Using ALLOW FILTERING if email is not a partition key
  const userParams = [email];

  try {
    const foundUser = await cassandraClient.executeQuery(userQuery, userParams);

    if (foundUser.rows.length) {
      const user = foundUser.rows[0];

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = jwt.sign(
          { id: user.id, name: user.name, role: user.role || "user" }, // Include role if needed
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );

        return res.status(200).json({ msg: "User logged in", token });
      } else {
        return res.status(400).json({ msg: "Bad password" });
      }
    } else {
      return res.status(400).json({ msg: "Bad credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const dashboard = async (req, res) => {
  console.log("dashboard user", req.user);

  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    isLoggedIn: true,
    id: `${req.user.id}`,
  });
};

const getAllUsers = async (req, res) => {
  console.log("Getting all users...");

  const query = "SELECT * FROM users"; // Adjust your table name
  const result = await cassandraClient.executeQuery(query);

  return res.status(200).json({ users: result.rows });
};

const getAllRecipes = async (req, res) => {
  try {
    const query = "SELECT * FROM recipes"; // Adjust your table name
    const result = await cassandraClient.executeQuery(query);
    return res.status(200).json({ recipes: result.rows });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const query = "SELECT * FROM categories"; // Adjust your table name
    const result = await cassandraClient.executeQuery(query);
    res.status(200).json({ categories: result.rows });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function fetchAreasData(req, res) {
  try {
    const query = "SELECT areaName, imageUrl FROM areas"; // Adjust your table name
    const result = await cassandraClient.executeQuery(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching areas:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  try {
    // Query to fetch the recipe by ID
    const recipeQuery = "SELECT * FROM recipes WHERE id = ?"; // Adjust according to your table structure
    const recipeParams = [recipeId];
    const recipeResult = await cassandraClient.executeQuery(
      recipeQuery,
      recipeParams
    );

    if (!recipeResult.rows.length) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const recipe = recipeResult.rows[0];

    // Query to fetch the category by ID (assuming you have a separate categories table)
    const categoryQuery = "SELECT * FROM categories WHERE id = ?"; // Adjust according to your table structure
    const categoryParams = [recipe.categoryId]; // Use the appropriate field to fetch the category
    const categoryResult = await cassandraClient.executeQuery(
      categoryQuery,
      categoryParams
    );

    // Attach category to the recipe object
    recipe.category = categoryResult.rows.length
      ? categoryResult.rows[0]
      : null;

    res.status(200).json({ recipe });
  } catch (error) {
    console.error("Error fetching recipe:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const searchRecipes = async (req, res) => {
  const { search } = req.query;
  try {
    const query =
      "SELECT * FROM recipes WHERE title LIKE ? OR description LIKE ?"; // Adjust your table name
    const params = [`%${search}%`, `%${search}%`];
    const result = await cassandraClient.executeQuery(query, params);
    res.status(200).json({ recipes: result.rows });
  } catch (error) {
    console.error("Error searching recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserProfileData = async (req, res) => {
  let userId = req.user.id;
  userId = userId.trim();

  try {
    const query = "SELECT * FROM users WHERE id = ?"; // Adjust your table name
    const userParams = [userId];
    const userDataResult = await cassandraClient.executeQuery(
      query,
      userParams
    );

    if (!userDataResult.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDataResult.rows[0];
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  login,
  register,
  dashboard,
  getAllUsers,
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  getAllCategories,
  fetchAreasData,
  getUser,
  getUserProfileData,
};
