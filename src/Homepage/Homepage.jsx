import React from 'react'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import MenuSection from './MenuSection'
import AnalyticsSection from './About'
import About from './About'
import FuelBanner from './FuelBanner'

import Footer from './Footer'
import Navbar from './Navbar'
import DemoVideoSection from './DemoVideoSection'

function Homepage() {
  return (
  <>
  <Navbar/>
  <HeroSection/>
    <MenuSection/>
    <About/>
    <FuelBanner/>
  <FeaturesSection/>
  <DemoVideoSection/>
<Footer/>
  </>
  )
}

export default Homepage