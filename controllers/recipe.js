
// Import necessary models
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Category = require('../models/Categories');


const likeRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { id: userId } = req.user;

        const user = await User.findById(userId);
        const recipe = await Recipe.findById(recipeId);
        if (!user || !recipe) {
            return res.status(404).json({ error: 'User or recipe not found' });
        }

        // Check if the user already liked the recipe
        const alreadyLiked = recipe.likes.some(like => like.user.toString() === userId);
        console.log("alredy liked",alreadyLiked);
        // Check if the user already disliked the recipe
        const alreadyDisliked = recipe.dislikes.some(dislike => dislike.user.toString() === userId);
        console.log("alredy disliked",alreadyDisliked);

        if (alreadyLiked) {
            // User already liked the recipe, remove like
            console.log("alraedy like.....",alreadyLiked);
            recipe.likes = recipe.likes.filter(like => like.user.toString() !== userId);
            user.likedRecipes = user.likedRecipes.filter(likedRecipe => likedRecipe.toString() !== recipeId);
        } else {
            // Add like if the user didn't like the recipe before
            recipe.likes.push({ user: userId });
            // Remove dislike if the user disliked the recipe before
            if (alreadyDisliked) {
               console.log(alreadyDisliked);
                recipe.dislikes = recipe.dislikes.filter(dislike => dislike.user.toString() !== userId);
                user.dislikedRecipes = user.dislikedRecipes.filter(dislikedRecipe => dislikedRecipe.toString() !== recipeId);
            }
            // Add recipe to user's likedRecipes array
            if (!user.likedRecipes.includes(recipeId)) {
                console.log("............--------- calling the like function ...")
                user.likedRecipes.push(recipeId);
            }
        }

        await recipe.save();
        await user.save();
        res.status(200).json({ message: 'Recipe liked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const dislikeRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { id: userId } = req.user;

        const user = await User.findById(userId);
        const recipe = await Recipe.findById(recipeId);
        if (!user || !recipe) {
            return res.status(404).json({ error: 'User or recipe not found' });
        }

        // Check if the user already liked the recipe
        const alreadyLiked = recipe.likes.some(like => like.user.toString() === userId);
        // Check if the user already disliked the recipe
        console.log("alredy liked",alreadyLiked);
        const alreadyDisliked = recipe.dislikes.some(dislike => dislike.user.toString() === userId);
        console.log("alredy disliked",alreadyDisliked);
        if (alreadyDisliked) {
            // User already disliked the recipe, remove dislike
            console.log("already disliked....",alreadyDisliked)
            recipe.dislikes = recipe.dislikes.filter(dislike => dislike.user.toString() !== userId);
            user.dislikedRecipes = user.dislikedRecipes.filter(dislikedRecipe => dislikedRecipe.toString() !== recipeId);
        } else {
            // Add dislike if the user didn't dislike the recipe before

            recipe.dislikes.push({ user: userId });

            // Remove like if the user liked the recipe before

            if (alreadyLiked) {
                console.log(alreadyLiked);
                recipe.likes = recipe.likes.filter(like => like.user.toString() !== userId);
                user.likedRecipes = user.likedRecipes.filter(likedRecipe => likedRecipe.toString() !== recipeId);
            }

            // Add recipe to user's dislikedRecipes array

            if (!user.dislikedRecipes.includes(recipeId)) {
                user.dislikedRecipes.push(recipeId);
            }
        }

        await recipe.save();
        await user.save();
        res.status(200).json({ message: 'Recipe disliked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const createRecipe = async (req, res) => {
  try {
    // Extract recipe data from request body
    const { strMeal, category, strArea, strInstructions, strMealThumb, strTags, strYoutube, ingredients, userId } = req.body;
    
    // Check if the category exists
    let categoryId;
    const existingCategory = await Category.findOne({ strCategory: category });
    if (existingCategory) {
      categoryId = existingCategory._id;
    } else {
      // Create a new category if it doesn't exist
      const newCategory = new Category({
        strCategory: category,
      });
      const savedCategory = await newCategory.save();
      categoryId = savedCategory._id;
    }

    // Create a new recipe object
    const newRecipe = new Recipe({
      strMeal,
      category: categoryId,
      strArea,
      strInstructions,
      strMealThumb,
      strTags,
      strYoutube,
      ingredients,
      createdBy: userId
    });

    // Save the new recipe to the database
    const savedRecipe = await newRecipe.save();

    // Update the user object with the new recipe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.recipesCreated.push(savedRecipe._id); // Push the ID of the saved recipe
    await user.save();

    res.status(201).json(savedRecipe); // Return the saved recipe as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};


const updateRecipe = async (req, res) => {
  try {
    // Extract recipe data from request body
    const { recipeid, strMeal, category, strArea, strInstructions, strMealThumb, strTags, strYoutube, ingredients, userId } = req.body;
    
    // Check if the category exists
    let categoryId;
    const existingCategory = await Category.findOne({ strCategory: category });
    if (existingCategory) {
      categoryId = existingCategory._id;
    } else {
      // Create a new category if it doesn't exist
      const newCategory = new Category({
        strCategory: category,
        // Add additional fields here if needed
      });
      const savedCategory = await newCategory.save();
      categoryId = savedCategory._id;
    }

    // Check if the provided recipe ID is valid
    if (!recipeid) {
      return res.status(400).json({ msg: 'Invalid recipe ID' });
    }
    
    // Check if the recipe exists
    const existingRecipe = await Recipe.findById(recipeid);
    if (!existingRecipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Update the recipe object with new data
    existingRecipe.strMeal = strMeal;
    existingRecipe.category = categoryId;
    existingRecipe.strArea = strArea;
    existingRecipe.strInstructions = strInstructions;
    existingRecipe.strMealThumb = strMealThumb;
    existingRecipe.strTags = strTags;
    existingRecipe.strYoutube = strYoutube;
    existingRecipe.ingredients = ingredients;
    existingRecipe.dateModified = new Date(); // Set the date modified

    // Save the updated recipe to the database
    const updatedRecipe = await existingRecipe.save();

    res.status(200).json(updatedRecipe); // Return the updated recipe as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};



const deleteRecipe = async (req, res) => {
  // Step 1: Extract the recipe ID from the request parameters
  const recipeId = req.params.recipeId;

  try {
      // Step 2: Check if the recipe exists
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
          // If the recipe doesn't exist, return a 404 error
          return res.status(404).json({ message: 'Recipe not found' });
      }

      // Step 3: Optionally, check if the user has permission to delete the recipe
      // For example, check if the user is the creator of the recipe or has admin privileges

      // Step 4: Extract the user ID from the request (assuming it's provided in the request body)
     
          let userId = req.user.id
     // Trim the userId to remove any leading or trailing whitespace and newline characters
           userId = userId.trim();

      // Step 5: Delete the recipe ID from the user's 'recipesCreated' array
      await User.findByIdAndUpdate(userId, { $pull: { recipesCreated: recipeId } });

      // Step 6: Delete the recipe ID from the 'likedRecipes' array of all users who liked this recipe
      await User.updateMany({ likedRecipes: recipeId }, { $pull: { likedRecipes: recipeId } });

      // Step 7: Delete the recipe ID from the 'dislikedRecipes' array of all users who disliked this recipe
      await User.updateMany({ dislikedRecipes: recipeId }, { $pull: { dislikedRecipes: recipeId } });

      // Step 8: Delete the comments associated with the recipe
      // Assuming the Comment model has a field 'recipe' referencing the recipe ID
      await Comment.deleteMany({ recipe: recipeId });

      // Step 9: Finally, delete the recipe itself
      await Recipe.findByIdAndDelete(recipeId);
      
      // Step 10: Send a success response if the recipe is deleted successfully
      res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
      // Step 11: If an error occurs during deletion, handle it and send an error response
      console.error('Error deleting recipe:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
  

const getRecentRecipes = async (req, res) => {
    try {
      // Fetch 12 most recent recipes from the database
      const recentRecipes = await Recipe.find({}).sort({ createdAt: -1 }).limit(12).populate('category');
    
      return res.status(200).json({ recentRecipes });
    } catch (error) {
      console.error('Error fetching recent recipes:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getMostLikedRecipes = async (req, res) => {
    try {
      // Fetch all recipes from the database
      const recipes = await Recipe.find({});
    
      // Sort recipes based on likes (primary) and dislikes (secondary)
      recipes.sort((a, b) => {
        // If likes are equal, sort by fewer dislikes
        if (a.likes.length === b.likes.length) {
          return a.dislikes.length - b.dislikes.length;
        }
        // Sort by most likes
        return b.likes.length - a.likes.length;
      });
    
      // Limit the number of recipes to 9
      const limitedRecipes = recipes.slice(0, 9);
    
      return res.status(200).json({ sortedRecipes: limitedRecipes });
    } catch (error) {
      console.error('Error fetching and sorting recipes:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  
  

module.exports = { likeRecipe, dislikeRecipe ,getRecentRecipes,getMostLikedRecipes,createRecipe,updateRecipe, deleteRecipe};

