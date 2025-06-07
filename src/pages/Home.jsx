// import { useState } from 'react'
// import './App.css'
import Loader from '../Component/Loader'
import Counter from '../Component/Counter'
import Hero from '../Component/Hero'
import Showcase from '../Component/Showcase'
import Projects from '../Component/Projects'
import Button from '../Component/Button'
import About from '../Component/About'
import Testimonials from '../Component/Testimonials'
import Navbar from '../Component/Navbar'
import Service from '../Component/Service'
import Process from '../Component/Process'
import Why from '../Component/Why'
import Footer from '../Component/Footer'
import ScrollToTopButton from '../Component/ScrollToTopButton'
import LocomotiveScroll from 'locomotive-scroll';



function Home() {


  return (
    <div className='bg-[#1e110a] overflow-x-hidden'>

     <ScrollToTopButton/>
    
     <Loader/>
       <Navbar/>
       <Hero/>

   
       
       <About/> 
      {/* <Showcase/>  */}
       <Projects/>
       
       <Process/>
       <Service/>
       <Why/>
       <Testimonials/>
       <Footer/>
       {/* <Button/>

      {/* <Counter/> */}

    </div>
  )
}

export default Home
