import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

/* A */
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white h-screen flex flex-col justify-center items-center text-center">
      <div className="home-container"> 
        <h1 className="text-5xl font-bold text-pink-600 mb-4">KWI BOOTH</h1> 
        <p className="text-lg text-gray-700 mb-6">
          Welcome to photobooth! Lets make memories!.
        </p>     
        <div style={{ height: "20px" }}></div>

        <img src="/photobooth-strip.png" alt="photobooth strip" className="photobooth-strip"/>
        
        <button onClick={() => navigate("/welcome")} className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition">
          START
        </button>

        <footer className="mt-8 text-sm text-gray-600">
        </footer>
      </div>
    </div>
    );
  };

export default Home;
