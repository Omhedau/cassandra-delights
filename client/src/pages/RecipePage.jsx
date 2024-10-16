import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import RecipeItem from "../components/RecipeItem";

const RecipePage = ({ type }) => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const [data, setData] = useState({});
  const { category, search } = useParams();
  const { area } = useParams();
  const navigate = useNavigate();

  const veification = async () => {
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${window.location.origin}/api/v1/dashboard`,
        axiosConfig
      );
      
      setData({ msg: response.data.msg });
      return response;
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
       const user= veification();

        if (token === "") {
          navigate("/login");
          toast.warn("Please login first to access dashboard");
        }
        let axiosConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          `${window.location.origin}/api/v1/recipes`,
          axiosConfig
        );


        if (type === "category" && category) {
          // Filter recipes by category ID
          const filteredRecipes = response.data.recipes.filter(
            (recipe) => recipe.category._id === category
          );
          setRecipes(filteredRecipes);
        } else if (type === "area" && area) {
          const filteredRecipes = response.data.recipes.filter(
            (recipe) => recipe.strArea === area
          );
          setRecipes(filteredRecipes);
        } else if (type === "search" && search) {
          const filteredRecipes = response.data.recipes.filter((recipe) =>
            recipe.strMeal.toLowerCase().includes(search.toLowerCase())
          );
          setRecipes(filteredRecipes);
        } else {
          setRecipes(response.data.recipes);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error.message);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [token, type, category,search]);

  if (loading) {
    <div>loading</div>;
  }

  return (
    <div>
      <div className="container flex flex-col justify-center mx-auto my-8 px-4">
        <Navbar isLoggedIn={token !== ""} userName={data.msg} />
        <div className="mt-24"></div>

        {type === "recipes" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <Link key={recipe._id} to={`/recipes/${recipe._id}`}>
                  <RecipeItem
          key={recipe._id} // Make sure to provide a unique key prop
          recipe={recipe}
          onLike={0}
          onDislike={0}
        />
              </Link>
            ))}
          </div>
        )}
        {type === "category" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <Link key={recipe._id} to={`/recipes/${recipe._id}`}>
                 <RecipeItem
          key={recipe._id} // Make sure to provide a unique key prop
          recipe={recipe}
          onLike={0}
          onDislike={0}
        />
              </Link>
            ))}
          </div>
        )}
        {type == "area" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <Link key={recipe._id} to={`/recipes/${recipe._id}`}>
                <div className="bg-white shadow-lg transition duration-300 ease-in-out transform hover:shadow-xl max-w-sm border border-gray-200  rounded-lg hover:-translate-y-1  overflow-hidden cursor-pointer">
                  {" "}
                  {/* Added cursor-pointer for better UX */}
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {recipe.strMeal}
                    </h3>
                    <p className="text-gray-700">
                      {recipe.strInstructions.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {type == "search" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <Link key={recipe._id} to={`/recipes/${recipe._id}`}>
               <RecipeItem
          key={recipe._id} // Make sure to provide a unique key prop
          recipe={recipe}
          onLike={0}
          onDislike={0}
        />
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default RecipePage;
