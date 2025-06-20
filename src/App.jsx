import { useEffect, useRef } from 'react';
import Posts from './assets/components/Posts';
import './App.css';
import './Cursor.css';
import '@lottiefiles/lottie-player';
import BrainNetwork from './assets/components/BrainNetwork';
import Navbar from './assets/components/Navbar';
import { gsap } from 'gsap';

function App() {
  const cursorRef = useRef(null);
  const mainRef = useRef(null);

  return (
    <>
      <div id="cursor" ref={cursorRef}></div>
      <div className="navbar px-5 border-[#bab4b489] bg-[#ffffff58] dark:border-[#17161689] dark:bg-[#10101058]">
        <Navbar />
      </div>
      <div
        id="main"
        ref={mainRef}
        className="pt-[16vh] flex flex-col items-center justify-center min-h-screen w-full bg-gray-200 dark:bg-black text-black dark:text-white transition-colors duration-500"
      >
        <BrainNetwork />
        {/* Posts */}
        <Posts ref = {cursorRef} ref2={mainRef}  />
      </div>
    </>
  );
}

export default App;
