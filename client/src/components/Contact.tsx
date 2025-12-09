import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollAnimation } from '../hooks/useAnimations'
import InteractiveMap from './InteractiveMap'
import './Contact.css'

const Contact: React.FC = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [setAnimationElement] = useScrollAnimation()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Simulate form submission - replace with actual API call when available
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="contact-section" ref={setAnimationElement}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('contactPage.title')}</h2>
          <p className="section-subtitle">{t('contactPage.subtitle')}</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item map-item">
              <InteractiveMap />
            </div>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-content">
                <h3>{t('contactPage.phone')}</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-content">
                <h3>{t('contactPage.email')}</h3>
                <p>info@spectraautoart.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🕒</div>
              <div className="info-content">
                <h3>{t('contactPage.hours')}</h3>
                <div className="hours-lines">
                  <div className="hours-line">{t('contactPage.hoursWeekdays')}</div>
                  <div className="hours-line">{t('contactPage.hoursSaturday')}</div>
                  <div className="hours-line">{t('contactPage.hoursSunday')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            {success && (
              <div className="success-message">
                <h3>{t('contactPage.successTitle')}</h3>
                <p>{t('contactPage.successMessage')}</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            {!success && (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{t('contactPage.name')} *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">{t('contactPage.email')} *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">{t('contactPage.phone')}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">{t('contactPage.subject')} *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    >
                      <option value="">{t('contactPage.selectSubject')}</option>
                      <option value="general">{t('contactPage.generalInquiry')}</option>
                      <option value="booking">{t('contactPage.bookingInquiry')}</option>
                      <option value="services">{t('contactPage.servicesInquiry')}</option>
                      <option value="pricing">{t('contactPage.pricingInquiry')}</option>
                      <option value="other">{t('contactPage.other')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t('contactPage.message')} *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="form-textarea"
                    placeholder={t('contactPage.messagePlaceholder')}
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? t('contactPage.sending') : t('contactPage.send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
