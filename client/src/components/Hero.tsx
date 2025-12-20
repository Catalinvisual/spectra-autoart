import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollAnimation, useSequentialHeroAnimation } from '../hooks/useAnimations'
import CinematicBackground from './CinematicBackground'
import './Hero.css'

interface HeroProps {
  onBookNow: () => void
}

const Hero: React.FC<HeroProps> = ({ onBookNow }) => {
  const { t, ready, i18n } = useTranslation()
  const [setHeroElement] = useScrollAnimation()
  
  const {
    titleVisible,
    titleText,
    subtitleText,
    descriptionVisible,
    buttonVisible,
    setTitleElement,
    setSubtitleElement,
    setDescriptionElement,
    setButtonElement
  } = useSequentialHeroAnimation(
    'Spectra AutoArt',
    ready ? t('subtitle') : '',
    'We transform cars into works of art with premium detailing and styling services!'
  )

  const handleBookNow = () => {
    onBookNow()
  }

  // Reinitialize animation when language changes
  const [animationKey, setAnimationKey] = useState(0)
  
  useEffect(() => {
    if (ready && i18n.language) {
      setAnimationKey(prev => prev + 1)
    }
  }, [i18n.language, ready])

  return (
    <section id="hero" className="hero" ref={setHeroElement} key={animationKey}>
      <CinematicBackground 
        gradientColors={['#0a0a0f', '#1a1a2e', '#16213e', '#0f0f1a']}
        enableParticles={true}
        enableLightEffects={true}
      />
      
      <div className="hero-content">
        <h1 className={`hero-title ${titleVisible ? 'visible' : ''}`} ref={setTitleElement}>
          <span className="title-main">
            {titleText.includes('AutoArt') ? (
              <>
                {titleText.split(' AutoArt')[0]}
                <span className="title-highlight"> AutoArt</span>
              </>
            ) : (
              titleText
            )}
          </span>
        </h1>
        <p className={`hero-subtitle ${subtitleText ? 'visible' : ''}`} ref={setSubtitleElement}>
          {subtitleText}
          <span className="cursor">|</span>
        </p>
        <p className={`hero-description ${descriptionVisible ? 'visible' : ''}`} ref={setDescriptionElement}>
          {t('heroDescription')}
        </p>
        <button className={`cta-button ${buttonVisible ? 'visible' : ''}`} ref={setButtonElement} onClick={handleBookNow}>
          <span className="button-text">{t('bookNow')}</span>
          <span className="button-icon">→</span>
        </button>
      </div>
      
      {/* Gradient orbs rămân pentru efect adițional */}
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
    </section>
  )
}

export default Hero