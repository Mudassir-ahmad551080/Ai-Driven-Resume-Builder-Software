import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemContext'
import logo from '../../../public/logo.svg'

const Footer = () => {
  const [theme] = useTheme();
  return (
    <footer id={theme} className=" dark:from-green-300 dark:via-green-200 dark:to-green-300 text-slate-800 dark:text-slate-200 py-16 px-6 sm:px-12 lg:px-24 border-t border-green-300 dark:border-green-200">
      <div id={theme} className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
        {/* Left: Logo & Intro */}
        <div id={theme} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <Link id={theme} to="/" className="w-40">
              {theme === 'ligth' ? <div><img src={logo} alt="" /></div>:<div className="flex gap-1 text-center items-center justify-center">
                 <h1 className="text-3xl">resume</h1> <span className="bg-green-400 rounded-full mt-3 h-2 w-2"></span>
              </div>}
          </Link>
          <p id={theme} className="max-w-sm text-sm text-slate-700 dark:text-slate-400 leading-relaxed">
            Making every customer feel valued — no matter the size of your audience.
          </p>
          <div id={theme} className="flex items-center gap-4 mt-2">
            {/* Social Icons */}
            {[
              { href: 'https://dribbble.com/prebuiltui', icon: 'dribbble' },
              { href: 'https://www.linkedin.com/company/prebuiltui', icon: 'linkedin' },
              { href: 'https://x.com/prebuiltui', icon: 'twitter' },
              { href: 'https://www.youtube.com/@prebuiltui', icon: 'youtube' }
            ].map((item) => (
              <a
               id={theme}
                key={item.icon}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className=" text-black  transition"
              >
                <i id={theme} className={`fa-brands fa-${item.icon} text-lg`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Footer Links */}
        <div id={theme} className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
          <div>
            <p id={theme} className="font-semibold text-black mb-3">Product</p>
            <ul className="space-y-2">
              <li><Link id={theme} to="/" className="hover:text-green-600 text-black transition">Home</Link></li>
              <li><Link id={theme} to="/" className="hover:text-green-600 text-black transition">Support</Link></li>
              <li><Link id={theme} to="/" className="hover:text-green-600 text-black transition">Pricing</Link></li>
              <li><Link id={theme} to="/" className="hover:text-green-600 text-black transition">Affiliate</Link></li>
            </ul>
          </div>
          <div>
            <p id={theme} className="font-semibold text-black mb-3">Resources</p>
            <ul className="space-y-2">
              <li><Link id={theme} to="/" className="hover:text-green-600 text-black transition">Company</Link></li>
              <li><Link id={theme} to="/" className="hover:text-green-600 text-black transition">Blogs</Link></li>
              <li><Link id={theme} to="/" className="hover:text-green-600 text-black transition">Community</Link></li>
              <li>
                <Link id={theme} to="/" className="hover:text-green-600 text-black transition flex items-center gap-1">
                  Careers
                  <span id={theme} className="text-xs   rounded-md px-2 py-[1px]">
                    We’re hiring!
                  </span>
                </Link>
              </li>
              <li><Link id={theme} to="/" className="hover:text-green-600 text-black transition">About</Link></li>
            </ul>
          </div>
          <div>
            <p id={theme} className="font-semibold text-black mb-3">Legal</p>
            <ul className="space-y-2">
              <li><Link id={theme} to="/" className="hover:text-green-600 text-black transition">Privacy</Link></li>
              <li><Link id={theme} to="/" className="hover:text-green-600 text-black transition">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider + Bottom Section */}
      <div className="border-t border-green-300 dark:border-green-700 mt-12 pt-6 text-center text-sm text-slate-700 dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} <Link to="/" className="hover:text-green-600 transition font-medium">Resume Builder</Link>. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
