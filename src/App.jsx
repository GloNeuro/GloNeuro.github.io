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
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-200 dark:bg-black text-black dark:text-white transition-colors duration-500">
      
      <Navbar/>
      
      <BrainNetwork/>
      {/* Header */}
      

      {/* Posts */}
      <div className="scroll-down"></div>
      <Posts />
    </div>
  );
}

export default App;
