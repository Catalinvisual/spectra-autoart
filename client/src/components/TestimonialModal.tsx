import React, { useState } from 'react'
import { useTestimonialTranslations } from '../hooks/useGoogleTranslation'
import { publicAPI } from '../services/api'
import './TestimonialModal.css'

interface TestimonialModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t, isTranslating } = useTestimonialTranslations()
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await publicAPI.submitTestimonial(formData)
      onSuccess()
      setFormData({ name: '', rating: 5, comment: '' })
      onClose()
    } catch (err) {
      setError(t('errorSubmit') || 'Error submitting testimonial')
      console.error('Error submitting testimonial:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < formData.rating ? 'filled' : ''}`}
        onClick={() => setFormData(prev => ({ ...prev, rating: index + 1 }))}
      >
        ★
      </span>
    ))
  }

  if (!isOpen) return null

  return (
    <div className="testimonial-modal-overlay" onClick={onClose}>
      <div className="testimonial-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {t('writeReview')}
            {isTranslating && <span className="translation-indicator-modal"> 🌐</span>}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="testimonial-form">
          <div className="form-group">
            <label htmlFor="name">{t('yourName')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder={t('namePlaceholder')}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>{t('yourRating')}</label>
            <div className="star-rating-input">
              {renderStars()}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment">{t('yourReview')}</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              required
              placeholder={t('reviewPlaceholder')}
              rows={4}
              className="form-textarea"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('submitting') : t('submitReview')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TestimonialModal