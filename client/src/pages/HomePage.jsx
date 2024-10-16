import React, { useState } from 'react';

const HomePage = () => {
    const [recipebook, setRecipeBook] = useState([
        {
            name: "Tea",
            rating: 8,
            ingredients: [
                "1 tea bag or 1 teaspoon loose tea leaves",
                "1 cup water",
                "1-2 teaspoons sugar (optional)",
                "Milk (optional)"
            ],
            procedure: [
                "Boil water in a kettle or a pot.",
                "Place the tea bag or tea leaves in a teapot or mug.",
                "Pour the hot water over the tea bag or leaves.",
                "Let it steep for 3-5 minutes for the desired strength.",
                "Remove the tea bag or strain the tea leaves.",
                "Add sugar if desired and stir.",
                "If you like, add milk to taste.",
                "Enjoy your perfect cup of tea!"
            ],
            tips: "Experiment with steeping times to find the perfect strength. Add honey or lemon for extra flavor.",
            img: "images/tea.jpg"
        }
        // Add more recipes here
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        // Your search logic here
    }

    const handleAddRecipe = (e) => {
        e.preventDefault();
        // Your add recipe logic here
    }

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    }

    return (
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 min-h-screen">
            <nav className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <a className="text-lg font-bold flex items-center" href="#">
                        <img src="images/logo.png" alt="Cooking Delights Logo" className="mr-2 rounded-full h-6 w-6 bg-white p-1" />
                        Cooking Delights
                    </a>
                    <button onClick={toggleAddForm} className="btn btn-outline-light px-4 py-2">Add Recipes</button>
                </div>
            </nav>

            <div className="container mx-auto my-8 px-4">
                <form className="flex justify-center items-center mb-8" onSubmit={handleSearch}>
                    <input className="form-input mr-2 py-2 px-4 rounded-md text-gray-800" type="search"
                        placeholder="Search recipes" aria-label="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <button className="btn btn-outline-light py-2 px-4 rounded-md" type="submit">Search</button>
                </form>

                {/* Display recipes here */}

                {/* Add recipe form */}
                {showAddForm &&
                    <div className="bg-gray-100 rounded-lg p-8 mb-8">
                        <h2 className="text-gray-800 text-4xl font-bold text-center mb-4">Add New Recipe</h2>
                        <form onSubmit={handleAddRecipe} className="flex flex-col items-center">
                            <div className="form-group flex flex-col w-full">
                                <label htmlFor="recipe_name" className="text-gray-800">Recipe Name:</label>
                                <input type="text" className="form-input" id="recipe_name" name="recipe_name" required />
                            </div>
                            {/* Add more form fields for rating, ingredients, procedure, tips, image */}
                            <button type="submit" className="btn btn-primary" name="add_recipe">Add Recipe</button>
                        </form>
                    </div>
                }
            </div>

            <div className="bg-gray-800 text-white py-4 mt-8">
                <p className="text-center">&copy; 2024 Cooking Delights. All rights reserved.</p>
            </div>
        </div>
    );
}

export default HomePage;
