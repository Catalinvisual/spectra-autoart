import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { resources } from '../i18n'
import { publicAPI } from '../services/api'
import './Footer.css'

const Footer = () => {
  const { t, i18n } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [language, setLanguage] = useState(i18n.language)
  const [renderKey, setRenderKey] = useState(0) // Force re-render key

  // Force load Romanian resources on mount and language change
  useEffect(() => {
    if (i18n.language === 'ro') {
      console.log('🔍 Footer - Ensuring Romanian resources are loaded...')
      if (!i18n.hasResourceBundle('ro', 'translation')) {
        const roResources = (resources as any)?.ro?.translation || {}
        console.log('🔍 Footer - Loading Romanian resources:', Object.keys(roResources).length, 'keys')
        i18n.addResourceBundle('ro', 'translation', roResources, true, true)
      }
      // Force re-render after loading resources
      setRenderKey(prev => prev + 1)
    }
  }, [i18n.language])

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng)
      setRenderKey(prev => prev + 1) // Force React re-render
      // Reset message when language changes to show translated text
      if (message) {
        setMessage('')
      }
      
      // Load Romanian resources if needed
      if (lng === 'ro') {
        console.log('🔍 Footer - Language changed to Romanian, loading resources...')
        if (!i18n.hasResourceBundle('ro', 'translation')) {
          const roResources = (resources as any)?.ro?.translation || {}
          i18n.addResourceBundle('ro', 'translation', roResources, true, true)
        }
      }
    }
    
    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n, message, language]) // Include language in dependencies to use it

  const tf = (key: string, fallback: string) => {
    // Force load Romanian resources if needed
    if (i18n.language === 'ro' && !i18n.hasResourceBundle('ro', 'translation')) {
      console.log('🔍 Footer - Loading Romanian resources...')
      const roResources = (resources as any)?.ro?.translation || {}
      i18n.addResourceBundle('ro', 'translation', roResources, true, true)
    }
    
    const v = t(key)
    console.log(`🔍 Footer tf() - key: ${key}, translation: ${v}, fallback: ${fallback}, currentLang: ${i18n.language}`)
    console.log(`🔍 Footer tf() - Has RO bundle: ${i18n.hasResourceBundle('ro', 'translation')}`)
    
    // Check if translation exists by looking directly in resources
    const currentLang = i18n.language
    const translationExists = currentLang === 'ro' && (resources as any)?.ro?.translation?.[key]
    
    if (translationExists) {
      return translationExists
    }
    
    // Fallback to i18n translation or provided fallback
    return v === key ? fallback : v
  }

  // Debug log for current language and translations
  useEffect(() => {
    console.log(`🌍 Footer current language: ${i18n.language}`)
    console.log(`🌍 Footer newsletter translation: ${t('footer.newsletter')}`)
    console.log(`🌍 Footer subscribeNewsletter translation: ${t('subscribeNewsletter')}`)
    console.log(`🌍 Footer enterEmail translation: ${t('footer.enterEmail')}`)
    console.log(`🌍 Footer send translation: ${t('footer.send')}`)
  }, [language, i18n])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage(tf('footer.enterEmail', 'Introduceți adresa dvs. de email'))
      return
    }

    try {
      setLoading(true)
      const response = await publicAPI.subscribeNewsletter({ email, locale: i18n.language })
      setMessage(response.data.message || t('newsletterSubscribeSuccess') || 'Thank you for subscribing!')
      setEmail('')
    } catch (error: unknown) {
      let errMsg = 'Failed to subscribe'
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const resp = (error as { response?: { data?: { error?: string } } }).response
        errMsg = resp?.data?.error || errMsg
      }
      setMessage(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer" key={renderKey}>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Spectra AutoArt</h3>
          <p>{t('footer.description')}</p>
          <div className="social-links">
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.992"/>
              </svg>
            </a>
            <a href="https://instagram.com/spectraautoart" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>{tf('footer.quickLinks', 'Link-uri Rapide')}</h3>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('services') }}>
            {t('ourServices')}
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('about') }}>
            {t('aboutUs')}
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('gallery') }}>
            {t('gallery')}
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials') }}>
            {t('testimonials')}
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('contact') }}>
            {t('contact')}
          </a>
        </div>
        
        <div className="footer-section">
          <h3>{tf('footer.services', 'Servicii')}</h3>
          <a href="#">{tf('footer.autoDetailing', 'Detailing Auto')}</a>
          <a href="#">{tf('footer.chromeDelete', 'Chrome Delete')}</a>
          <a href="#">{tf('footer.ceramicCoating', 'Protecție Ceramică')}</a>
          <a href="#">{tf('footer.paintProtection', 'Protecție Vopsea')}</a>
          <a href="#">{tf('footer.interiorCleaning', 'Curățare Interior')}</a>
        </div>
        
        <div className="footer-section">
          <h3>{tf('footer.newsletter', 'Newsletter')}</h3>
          <p>{t('subscribeNewsletter')}</p>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder={tf('footer.enterEmail', 'Introduceți adresa dvs. de email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? '...' : tf('footer.send', 'Trimite')}
            </button>
          </form>
          {message && <div className="newsletter-message">{message}</div>}
        </div>
      </div>
      
      <div className="footer-legal">
        <div className="legal-links">
          <Link to="/terms">{t('footer.terms')}</Link>
          <Link to="/privacy">{t('footer.privacy')}</Link>
          <Link to="/cookies">{t('footer.cookies')}</Link>
          <Link to="/contact-legal">{t('footer.contact')}</Link>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Spectra AutoArt. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
