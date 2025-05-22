// src/App.js
import { useState, useEffect } from 'react';
import Posts from './assets/components/Posts';
import './App.css';
import '@lottiefiles/lottie-player';
import ThemeSelector from './assets/components/ThemeSelector'; // Updated import path for ThemeSelector
import BrainNetwork from './assets/components/BrainNetwork';
import Navbar from './assets/components/Navbar';
function App() {

  return (
    <>
      <div className="navbar px-5 border-[#bab4b489] bg-[#ffffff58] dark:border-[#17161689] dark:bg-[#10101058]">
        <Navbar />
      </div>
      <div className="pt-[16vh] flex flex-col items-center justify-center min-h-screen w-full bg-gray-200 dark:bg-black text-black dark:text-white transition-colors duration-500">



        <BrainNetwork />
        {/* Header */}


        {/* Posts */}
        <div className="scroll-down"></div>
        <Posts />
      </div>

    </>
  );
}

export default App;
