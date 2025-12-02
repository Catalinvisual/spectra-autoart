import React from 'react'
import { useTranslation } from 'react-i18next'
import CloseButton from '../components/CloseButton'
import './LegalPages.css'

const TermsConditions: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="legal-page">
      <CloseButton />
      <div className="legal-container">
        <h1>{t('termsConditions.title')}</h1>
        <p className="last-updated">{t('termsConditions.lastUpdated')}</p>
        
        <section>
          <h2>{t('termsConditions.section1.title')}</h2>
          <p>{t('termsConditions.section1.content')}</p>
        </section>

        <section>
          <h2>{t('termsConditions.section2.title')}</h2>
          <p>{t('termsConditions.section2.content')}</p>
        </section>

        <section>
          <h2>{t('termsConditions.section3.title')}</h2>
          <p>{t('termsConditions.section3.content')}</p>
        </section>

        <section>
          <h2>{t('termsConditions.section4.title')}</h2>
          <p>{t('termsConditions.section4.content')}</p>
        </section>

        <section>
          <h2>{t('termsConditions.section5.title')}</h2>
          <p>{t('termsConditions.section5.content')}</p>
        </section>

        <section>
          <h2>{t('termsConditions.section6.title')}</h2>
          <p>{t('termsConditions.section6.content')}</p>
        </section>

        <section>
          <h2>{t('termsConditions.section7.title')}</h2>
          <p>{t('termsConditions.section7.content')}</p>
        </section>

        <section>
          <h2>{t('termsConditions.section8.title')}</h2>
          <p>{t('termsConditions.section8.content')}</p>
        </section>

        <section>
          <h2>{t('termsConditions.section9.title')}</h2>
          <p>{t('termsConditions.section9.content')}</p>
        </section>

        <section>
          <h2>{t('termsConditions.section10.title')}</h2>
          <p>{t('termsConditions.section10.content')}</p>
        </section>

        <section>
          <h2>{t('termsConditions.section11.title')}</h2>
          <p>{t('termsConditions.section11.content')}</p>
        </section>

        <section className="contact-info">
          <h2>{t('termsConditions.contact.title')}</h2>
          <p>{t('termsConditions.contact.content')}</p>
          <div className="contact-details">
            <p><strong>{t('termsConditions.contact.companyName')}</strong></p>
            <p>{t('termsConditions.contact.address')}</p>
            <p>{t('termsConditions.contact.email')}</p>
            <p>{t('termsConditions.contact.phone')}</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TermsConditions