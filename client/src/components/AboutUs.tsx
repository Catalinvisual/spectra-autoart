import React from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollAnimation } from '../hooks/useAnimations'
import './AboutUs.css'

const AboutUs: React.FC = () => {
  const { t } = useTranslation()
  const [setAnimationElement] = useScrollAnimation()

  return (
    <section id="about-us" className="about-us-section" ref={setAnimationElement}>
      <div className="container">
        <div className="about-us-content">
          <h2 className="about-us-title">{t('aboutUsTitle')}</h2>
          <p className="about-us-description">
            {t('aboutUsDescription')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutUs