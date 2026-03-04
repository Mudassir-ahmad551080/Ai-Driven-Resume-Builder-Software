import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemContext";
import { RiMoonClearFill } from "react-icons/ri";
import { IoSunnyOutline } from "react-icons/io5";
import logo from '../../public/logo.svg';
import { logout } from "../app/features/authSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [theme] = useTheme()
  // const [theme,setTheme] = useTheme();

  // let clutter = 0;

  //  function handleChange() {
  //   if (clutter == 0) {
  //     setTheme((preve) => (preve === 'ligth' ? 'dark' : 'ligth'));
  //     // clutter=1;
  //   }
  //   else {
  //     setTheme(<img src={face} />);
  //     // clutter=0;
  //   }
  // }

  const logOutUser = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header id={theme} className="bg-white/90 shadow-md w-full  sticky top-0 z-50">
      <nav id={theme} className="max-w-7xl mx-auto flex flex-wrap justify-between items-center px-4 md:px-8 py-3">
        {/* Left Section - Logo */}
        <Link id={theme} to="/" className="flex items-center gap-2">
          {theme === 'ligth' ? <div><img src={logo} alt="" /></div> : <div className="flex gap-1 text-center items-center justify-center">
            <h1 className="text-3xl">resume</h1> <span className="bg-green-400 rounded-full mt-3 h-2 w-2"></span>
          </div>}
        </Link>
        <Link
         className="md:mt-0 mt-2"
          to="/analyze-resume"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 22px",
            background: "linear-gradient(135deg, #818cf8, #6366f1)",
            borderRadius: "10px",
            fontFamily: "'Syne', sans-serif",
            fontSize: "14px",
            fontWeight: "700",
            color: "#fff",
            textDecoration: "none",
            letterSpacing: "0.4px",
            transition: "opacity 0.2s, transform 0.15s",
          }}
          onMouseOver={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseOut={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          {/* Document icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Analyze Resume
        </Link>


        {/* functionality for the theme toggle button is incomplete. */}
        {/* <div  onClick={handleChange} id={theme} className='md:ml-80 ml-0  mt-2 md:mt-0 cursor-pointer'>
            {theme === 'ligth' ? (<IoSunnyOutline className="text-2xl"  height={20} width={20}/>) : (<RiMoonClearFill className="text-2xl"  height={40} width={40}/>)}
          </div> */}

        {/* Right Section - User Info and Logout */}
        <div id={theme} className="flex items-center gap-4 mt-3 sm:mt-0 flex-wrap">
          <p id={theme} className="text-gray-700 text-sm sm:text-base">
            Hi, <span id={theme} className="font-medium">{user?.name}</span>
          </p>
          <button
            onClick={logOutUser}
            className="bg-transparent border text-sm sm:text-base px-2 py-1 rounded-full "
          >
            Logout
          </button>
        </div>
      </nav>
      <hr />
    </header>
  );
};

export default Navbar;
