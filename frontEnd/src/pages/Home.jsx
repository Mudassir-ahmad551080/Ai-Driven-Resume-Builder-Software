import React from 'react'
import Banner from '../components/Home/Banner'
import Hero from '../components/Home/Hero'
import Features from '../components/Home/Features'
import Testimonials from '../components/Home/Testimonials'
import CallToaction from '../components/Home/CallToaction'
import Footer from '../components/Home/Footer'

const Home = () => {
  return (
    <div>
        <Banner/>
        <Hero/>
        <Features/>
        <Testimonials/>
        <CallToaction/>
        <Footer/>
    </div>
  )
}

export default Home