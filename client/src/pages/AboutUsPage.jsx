import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';

const AboutUsPage = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [data,setData]=useState({});
  // const[userId,setUserId] = useState();
  const navigate = useNavigate();
  const veification = async () => {

    let axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.get(`${window.location.origin}/api/v1/dashboard`, axiosConfig);
       setData({msg: response.data.msg })
      //  setUserId(response.data.id)
       

    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    veification();
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access recipes!");
    }
  }, [token]);




  return (
    <div>
    <Navbar isLoggedIn={token !== ""} userName={data.msg} />
      <div className="container mx-auto px-10 mt-24">
        <h1 className="text-4xl font-semibold mb-4">Welcome to Cooking Delights</h1>
        <p className="text-lg mb-4">
          "Where culinary dreams take flight and flavors dance on your palate."
        </p>
        <p className="text-lg mb-4">
          At Cooking Delights, we're more than just a recipe hub; we're your passport to a world of gastronomic wonder. 
          From the sizzle of a hot skillet to the aroma of freshly baked bread, our pages are alive with the essence of 
          culinary artistry.
        </p>
        <p className="text-lg mb-4">
          "Cooking is not just about nourishment; it's about expression, creativity, and joy."
        </p>
        <p className="text-lg mb-4">
          Here, we believe that every dish tells a story, and every bite is a journey. Whether you're a kitchen maestro 
          or a fledgling cook, our goal is simple: to ignite your passion for cooking and empower you to create 
          extraordinary meals with ease.
        </p>
        <p className="text-lg mb-4">
          "In a world full of flavors, let Cooking Delights be your compass."
        </p>
        <p className="text-lg mb-4">
          Join our community of culinary enthusiasts, where recipes are more than just instructions—they're invitations 
          to adventure. From comforting classics to bold innovations, we're here to inspire, educate, and above all, 
          celebrate the joy of cooking.
        </p>
        <p className="text-lg mb-4">
          "Embark on a journey of taste, one dish at a time. Welcome to Cooking Delights."
        </p>
      </div>
      <Footer/>
    </div>
  );
};

export default AboutUsPage;
