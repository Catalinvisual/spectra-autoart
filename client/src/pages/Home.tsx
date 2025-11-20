import React, { useState } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import AboutUs from '../components/AboutUs'
import Services from '../components/Services'
import Gallery from '../components/Gallery'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import RightRail from '../components/RightRail'
import BookingModal from '../components/BookingModal'
import './Home.css'

const Home: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const openBookingModal = () => {
    setIsBookingModalOpen(true)
  }

  const closeBookingModal = () => {
    setIsBookingModalOpen(false)
  }

  return (
    <div className="home-page">
      <Header />
      <Hero onBookNow={openBookingModal} />
      <AboutUs />
      
      <main className="main-content">
        <Services openBookingModal={openBookingModal} />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <RightRail />
      
      {/* Modalul de booking */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={closeBookingModal} 
      />
    </div>
  )
}

export default Home