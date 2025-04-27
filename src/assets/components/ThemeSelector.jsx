import React, { useState, useRef } from 'react';
import { GrSystem } from 'react-icons/gr';
import { MdOutlineLightMode, MdDarkMode } from 'react-icons/md';

const ThemeSelector = ({ theme, setTheme }) => {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 50); // 200ms delay
    };

    return (
        <div className="mt-4 mb-6 relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="inline-block relative">
                {/* Button */}
                <button
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-lg flex items-center"
                >
                    {theme === 'system' ? <GrSystem /> : theme === 'light' ? <MdOutlineLightMode /> : <MdDarkMode />}
                    <span className="ml-2">
                        {theme === 'system' ? 'System Default' : theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>

                {/* Dropdown */}
                <div
                    className={`
    absolute mt-2 left-1/2 transform -translate-x-1/2 
    min-w-[12rem] bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg 
    transition-all duration-300 ease-in-out z-50
    ${open ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}
  `}
                >
                    <button
                        onClick={() => { setTheme('system'); setOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 rounded-t-lg"
                    >
                        <GrSystem /> System Default
                    </button>
                    <button
                        onClick={() => { setTheme('light'); setOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
                    >
                        <MdOutlineLightMode /> Light Mode
                    </button>
                    <button
                        onClick={() => { setTheme('dark'); setOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 rounded-b-lg"
                    >
                        <MdDarkMode /> Dark Mode
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ThemeSelector;
