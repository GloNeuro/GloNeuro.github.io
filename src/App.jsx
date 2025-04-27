import { useState, useEffect } from 'react';
import Posts from './assets/components/Posts';
import Animation1 from './assets/components/Animation1';
import './App.css';
import '@lottiefiles/lottie-player';

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
      
      {/* Theme Toggle Button */}
      <div className="mt-4 mb-6">
        <button
          onClick={() => setTheme('dark')}
          className={`px-6 py-2 rounded-full mr-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}
        >
          Dark Mode
        </button>
        <button
          onClick={() => setTheme('light')}
          className={`px-6 py-2 rounded-full mr-2 ${theme === 'light' ? 'bg-gray-700' : 'bg-gray-300'}`}
        >
          Light Mode
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`px-6 py-2 rounded-full ${theme === 'system' ? 'bg-gray-700' : 'bg-gray-300'}`}
        >
          System Default
        </button>
      </div>

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
