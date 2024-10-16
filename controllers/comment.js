const Comment = require('../models/Comment')
const Recipe = require('../models/Recipe');

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { recipeId } = req.params;
    const { id: userId } = req.user;

    // Step 1: Find the recipe by its ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Step 2: Create a new comment object
    const comment = new Comment({
      content,
      user: userId,
      recipe: recipeId,
    });

    // Step 3: Save the comment to the database
    await comment.save();

    // Step 4: Update the recipe to include the newly created comment
    recipe.comments.push(comment._id);
    await recipe.save();

    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

const updateComment = async (req, res) => {
  try {
    const { content, commentId } = req.body;
    const { id: userId } = req.user;

    // Step 1: Find the comment by its ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Step 2: Check if the current user is the owner of the comment
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this comment' });
    }

    // Step 3: Update the content of the comment
    comment.content = content;
    comment.updatedAt = new Date();

    // Step 4: Save the updated comment to the database
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};


const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.user;
    console.log("calling the deleteComment" , commentId );

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    console.log(comment.user.toString(), userId );
    // Check if the user is the owner of the comment
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    // Delete the comment
    await comment.deleteOne();

    // Find the associated recipe and remove the deleted comment ID
    const recipe = await Recipe.findById(comment.recipe);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Filter out the deleted comment ID from the recipe's comments array
    recipe.comments = recipe.comments.filter(id => id.toString() !== commentId);

    // Save the updated recipe
    await recipe.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};


const getAllComments = async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Find the recipe by its ID and populate the comments field
    const recipe = await Recipe.findById(recipeId).populate({
      path: 'comments',
      populate: { path: 'user', select: 'name' } 
    });
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Filter out comments with null user
    const filteredComments = recipe.comments.filter(comment => comment.user !== null);

    // Check if there are no comments after filtering
    if (filteredComments.length === 0) {
      return res.status(200).json({ message: 'No comments found for this recipe', comments: [] });
    }

    console.log("consoling the comments", filteredComments);
    res.status(200).json({ comments: filteredComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};



module.exports = {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
};


