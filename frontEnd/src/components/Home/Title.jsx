import React from 'react'
import { useTheme } from '../../context/ThemContext'

const Title = ({ title, description }) => {
  const [theme] = useTheme();
  return (
    <div id={theme} className="text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h2 id={theme} className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 text-gray-800 tracking-tight mb-3">
        {title}
      </h2>
      <p  id={theme} className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export default Title
