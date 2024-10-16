import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RecipeCard from '../components/RecipeCard';
import Hero from '../components/Hero';

const Home = () => {
  // Dummy recipe data
  const recipes = [
    {
      title: "Breakfast Recipes",
      image: "../src/assets/breakfast.jpg",
      description: "Start your day right with our delectable breakfast recipes. From energizing smoothie bowls to hearty breakfast burritos, we've got the perfect recipes to kickstart your morning."
    },
    {
      title: "Lunch Recipes",
      image: "../src/assets/lunch.jpg",
      description: "Savor the flavors of our delicious lunch recipes. Whether you prefer light salads, hearty sandwiches, or flavorful pasta dishes, our lunch ideas will satisfy your midday cravings."
    },
    {
      title: "Dinner Recipes",
      image: "../src/assets/dinner.jpg",
      description: "Transform your evenings with our enticing dinner recipes. Explore a diverse range of dishes, from comforting casseroles to gourmet entrees, making every dinner a memorable experience."
    },
    {
      title: "Soup Recipes",
      image: "../src/assets/soup.jpg",
      description: "Warm up with our soul-soothing soup recipes. From creamy bisques to hearty stews, our soup collection offers a variety of options to comfort and nourish you during any season."
    },
    {
      title: "Summer Drink Recipes",
      image: "../src/assets/summerdrink.jpg",
      description: "Stay cool and refreshed with our vibrant summer drink recipes. Quench your thirst with fruity smoothies, refreshing iced teas, and creative cocktails that capture the essence of the summer season."
    },
    {
      title: "Winter Drink Recipes",
      image: "../src/assets/winterdrinks.jpg",
      description: "Cozy up with our heartwarming winter drink recipes. From spiced hot chocolates to festive holiday beverages, our winter drinks will add warmth and joy to your cold winter nights."
    }
  ];
  
  

  return (
    <div>
    <Navbar />
    <div className="container flex flex-col justify-center mx-auto my-8 px-4">
        <div className='mt-24'>
      <Hero />


        </div>
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} title={recipe.title} image={recipe.image} description={recipe.description} />
        ))}
        
      </div>
    </div>
    <Footer />
  </div>
  
  );
};

export default Home;
