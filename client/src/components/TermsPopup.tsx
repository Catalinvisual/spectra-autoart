import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './TermsPopup.css'

const TermsPopup: React.FC = () => {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasAccepted = localStorage.getItem('termsAccepted')
    if (!hasAccepted) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('termsAccepted', 'true')
    setIsVisible(false)
  }

  const handleDecline = () => {
    window.location.href = 'https://google.com'
  }

  if (!isVisible) return null

  return (
    <div className="terms-popup-overlay">
      <div className="terms-popup">
        <div className="terms-popup-header">
          <h3>{t('termsPopup.title')}</h3>
        </div>
        <div className="terms-popup-content">
          <p>{t('termsPopup.description')}</p>
          <div className="terms-links">
            <Link to="/terms" target="_blank">{t('footer.terms')}</Link>
            <Link to="/privacy" target="_blank">{t('footer.privacy')}</Link>
            <Link to="/cookies" target="_blank">{t('footer.cookies')}</Link>
          </div>
        </div>
        <div className="terms-popup-buttons">
          <button onClick={handleDecline} className="btn-decline">
            {t('termsPopup.decline')}
          </button>
          <button onClick={handleAccept} className="btn-accept">
            {t('termsPopup.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsPopup