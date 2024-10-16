import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MdEdit } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import RecipeItem from "../components/RecipeItem";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";

  const deleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`${window.location.origin}/api/v1/recipe/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUserData();
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${window.location.origin}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found.</div>;

  return (
    <div className="mx-auto w-full p-8 bg-white rounded-lg shadow-lg">
      <Navbar isLoggedIn={token !== ""} userName={`Hello ${user.name}`} />
      <div className="mt-24"></div>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">User Profile</h2>
        <p className="text-lg text-gray-600 mb-4">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="text-lg text-gray-600 mb-8">
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <div className="mt-12">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6">
          Recipes Created
        </h3>
        {user.recipesCreated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.recipesCreated.map((recipe) => (
              <div
                key={recipe._id}
                className="relative bg-white p-4 rounded-lg "
              >
                <Link to={`/recipes/${recipe._id}`}>
                  <div className="bg-white shadow-lg hover:shadow-xl max-w-sm border border-gray-200 rounded-lg overflow-hidden cursor-pointer">
                    {/* Recipe Image */}
                    <img
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      className="w-full h-40 object-cover"
                    />
                    {/* Recipe Details */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {recipe.strMeal}
                      </h3>
                      <p className="text-gray-700">
                        {recipe.strInstructions.substring(0, 100)}...
                      </p>
                    </div>
                    {/* Like and Dislike Buttons */}
                    <div className="flex bg-black justify-between p-4">
                      {/* Like Button */}
                      <div className="flex justify-center items-center">
                        <button className="mr-2">
                          <FontAwesomeIcon
                            icon={faThumbsUp}
                            className="h-6 w-6"
                            style={{ color: "#66b234" }}
                          />
                        </button>
                        <h2 className="text-white">{recipe.likes.length}</h2>
                      </div>
                      {/* Dislike Button */}
                      <div className="flex justify-center items-center">
                        <button className="mr-2">
                          <FontAwesomeIcon
                            icon={faThumbsDown}
                            className="h-6 w-6"
                            style={{ color: "#f9343e" }}
                          />
                        </button>
                        <h2 className="text-white">{recipe.dislikes.length}</h2>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="absolute top-[165px] right-[100px] flex gap-2">
                  <button
                    onClick={() => deleteRecipe(recipe._id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 hover:scale-110 duration-150 ease-in-out focus:outline-none"
                    title="Delete Recipe"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/user/updaterecipe/${recipe._id}`);
                    }}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 hover:scale-110 duration-150 ease-in-out focus:outline-none"
                    title="Edit Recipe"
                  >
                    <MdEdit />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600">No recipes Created yet.</p>
        )}
      </div>

      <div
        onClick={() => {
          navigate("/user/createrecipe");
        }}  //om is great
        className="my-10 hover:scale-125 cursor-pointer duration-200 p-3 mx-auto bg-green-200 rounded-full w-10 h-10 flex items-center justify-center"
      >
        <FaPlus />
      </div>

      <div className="mt-12">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6">
          Recipes Liked
        </h3>
        {user.likedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.likedRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="relative bg-white rounded-lg"
              >
                <Link to={`/recipes/${recipe._id}`}>
                  <RecipeItem recipe={recipe} onLike={0} onDislike={0} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600">No recipes Liked yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
