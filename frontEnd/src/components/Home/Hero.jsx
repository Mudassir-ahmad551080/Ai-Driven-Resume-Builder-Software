import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemContext';
import { RiMoonClearFill } from "react-icons/ri";
import { IoSunnyOutline } from "react-icons/io5";
import logo from '../../../public/logo.svg';
import { ReactTyped } from "react-typed";
import { useSelector } from 'react-redux';
const Hero = () => {
    // State for the mobile menu visibility
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useSelector(state => state.auth);
    // ⭐ New State for the smart navbar logic ⭐
    // State to control the visibility/positioning of the Navbar
    const [showNavbar, setShowNavbar] = useState(true);
    // State to store the previous scroll position
    const [lastScrollY, setLastScrollY] = useState(0);

    // ⭐ New Effect Hook to handle the scroll event ⭐
    useEffect(() => {
        const handleScroll = () => {
            // Check if scrolling UP (current scroll < last scroll)
            // The check window.scrollY > 50 prevents the navbar from snapping 
            // to 'hidden' immediately when the page loads or at the very top.
            if (window.scrollY < lastScrollY && window.scrollY > 50) {
                // Scrolling up: show the navbar (sticky)
                setShowNavbar(true);
            }
            // Check if scrolling DOWN (current scroll > last scroll)
            else if (window.scrollY > lastScrollY) {
                // Scrolling down: hide the navbar (let it scroll out of view)
                setShowNavbar(false);
            }
            // If at the very top (or near it), always show the navbar
            else if (window.scrollY <= 50) {
                setShowNavbar(true);
            }

            // Update the last scroll position for the next comparison
            setLastScrollY(window.scrollY);
        };

        // Attach the event listener when the component mounts
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]); // Dependency array ensures we use the latest lastScrollY value

    //light theme and dark theme functionality is yet to be added
    const [theme, setTheme] = useTheme();
    let clutter = 0;

    function handleChange() {
        if (clutter == 0) {
            setTheme((preve) => (preve === 'ligth' ? 'dark' : 'ligth'));
            // clutter=1;
        }
        else {
            setTheme(<img src={face} />);
            // clutter=0;
        }
    }

    const logos = [
        'https://i.pinimg.com/736x/9e/ab/c5/9eabc54fbe3cd7a6931695dcce52cc82.jpg',
        'https://i.pinimg.com/736x/fa/76/9b/fa769ba2fd25c9bdd269a736e0942218.jpg',
        'https://i.pinimg.com/736x/89/6c/5b/896c5bae8a9ef75618c6f6969a4248cd.jpg',
        'https://i.pinimg.com/736x/a0/b2/b7/a0b2b766778a7a2357019d2e9a5fd4a5.jpg',
        'https://i.pinimg.com/1200x/f4/22/30/f42230e621c19fea5815dde7a09ed83c.jpg',
    ];

    // Tailwind classes for the smart navbar effect
    const navbarClasses = `
        z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm 
        transition-all duration-300 ease-in-out 
        fixed top-0 bg-white/60 backdrop-blur-sm shadow-md
        ${showNavbar ? 'translate-y-0' : '-translate-y-full'}
    `;

    return (
        <div>
            <div id={theme} className="min-h-screen ">
                {/* Navbar */}
                {/* 🎯 Updated the class name to use the dynamic navbarClasses */}
                <nav id={theme} className={`${navbarClasses} border-b `}>
                    {
                        theme === 'ligth' ? <div><img src={logo} alt="" /></div> : <div className="flex gap-1 text-center items-center justify-center">
                            <h1 className="text-2xl font-semibold">resume</h1> <span className="bg-green-400 rounded-full mt-3 h-2 w-2"></span>
                        </div>
                    }

                    <div id={theme} className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                        <a href="#" className="hover:text-green-600 transition">Home</a>
                        <a href="#features" className="hover:text-green-600 transition">Features</a>
                        <a href="#testimonials" className="hover:text-green-600 transition">Testimonials</a>
                        <a href="#cta" className="hover:text-green-600 transition">Contact</a>
                    </div>

                    <div id={theme} className="flex gap-2">
                        {user ? (
                            // ✅ If logged in, show Dashboard button
                            <Link to='/app?state=register' className="hidden md:block px-6 py-2 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white">
                                Dashboard
                                </Link>
                        ) : (
                            // ✅ If not logged in, show Get Started + Login buttons
                            <>
                                <Link to='/app?state=register' className="hidden md:block px-6 py-2 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white">
                                    Get started
                                </Link>
                                <Link id={theme} to='/app?state=login' className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900">
                                    Login
                                </Link>
                            </>
                        )}

                    </div>
                    <div onClick={handleChange} id={theme} className='cursor-pointer mr-4 md:mr-0'>
                        {theme === 'ligth' ? (<IoSunnyOutline className="text-2xl" height={20} width={20} />) : (<RiMoonClearFill className="text-2xl" height={40} width={40} />)}
                    </div>

                     {
                        user ? (
                            <Link to='/app?state=register' className="md:hidden px-3 py-1 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white">
                                Dashboard
                            </Link>
                        ):(
                            <Link id={theme} to='/app?state=login' className=" md:hidden px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900">
                                    Login
                      </Link>
                        )
                     }
                    

                    <button onClick={() => setMenuOpen(true)} className="md:hidden active:scale-90 transition" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-menu" >
                            <path d="M4 5h16M4 12h16M4 19h16" />
                        </svg>
                    </button>
                </nav>

                {/* To ensure the content doesn't jump, you need a spacer element 
                    that is the same height as the fixed navbar. 
                    Alternatively, add padding-top to the main content container. 
                */}
                <div id={theme} className="pt-20"></div> {/* Adjust this pt-XX to match your navbar's height */}

                {/* Mobile Menu (No changes needed here) */}
                <div id={theme} className={`fixed inset-0 z-[100] bg-green-500 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`} >
                    <a onClick={() => setMenuOpen(false)} href="#" className="text-white">Home</a>
                    <a onClick={() => setMenuOpen(false)} href="#features" className="text-white">Features</a>
                    <a onClick={() => setMenuOpen(false)} href="#testimonials" className="text-white">Testimonials</a>
                    <a onClick={() => setMenuOpen(false)} href="#contact" className="text-white">Contact</a>
                    <button onClick={() => setMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-green-600 hover:bg-green-700 transition text-white rounded-md flex" >
                        X
                    </button>
                    
                </div>

                {/* Hero Section */}
                <div id={theme} className="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black">
                    <div id={theme} className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-green-300 blur-[100px] opacity-30"></div>

                    {/* Avatars + Stars */}
                    <div className="flex items-center mt-24">
                        <div className="flex -space-x-3 pr-3">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[1]" />
                            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user1" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2" />
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user2" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[3]" />
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[4]" />
                            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="user5" className="size-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[5]" />
                        </div>

                        <div>
                            <div className="flex ">
                                {Array(5).fill(0).map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-transparent fill-green-600" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                                ))}
                            </div>
                            <p id={theme} className="text-sm text-gray-700">
                                Used by 10,000+ users
                            </p>
                        </div>
                    </div>

                    {/* Headline + CTA */}
                    <h1
                        id={theme}
                        className="text-5xl  flex flex-col md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px]"
                    >
                        Land Your Dream Job With{" "}
                        <span className="bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent whitespace-nowrap">
                            <ReactTyped
                                className='text-3xl md:text-5xl font-semibold'
                                strings={["AI-Powered Resume", "Smart Resume", "Next-Gen Resume"]}
                                typeSpeed={60}
                                backSpeed={40}
                                loop
                            />
                        </span>
                    </h1>

                    <p className="max-w-md text-center text-base my-7">Create edit Update and download Your resume with AI Powered assistant... </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center  gap-4 ">
                        <Link to='/app' className="bg-green-500 hover:bg-green-600 text-white rounded-full md:px-9 md:h-12 px-4 h-9 m-1 ring-offset-2 ring-1 ring-green-400 flex items-center transition-colors">
                            Create Resume
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1 size-4" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </Link>
                        <button id={theme} className="flex items-center gap-2 border border-slate-400 hover:bg-green-50 transition rounded-full md:px-7 m:h-12 px-4 h-10 text-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video size-5" aria-hidden="true"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
                            <span>Try demo</span>
                        </button>
                    </div>

                    <p id={theme} className="py-6 text-slate-600 mt-14">Trusting by leading brands, including</p>

                    <div className="flex flex-wrap justify-between max-sm:justify-center gap-6 max-w-3xl w-full mx-auto py-4" id="logo-container">
                        {logos.map((logo, index) => <img key={index} src={logo} alt="logo" className="md:h-10 rounded-full h-8 w-auto max-w-xs" />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;