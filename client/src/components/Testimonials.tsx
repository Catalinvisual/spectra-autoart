import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  created_date?: string
  avatar?: string
}

const Testimonials: React.FC = () => {
  const { currentLanguage } = useLanguage()
  const { t } = useTranslation()
  const { translateMultiple } = useTestimonialTranslations()
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
    translateTestimonialComments()
  }, [testimonials, currentLanguage])

  const translateTestimonialComments = async () => {
    if (currentLanguage === 'nl' || testimonials.length === 0) {
      // For Dutch, use testimonials as-is (they should already be in Dutch from backend)
      setTranslatedTestimonials(testimonials)
      return
    }

    try {
      // Extract all comments for translation
      const comments = testimonials.map(t => t.comment)
      
      // Translate all comments at once
      const translatedComments = await translateMultiple(comments)
      
      // Create new testimonials with translated comments
      const translatedTestimonials = testimonials.map((testimonial, index) => ({
        ...testimonial,
        comment: translatedComments[index] || testimonial.comment
      }))
      
      setTranslatedTestimonials(translatedTestimonials)
    } catch (error) {
      console.error('Error translating testimonials:', error)
      // Fallback to original testimonials if translation fails
      setTranslatedTestimonials(testimonials)
    }
  }

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

  if (loading) {
    return (
      <section className="testimonials-section">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
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
            <h2 className="section-title">{t('testimonialPage.title')}</h2>
            <p className="section-subtitle">{t('testimonialPage.subtitle')}</p>
          </div>
          <div className="no-testimonials">
            <p>{t('testimonialPage.noTestimonials')}</p>
          </div>
          <div className="testimonial-actions">
            <button className="write-review-btn" onClick={openModal}>
              {t('testimonialPage.writeReview')}
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
          <h2 className="section-title">{t('testimonialPage.title')}</h2>
          <p className="section-subtitle">{t('testimonialPage.subtitle')}</p>
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
                        {(() => { const dv = testimonial.date || testimonial.created_date; return dv ? new Date(dv).toLocaleDateString() : 'Recent'; })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            {t('testimonialPage.writeReview')}
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
