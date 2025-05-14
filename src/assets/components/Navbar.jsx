import { useState, useEffect } from 'react';
import Animation1 from './Animation1'
import ThemeSelector from './ThemeSelector'
const Navbar = () => {
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
        <div className='mt-5 flex items-center gap-[30vw] justify-between'>
            <div className="flex items-center justify-center">
            <h1 className="text-4xl !text-[#481BC3] font-bold">GloNeuro</h1>
            <div className="flex items-center justify-center scale-125">
                <Animation1 />
            </div>
            </div>
            {/* Pass theme and setTheme as props to ThemeSelector */}
            <ThemeSelector theme={theme} setTheme={setTheme} />

        </div>
    )
}

export default Navbar
