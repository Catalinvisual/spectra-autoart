import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import './LegalPageLayout.css'

interface LegalPageLayoutProps {
  children: React.ReactNode
  pageKey: string // Key for i18n translations (e.g., 'termsAndConditions', 'privacyPolicy', etc.)
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ children }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/')
  }



  return (
    <div className="legal-page">
      <div className="legal-container">
        <button className="legal-close-button" onClick={handleClose} aria-label={t('close', 'Închide')}>
          ✕
        </button>
        
        {children}
      </div>
    </div>
  )
}

export default LegalPageLayout