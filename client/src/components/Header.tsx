import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import languageIcon from '../assets/language.svg'
import spectraHeader from '../assets/spectra-header.svg'
import './Header.css'

const Header = () => {
  const { t } = useTranslation()
  const { setLanguage } = useLanguage()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const languages = [
    { code: 'nl', name: 'Nederlands' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pl', name: 'Polski' },
    { code: 'ro', name: 'Română' }
  ]

  const handleLanguageChange = async (languageCode: string) => {
    await setLanguage(languageCode)
    setIsMenuOpen(false)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const navigateToAdmin = () => {
    navigate('/admin')
    setIsMobileMenuOpen(false)
  }



  return (
    <header className="header">
      <nav className="nav">
        <div className="logo" onClick={() => scrollToSection('hero')} style={{ cursor: 'pointer' }}>
          <img 
            src={spectraHeader} 
            alt="Spectra AutoArt" 
            className="logo-image"
            style={{ height: '40px', width: 'auto' }}
          />
        </div>
        
        {/* Hamburger menu button */}
        <button 
          className="hamburger-menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
        
        {/* Desktop nav links */}
        <div className="nav-links desktop-nav">
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('services')}
          >
            {t('ourServices')}
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('about-us')}
          >
            {t('aboutUs')}
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('gallery')}
          >
            {t('gallery')}
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('testimonials')}
          >
            {t('testimonials')}
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('contact')}
          >
            {t('contact')}
          </button>
          
          <button 
            className="nav-link admin-link"
            onClick={navigateToAdmin}
          >
            Admin
          </button>
        </div>
        
        {/* Language selector - visible on both desktop and mobile */}
        <div className="language-selector-container">
          <button 
            className="language-selector-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Select language"
          >
            <img 
              src={languageIcon} 
              alt="Language" 
              className="language-icon"
              width="24"
              height="24"
            />
            <span className={`arrow ${isMenuOpen ? 'up' : 'down'}`}></span>
          </button>
          
          {isMenuOpen && (
            <div className="language-dropdown">
              {Array.isArray(languages) && languages.map((lang) => (
                <button
                  key={lang.code}
                  className="language-option"
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-nav-links">
            <button 
              className="mobile-nav-link" 
              onClick={() => scrollToSection('services')}
            >
              {t('ourServices')}
            </button>
            <button 
              className="mobile-nav-link" 
              onClick={() => scrollToSection('about-us')}
            >
              {t('aboutUs')}
            </button>
            <button 
              className="mobile-nav-link" 
              onClick={() => scrollToSection('gallery')}
            >
              {t('gallery')}
            </button>
            <button 
              className="mobile-nav-link" 
              onClick={() => scrollToSection('testimonials')}
            >
              {t('testimonials')}
            </button>
            <button 
              className="mobile-nav-link" 
              onClick={() => scrollToSection('contact')}
            >
              {t('contact')}
            </button>
            
            <button 
              className="mobile-nav-link admin-link"
              onClick={navigateToAdmin}
            >
              Admin
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header