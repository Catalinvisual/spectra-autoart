import { useTranslation } from 'react-i18next'
import { useScrollAnimation, useTypingAnimation } from '../hooks/useAnimations'
import './Hero.css'

interface HeroProps {
  onBookNow: () => void
}

const Hero: React.FC<HeroProps> = ({ onBookNow }) => {
  const { t, ready } = useTranslation()
  const [setHeroElement] = useScrollAnimation()
  const [displayText, setElement] = useTypingAnimation(ready ? t('subtitle') : '')

  const handleBookNow = () => {
    onBookNow()
  }

  return (
    <section id="hero" className="hero" ref={setHeroElement}>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="title-main">Spectra</span>
          <span className="title-accent">AutoArt</span>
        </h1>
        <p className="hero-subtitle" ref={setElement}>
          {displayText}
          <span className="cursor">|</span>
        </p>
        <p className="hero-description">
          We transform cars into works of art with premium detailing and styling services!
        </p>
        <button className="cta-button" onClick={handleBookNow}>
          <span className="button-text">{t('bookNow')}</span>
          <span className="button-icon">→</span>
        </button>
      </div>
      
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
    </section>
  )
}

export default Hero