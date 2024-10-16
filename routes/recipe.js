// const express = require("express");
// const router = express.Router();

// const { likeRecipe, dislikeRecipe,createRecipe,updateRecipe, getRecentRecipes ,getMostLikedRecipes, deleteRecipe} = require("../controllers/recipe");
// const authMiddleware = require('../middleware/auth')

// // Use HTTP POST method for both like and dislike actions
// router.route("/like/:recipeId").post(authMiddleware, likeRecipe);
// router.route("/dislike/:recipeId").post(authMiddleware, dislikeRecipe);
// router.route("/addrecipe").post(createRecipe);
// router.route("/updaterecipe").put(updateRecipe);
// router.route("/recentRecipes").get( getRecentRecipes);
// router.route("/most-liked").get( getMostLikedRecipes);
// router.delete("/:recipeId",authMiddleware,deleteRecipe);

// module.exports = router;
