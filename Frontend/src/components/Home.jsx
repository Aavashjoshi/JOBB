import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './Herosection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'

const Home = () => {
  return (
    <div>
      
        <Navbar/>
        <HeroSection/>
        <CategoryCarousel/>
       <LatestJobs/>
         <Footer/> 

      
    </div>
  )
}

export default Home