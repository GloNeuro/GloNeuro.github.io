import { useRef, useState, useEffect } from 'react';
import Animation1 from './Animation1'
import ThemeSelector from './ThemeSelector'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';

const Navbar = () => {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#navi1",
                scroller: "body",
                start: "top 0%",
                end: "top 30%",
                scrub: 2,
                pin: true
            }
        });

        tl.to('#navi1', {
            '--gap-size': '30vw',
            duration: 1,
        });

        tl.to('#icon', {
            opacity: 1,
            y: 0,
            duration: 1
        }, "<");
    }, []);


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
        <div id="navi1" className='mt-5 flex items-center justify-center'>
            <div className="nav-part1 flex items-center justify-center">
                <div className="glo-icon h-[10vh] w-[10vw] flex justify-center items-center">
                    <img id="icon" className='icon' src="/gloneuro.png" />
                </div>
                <h1 className="text-4xl !text-[#481BC3] font-bold">GloNeuro</h1>
            </div>
            <div className="nav-part2 flex items-center justify-center">
                <div className="flex items-center justify-center scale-125">
                    <Animation1 />
                </div>
                <div className="flex items-center justify-center">
                    {/* Pass theme and setTheme as props to ThemeSelector */}
                    <ThemeSelector theme={theme} setTheme={setTheme} />
                </div>
            </div>
        </div>
    )
}

export default Navbar
