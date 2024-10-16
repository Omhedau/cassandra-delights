import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Userroute from "./routes/user.route";
import './index.css';
function App() {
  return (
    <>
      <Router>
        <Userroute />
      </Router>
      <ToastContainer position="top-center" />
    </>
  );
}
// https://github.com/MehraDevesh2022/MERN-Ecommerce-CricketWeapon-Store
export default App;
