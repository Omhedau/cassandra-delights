const express = require("express");

const router = express.Router();

const {
  getUserProfileData,
  login,
  register,
  getUser,
  dashboard,
  getAllUsers,
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  getAllCategories,
  fetchAreasData,
} = require("../controllers/user");
const authMiddleware = require("../middleware/auth");

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/users").get(getAllUsers);
router.route("/recipes").get(authMiddleware, getAllRecipes);
router.route("/recipes/:recipeId").get(authMiddleware, getRecipeById); // Route to get a specific recipe by its ID
router.route("/recipessearch").get(authMiddleware, searchRecipes);
router.route("/getuser").get(authMiddleware, getUser);
router.route("/profile").get(authMiddleware, getUserProfileData);

router.get("/categories", getAllCategories);
router.get("/areas", fetchAreasData);
module.exports = router;
