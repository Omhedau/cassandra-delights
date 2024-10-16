import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Comment from "../components/Comment";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


const RecipeDetailPage = () => {
  const [recipe, setRecipe] = useState(null);
  const [isLiked, setIsLiked] = useState(null);
  const [isDisliked, setIsDisliked] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const [userData, setUserData] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  
  const handleSubmitComment = async (content) => {
    try {
      const content = newComment;
      const response = await axios.post(
        `${window.location.origin}/api/v1/comment/${id}`,
        { content }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        console.log('Comment created successfully:', response.data.comment);
        fetchComments();
        setNewComment("");
      } else {
        console.error('Failed to create comment:', response.data.error);
      }
    } catch (error) {
      console.error('Error creating comment:', error.message);
    }
  };
  
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/api/v1/comment/${id}`);
      setComments(response.data.comments);

      console.log(response.data.comments);

    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${window.location.origin}/api/v1/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData({ id: response.data.id, msg: response.data.msg });
      return response;
    } catch (error) {
      toast.error(error.message);
    }
  };



  useEffect(() => {
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/v1/recipes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const recipeData = response.data.recipe;

        const liked = recipeData.likes.some(
          (like) => like.user.toString() === userData.id
        );
        const disliked = recipeData.dislikes.some(
          (dislike) => dislike.user.toString() === userData.id
        );
        console.log(liked, disliked);
        setIsLiked(liked);
        setIsDisliked(disliked);
        setRecipe(recipeData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipe:", error.message);
        setLoading(false);
      }
    };
    console.log("yahooo");
    fetchData();
    fetchUserData();
  }, [id, token, userData.id, isLiked, isDisliked]);

  useEffect(() => {
    fetchComments();
    console.log("useeffect is nunning ...", comments);
  }, []);

  const handleLike = async () => {
    try {
      if (isLiked) {
        // If the user has already liked the recipe, remove the like
        await axios.post(
          `${window.location.origin}/api/v1/recipe/like/${recipe._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLiked(false);
      } else {
        // If the user hasn't liked the recipe yet, add the like
        await axios.post(
          `${window.location.origin}/api/v1/recipe/like/${recipe._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like status:", error.message);
      toast.error("Failed to toggle like status");
    }
  };

  const handleDislike = async () => {
    try {
      if (isDisliked) {
        // If the user has already disliked the recipe, remove the dislike
        await axios.post(
          `${window.location.origin}/api/v1/recipe/dislike/${recipe._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsDisliked(false);
      } else {
        // If the user hasn't disliked the recipe yet, add the dislike
        await axios.post(
          `${window.location.origin}/api/v1/recipe/dislike/${recipe._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsDisliked(true);
      }
    } catch (error) {
      console.error("Error toggling dislike status:", error.message);
      toast.error("Failed to toggle dislike status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-5 rounded-2xl bg-white/5 p-4">
          <div className="h-24 rounded-lg bg-rose-100/10"></div>
          <div className="space-y-3">
            <div className="h-3 w-3/5 rounded-lg bg-rose-100/10"></div>
            <div className="h-3 w-4/5 rounded-lg bg-rose-100/20"></div>
            <div className="h-3 w-2/5 rounded-lg bg-rose-100/20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return <div className="text-center">Recipe not found</div>;
  }

  const instructionsSteps = recipe.strInstructions
    .split("\r\n")
    .filter((step) => step.trim() !== "");

  return (
    <div>
      <div className="container mx-auto mt-8">
        <Navbar isLoggedIn={token !== ""} userName={userData.msg} />
        <div className="mt-4 grid grid-cols-2 pb-4 px-4 shadow-md">
          <div className="bg-white p-8 rounded-lg shadow">
            <h1 className="text-4xl py-2 text-center font-semibold mb-2">
              {recipe.strMeal}
            </h1>
            <img
              className="rounded-md w-full h-auto mb-4"
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
            />
            <div className="flex justify-between">
              <div className="flex ">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Category</h2>
                  <p>{recipe.category.strCategory}</p>
                </div>
                <img
                  src={recipe.category.strCategoryThumb}
                  alt={recipe.category.strCategory}
                  className="w-32 rounded-full h-32 mb-4"
                />
              </div>
              <div className="text-center  my-4">
                <button
                  className={`mx-2 px-5  py-3 text-black bg-${
                    isLiked ? "green" : "white"
                  }-500  border-2 border-black hover:bg-${
                    isLiked ? "green" : "white"
                  }-600 focus:outline-none rounded-full transition-all duration-300`}
                  style={{ backgroundColor: isLiked ? "green" : "white" }}
                  onClick={handleLike}
                >
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className="h-8 w-8"
                    style={{ color: isLiked ? "black" : "green" }}
                  />
                </button>
                <button
                  className={`mx-2  px-5  py-3 text-black bg-${
                    isDisliked ? "red" : "white"
                  }-500  border-2 border-black hover:bg-${
                    isDisliked ? "red" : "white"
                  }-600 focus:outline-none rounded-full transition-all duration-300`}
                  style={{ backgroundColor: isDisliked ? "red" : "white" }}
                  onClick={handleDislike}
                >
                  <FontAwesomeIcon
                    icon={faThumbsDown}
                    className="h-8 w-8"
                    style={{ color: isDisliked ? "black" : "red" }}
                  />
                </button>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Area</h2>
                <p className="text-gray-600 mb-4">{recipe.strArea}</p>
              </div>
            </div>
          </div>
          <div className="aspect-w-16 flex justify-end pt-24 aspect-h-9">
            <iframe
              className="w-[48rem] h-[27rem] p-4"
              src={recipe.strYoutube.replace("watch?v=", "embed/")}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; 
               web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div className="bg-[#fae5f5] shadow-sm p-8 mt-2 flex justify-between  ">
          <div className="w-1/3 ">
            <h2 className="text-2xl px-4 font-semibold mb-2">Ingredients</h2>
            <div className="p-4">
              <table className=" border  border-gray-400">
                <thead>
                  <tr>
                    <th className="border border-gray-400 p-2">Ingredient</th>
                    <th className="border border-gray-400 p-2">Measure</th>
                  </tr>
                </thead>
                <tbody>
                  {recipe.ingredients.map((ingredient, index) => (
                    <tr className="hover:bg-pink-400" key={index}>
                      <td className="border border-gray-400 p-2">
                        {ingredient.ingredient}
                      </td>
                      <td className="border border-gray-400 p-2">
                        {ingredient.measure}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-2/3">
            <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
            <ol>
              {instructionsSteps.map((step, index) => (
                <li key={index}>
                  <strong>Step {index + 1}:</strong> {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* comment section ------------------------------ */}
        <div className="mt-8" style={{ width: "80%", margin: "auto" }}>
          <h2 className="text-2xl font-semibold py-6">{comments.length} Comments</h2>

          {/* Input field for entering new comment */}
          <div className="flex mb-4">
            <TextField
              label="Write a comment..."
              variant="standard"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitComment}
              style={{ marginLeft: "8px" }}
            >
              Submit
            </Button>
          </div>

          {/* Display existing comments */}
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} userData={userData} fetchComments={fetchComments}/>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecipeDetailPage;
