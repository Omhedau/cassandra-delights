import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import HomeLayout from "../pages/HomeLayout";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Register from "../pages/Register";
import Home from "../pages/Home";
import RecipePage from "../pages/RecipePage";
import RecipeDetailPages from "../pages/RecipeDetailPages";
import AboutUsPage from "../pages/AboutUsPage";
import Recipeform from "../pages/Recipeform";
import UpdateRecipeForm from "../pages/UpdateRecipeForm";
import UserProfile from "../pages/UserProfile";

const Userroute = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="logout" element={<Logout />} />
        <Route path="home" element={<Home />} />
        <Route path="/Aboutus" element={<AboutUsPage />} />
        <Route path="recipes" element={<RecipePage  type="recipes"/>} />
        <Route path="recipes/search/:search" element={<RecipePage type="search"/>} />
        <Route path="recipes/areas/:area" element={<RecipePage type="area" />} /> 
        <Route path="recipes/category/:category" element={<RecipePage type="category" />} /> 
        <Route path="recipes/:id" element={<RecipeDetailPages />} /> 
        <Route path="user/createrecipe" element={<Recipeform/>} />
        <Route path="/user/profile" element={<UserProfile/>} />
        <Route path="user/updaterecipe/:id" element={<UpdateRecipeForm/>} />
      </Route>
    </Routes>
  );
};

export default Userroute;
