import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";

const UpdateRecipeForm = () => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const {id} = useParams();
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({
    recipeid: "",
    strMeal: "",
    category: "",
    strArea: "",
    strInstructions: "",
    strMealThumb: "",
    strTags: "",
    strYoutube: "",
    ingredients: [{ ingredient: "", measure: "" }],
    userId: "",
  });
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    const fetchRecipe = async () => {
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
        console.log("useeffect is running");

        setFormData({
          recipeid: recipeData._id,
          strMeal: recipeData.strMeal,
          category: recipeData.category.strCategory,
          strArea: recipeData.strArea,
          strInstructions: recipeData.strInstructions,
          strMealThumb: recipeData.strMealThumb,
          strTags: recipeData.strTags,
          strYoutube: recipeData.strYoutube,
          ingredients: recipeData.ingredients,
          userId: recipeData.userId,
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };
    fetchRecipe();
  }, [id, token]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "ingredient" || name === "measure") {
      const ingredients = [...formData.ingredients];
      ingredients[index][name] = value;
      setFormData({ ...formData, ingredients });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { ingredient: "", measure: "" }],
    });
  };

  const removeIngredient = (index) => {
    const ingredients = [...formData.ingredients];
    ingredients.splice(index, 1);
    setFormData({ ...formData, ingredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("datat of recipeid of formdata is ", formData.recipeid);
    try {
      // Assuming you have an API endpoint to handle recipe update
      const res = await axios.put(
        `${window.location.origin}/api/v1/recipe/updaterecipe`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle success response
      // Reset form data after successful submission if needed
      setCurrentStage(1); // Reset stage to first stage
    } catch (err) {
      console.error(err); // Handle error response
    }
  };

  const nextStage = () => {
    setCurrentStage((currentStage) => currentStage + 1);
  };

  const previousStage = () => {
    setCurrentStage((currentStage) => currentStage - 1);
  };

  return (
    <div className="flex mt-5 z-10 flex-col justify-center items-center">
      <h2 className="text-4xl bg-white px-32 pb-3 text-center font-bold mb-4">
        Update Recipe
      </h2>
      <div className="bg-green-100 p-6 rounded-lg shadow-2xl w-[60%]">
        <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
          {currentStage === 1 && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="strMeal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Meal Name
                </label>
                <input
                  type="text"
                  id="strMeal"
                  name="strMeal"
                  value={formData.strMeal}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="strArea"
                  className="block text-sm font-medium text-gray-700"
                >
                  Area
                </label>
                <input
                  type="text"
                  id="strArea"
                  name="strArea"
                  value={formData.strArea}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </>
          )}

          {currentStage === 2 && (
            <>
              <div className="mb-4 ">
                <h3 className="text-lg font-bold mb-2">Ingredients</h3>
                {formData.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center  mb-2"
                  >
                    <input
                      type="text"
                      name="ingredient"
                      value={ingredient.ingredient}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Ingredient"
                      className="mt-1 p-2 border border-gray-300 rounded-md mr-2"
                    />

                    <input
                      type="text"
                      name="measure"
                      value={ingredient.measure}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Measure"
                      className="mt-1 p-2 border border-gray-300 rounded-md mr-2"
                    />

                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-400 font-medium  hover:bg-red-400  bg-black  hover:scale-[0.80] transition-all h-12 shadow-lg hover:text-black duration-150 px-4 rounded-full "
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIngredient}
                  className="bg-black  text-green-500    p-4 rounded-full hover:bg-green-300 hover:text-black  hover:scale-[0.92] duration-15 transition-all"
                >
                  {" "}
                  <FaPlus className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="strInstructions"
                  className="block text-sm font-medium text-gray-700"
                >
                  Instructions
                </label>
                <textarea
                  id="strInstructions"
                  name="strInstructions"
                  value={formData.strInstructions}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                ></textarea>
              </div>
            </>
          )}

          {currentStage === 3 && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="strMealThumb"
                  className="block text-sm font-medium text-gray-700"
                >
                  Meal Image URL
                </label>
                <input
                  type="text"
                  id="strMealThumb"
                  name="strMealThumb"
                  value={formData.strMealThumb}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="strTags"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="strTags"
                  name="strTags"
                  value={formData.strTags}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="strYoutube"
                  className="block text-sm font-medium text-gray-700"
                >
                  YouTube Video URL
                </label>
                <input
                  type="text"
                  id="strYoutube"
                  name="strYoutube"
                  value={formData.strYoutube}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </>
          )}

          <div className="flex justify-between">
            {currentStage === 3 && (
              <button
                type="submit"
                className="bg-green-500  hover:scale-[0.92] duration-15 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-all"
              >
                Submit
              </button>
            )}
          </div>
        </form>
        <div className="flex justify-between py-3">
        {currentStage > 1 && (
          <button
            type="button"
            onClick={previousStage}
            className="bg-red-500 hover:scale-[0.92] duration-150 text-white py-2 px-4 rounded-md mr-4 hover:bg-red-600 transition-all"
          >
            Previous
          </button>
        )}

        {currentStage < 3 && (
          <button
            type="button"
            onClick={nextStage}
            className="bg-green-500  hover:scale-[0.92] duration-15 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-all"
          >
            Next
          </button>
        )}

        </div>

       
      </div>
    </div>
  );
};

export default UpdateRecipeForm;
