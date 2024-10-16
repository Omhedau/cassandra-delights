import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';


const RecipeItem = ({ recipe }) => {

  

  return (
    <div className="bg-white shadow-lg transition duration-300 ease-in-out transform hover:shadow-xl max-w-sm border border-gray-200 rounded-lg hover:-translate-y-1 overflow-hidden cursor-pointer">
      {/* Recipe Image */}
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-40 object-cover"
      />
      {/* Recipe Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{recipe.strMeal}</h3>
        <p className="text-gray-700">{recipe.strInstructions.substring(0, 100)}...</p>
      </div>
      {/* Like and Dislike Buttons */}
      <div className="flex bg-black justify-between  p-4">
        {/* Like Button */}
        <div className="flex justify-center items-center">
          <button  className="mr-2">
            <FontAwesomeIcon icon={faThumbsUp} className='h-6 w-6' style={{ color: "#66b234" }} />
            {/* <FontAwesomeIcon icon="fa-light fa-thumbs-up" style={{ color: "#66b234" }} /> */}
          </button>
          <h2 className='text-white'>{recipe.likes.length}</h2>
        </div>
        {/* Dislike Button */}
        <div className="flex justify-center  items-center">
          <button  className="mr-2">
            <FontAwesomeIcon icon={faThumbsDown} className='h-6 w-6' style={{ color: "#f9343e" }} />
          </button>
          <h2 className='text-white'>{recipe.dislikes.length}</h2>
        </div>
      </div>
    </div>
  );
};

export default RecipeItem;
