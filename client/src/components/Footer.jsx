import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import social media icons from react-icons library

const Footer = () => {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowFooter(true);
    },320);

    return () => clearTimeout(timeoutId);
  }, []); // empty dependency array ensures the effect runs only once after the initial render

  if (!showFooter) {
    return null; // Don't render the Footer until the delay is over
  }

  return (
    <footer className="bg-gradient-to-r from-green-400 to-green-600 caret-transparent border-t  border-white border-blur text-white py-8 mt-16">
      <div className="container mx-auto text-center">
        <img src="https://th.bing.com/th/id/OIG1.18HHd7VZFlfizIjzS600?pid=ImgGn" alt="Cooking Delights Logo" className="h-20  hover:animate-spin cursor-pointer  transition-all duration-150  shadow-2xl rounded-full w-auto mx-auto mb-4" /> 
        <p className="text-lg mb-4">Explore the world of flavors with Cooking Delights</p>
        <div className="flex justify-center items-center mb-8">
          <a href="https://www.facebook.com" className="text-white hover:text-green-700 mr-4">
            <FaFacebookF className="text-2xl" />
          </a>
          <a href="https://www.twitter.com" className="text-white hover:text-green-700 mr-4">
            <FaTwitter className="text-2xl" />
          </a>
          <a href="https://www.instagram.com" className="text-white hover:text-green-700">
            <FaInstagram className="text-2xl" />
          </a>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Cooking Delights. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
