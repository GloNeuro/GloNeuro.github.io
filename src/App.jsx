// src/App.js

import { useState, useEffect } from 'react';
import Posts from './assets/components/Posts';
import Animation1 from './assets/components/Animation1';
import './App.css';
import '@lottiefiles/lottie-player';
import ThemeSelector from './assets/components/ThemeSelector'; // Updated import path for ThemeSelector

function App() {
  const [theme, setTheme] = useState('system'); // 'system', 'light', 'dark'

  // 1. Detect system preference and initialize theme
  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  // 2. Apply theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      // 'system' preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', 'system');
    }
  }, [theme]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-500">
      
      {/* Pass theme and setTheme as props to ThemeSelector */}
      <ThemeSelector theme={theme} setTheme={setTheme} />

      {/* Header */}
      <div className="grid grid-cols-2 gap-4">
        <div><h1 className="text-4xl font-bold">GloNeuro</h1></div>
        <div className="flex items-center justify-center scale-125">
          <Animation1 />
        </div>
      </div>

      {/* Posts */}
      <div className="scroll-down"></div>
      <Posts />
    </div>
  );
}

export default App;
