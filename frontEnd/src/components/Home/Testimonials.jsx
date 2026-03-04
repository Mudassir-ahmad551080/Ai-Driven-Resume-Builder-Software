import React from 'react'
import { BookUserIcon } from 'lucide-react'
import Title from '../Home/Title.jsx'
import Test from './Test.jsx'
import { useTheme } from '../../context/ThemContext.jsx'

const Testimonials = () => {
  const [theme] = useTheme();
  return (
    <div id={theme}>
       <section 
      id="testimonials" 
      className="w-full flex flex-col items-center justify-center text-center py-16 px-4 sm:px-6 lg:px-8  "
    >
      {/* Section Label */}
      <div id={theme} className="flex items-center gap-2 mb-6 text-sm font-medium text-green-700 dark:text-green-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-green-700 rounded-full px-4 py-1.5">
        <BookUserIcon className="w-4 h-4" />
        <span>Testimonials</span>
      </div>

      {/* Title and Description */}
      <Title
        title="Dont just take our word."
        description="Hear from our satisfied clients who share their experiences, success stories, and the positive impact our platform has made on their work."
      />
      <Test/>
    </section>
    </div>
  )
}

export default Testimonials
