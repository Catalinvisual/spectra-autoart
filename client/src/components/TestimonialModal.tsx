import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { publicAPI } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import './TestimonialModal.css'

interface TestimonialModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation()
  const { showSuccess } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  })
  const [error, setError] = useState('')

  // Manage body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

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
    
    // Close modal and show success immediately (optimistic update)
    onClose()
    showSuccess(t('testimonialPage.reviewSubmittedSuccessfully'))
    
    // Reset form
    setFormData({ name: '', rating: 5, comment: '' })
    
    // Process in background without blocking user
    setTimeout(async () => {
      try {
        await publicAPI.submitTestimonial(formData)
        // Reload testimonials after successful submission
        onSuccess()
      } catch (err) {
        console.error('Error submitting testimonial in background:', err)
        // If error occurs, user already sees success message but we'll log it
      }
    }, 100)
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

  const modalContent = (
    <div className="testimonial-modal-overlay" onClick={onClose}>
      <div className="testimonial-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {t('testimonialPage.writeReview')}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="testimonial-form">
          <div className="form-group">
            <label htmlFor="name">{t('testimonialPage.yourName')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder={t('testimonialPage.namePlaceholder')}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>{t('testimonialPage.yourRating')}</label>
            <div className="star-rating-input">
              {renderStars()}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment">{t('testimonialPage.yourReview')}</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              required
              placeholder={t('testimonialPage.reviewPlaceholder')}
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
            >
              {t('testimonialPage.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {t('testimonialPage.submitReview')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  // Render modal using React Portal to ensure it's outside the normal DOM hierarchy
  return createPortal(modalContent, document.body)
}

export default TestimonialModal