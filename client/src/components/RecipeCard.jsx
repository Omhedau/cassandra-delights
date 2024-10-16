import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

const RecipeCard = ({recipeId, title, image, description }) => {
  return (
    <div className="col flex justify-center cursor-pointer">
      <Link to={`/recipes/category/${recipeId}`} className="block w-full h-full">
        <div className="card shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl max-w-sm bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          <img src={image} alt={title} className="h-48 w-full object-cover" />
          <div className="card-body p-5 flex flex-col justify-between">
            <div>
              <h5 className="card-title text-2xl font-semibold mb-3">{title}</h5>
              <p className="card-text text-gray-700 mb-3">{description}</p>
            </div>
            {/* Add an empty div to fill the remaining space */}
            <div className="flex-grow"></div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
