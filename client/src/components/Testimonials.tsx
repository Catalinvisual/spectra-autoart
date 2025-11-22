import React, { useState, useEffect } from 'react'
import { publicAPI } from '../services/api'
import { useScrollAnimation } from '../hooks/useAnimations'
import { useLanguage } from '../contexts/LanguageContext'
import { useTestimonialTranslations } from '../hooks/useGoogleTranslation'
import TestimonialModal from './TestimonialModal'
import './Testimonials.css'

interface Testimonial {
  id: string
  name: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

const Testimonials: React.FC = () => {
  const { currentLanguage } = useLanguage()
  const { t, isTranslating } = useTestimonialTranslations()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [translatedTestimonials, setTranslatedTestimonials] = useState<Testimonial[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [setAnimationElement] = useScrollAnimation()

  useEffect(() => {
    loadTestimonials()
  }, [currentLanguage])

  // Translate testimonials when language changes or testimonials are loaded
  useEffect(() => {
    translateTestimonials()
  }, [testimonials, currentLanguage])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % translatedTestimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [translatedTestimonials.length])

  const loadTestimonials = async () => {
    try {
      const response = await publicAPI.getTestimonials(currentLanguage)
      setTestimonials(response.data)
    } catch (error) {
      console.error('Error loading testimonials:', error)
      // Fallback testimonials
      setTestimonials([
        {
          id: '1',
          name: 'Alex Johnson',
          rating: 5,
          comment: 'Exceptional service! My car looks brand new after the premium detailing. The attention to detail is outstanding.',
          date: '2024-01-15'
        },
        {
          id: '2',
          name: 'Maria Garcia',
          rating: 5,
          comment: 'The chrome delete transformation exceeded my expectations. Professional team and excellent results!',
          date: '2024-01-10'
        },
        {
          id: '3',
          name: 'David Chen',
          rating: 5,
          comment: 'Best auto detailing service in town. The ceramic coating is perfect and the customer service is top-notch.',
          date: '2024-01-08'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const translateTestimonials = () => {
    if (!testimonials.length || currentLanguage === 'nl') {
      setTranslatedTestimonials(testimonials)
      return
    }

    // Extract only comments to translate (names remain unchanged)
    const comments = testimonials.map(t => t.comment)
    
    // Translate only comments using the LanguageContext
    const translateComments = async () => {
      try {
        const translatedComments = await publicAPI.translateBatch({ 
          texts: comments, 
          target: currentLanguage, 
          source: 'nl' 
        })
        
        // Create translated testimonials (names remain original)
        const translated = testimonials.map((testimonial, index) => ({
          ...testimonial,
          comment: translatedComments.data?.translatedTexts?.[index] || testimonial.comment
          // Name is NOT translated - keeps original value
        }))
        
        setTranslatedTestimonials(translated)
      } catch (error) {
        console.error('Error translating testimonials:', error)
        // Fallback to original testimonials on error
        setTranslatedTestimonials(testimonials)
      }
    }
    
    translateComments()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ))
  }

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % translatedTestimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + translatedTestimonials.length) % translatedTestimonials.length)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleTestimonialSuccess = () => {
    // Reload testimonials after successful submission
    loadTestimonials()
  }

  if (loading || isTranslating || (testimonials.length > 0 && translatedTestimonials.length === 0)) {
    return (
      <section className="testimonials-section">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            {isTranslating && (
              <p className="translation-indicator">🌐 Translating content...</p>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (translatedTestimonials.length === 0) {
    return (
      <section id="testimonials" className="testimonials-section" ref={setAnimationElement}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('title')}</h2>
            <p className="section-subtitle">{t('subtitle')}</p>
          </div>
          <div className="no-testimonials">
            <p>{t('noTestimonials') || 'No testimonials available yet.'}</p>
          </div>
          <div className="testimonial-actions">
            <button className="write-review-btn" onClick={openModal}>
              {t('writeReview') || 'Write a Review'}
            </button>
          </div>
          <TestimonialModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSuccess={handleTestimonialSuccess}
          />
        </div>
      </section>
    )
  }

  return (
    <section id="testimonials" className="testimonials-section" ref={setAnimationElement}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle">{t('subtitle')}</p>
        </div>

        <div className="testimonials-slider">
          <div className="testimonials-container">
            {Array.isArray(translatedTestimonials) && translatedTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonial-card ${
                  index === currentSlide ? 'active' : ''
                } ${index < currentSlide ? 'prev' : ''}
                ${index > currentSlide ? 'next' : ''}`}
              >
                <div className="testimonial-content">
                  <div className="rating">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  <p className="comment">"{testimonial.comment}"</p>
                  
                  <div className="author-info">
                    <div className="author-avatar-placeholder">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="author-details">
                      <h4 className="author-name">{testimonial.name}</h4>
                      <p className="testimonial-date">
                        {testimonial.date ? new Date(testimonial.date).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="slider-controls">
            <button className="slider-btn prev-btn" onClick={prevSlide}>
              ‹
            </button>
            
            <button className="slider-btn next-btn" onClick={nextSlide}>
              ›
            </button>
          </div>
        </div>

        <div className="slider-dots">
          {Array.isArray(translatedTestimonials) && translatedTestimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <div className="testimonial-actions">
          <button className="write-review-btn" onClick={openModal}>
            {t('writeReview')}
          </button>
        </div>
      </div>

      <TestimonialModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleTestimonialSuccess}
      />
    </section>
  )
}

export default Testimonials