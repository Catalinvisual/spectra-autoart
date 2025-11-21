import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { publicAPI } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import './BookingWizard.css'

export interface VehicleData {
  id: string
  make: string
  model: string
  type: string
  body: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
}

export interface BookingData {
  make: string
  model: string
  body: string
  services: string[]
  user: {
    name: string
    email: string
    phone: string
  }
  date: string
  newsletter: boolean
  locale: string
}

export interface BodyType {
  id: string
  key: string
  name: string
  name_en?: string
  description?: string
  description_en?: string
  is_active: boolean
  sort_order: number
}

export interface ServicePrice {
  id: string
  service_id: string
  body_type_key: string
  price_min: number
  price_max?: number
  duration_minutes: number
  is_active: boolean
}

export interface ServiceWithPrices {
  id: string
  name: string
  name_en?: string
  description: string
  description_en?: string
  category: string
  category_en?: string
  duration_minutes: number
  is_active: boolean
  prices: ServicePrice[]
}

interface BookingWizardProps {
  onCancel?: () => void
}

const BookingWizard: React.FC<BookingWizardProps> = ({ onCancel }) => {
  const { t, i18n } = useTranslation()
  const { showSuccess, showError } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  // Date default pentru afișare instantă
  const [services, setServices] = useState<ServiceWithPrices[]>([])
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([])
  const [makes, setMakes] = useState<string[]>(['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche'])
  const [models, setModels] = useState<string[]>([])
  // Eliminat loading state pentru performanță instantă
  const [loadingModels, setLoadingModels] = useState(false)
  const [error, setError] = useState('')
  const [bookingData, setBookingData] = useState<BookingData>({
    make: '',
    model: '',
    body: '',
    services: [],
    user: {
      name: '',
      email: '',
      phone: ''
    },
    date: '',
    newsletter: false,
    locale: i18n.language
  })

  const totalSteps = 5

  const renderProgressCircles = () => {
    return (
      <div className="wizard-progress-circles">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          
          return (
            <div
              key={stepNumber}
              className={`progress-circle ${
                isCompleted ? 'completed' : 
                isActive ? 'active' : 'pending'
              }`}
            >
              {stepNumber}
            </div>
          )
        })}
      </div>
    )
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  // Re-încărcăm serviciile când se schimbă bodyType pentru a avea prețurile corecte
  useEffect(() => {
    if (bookingData.body) {
      loadServicesForBodyType()
    }
  }, [bookingData.body])

  const loadServicesForBodyType = async () => {
    try {
      const servicesRes = await publicAPI.getServicesWithPrices(i18n.language, bookingData.body);
      console.log('🔧 Services with prices response:', servicesRes)
      setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
    } catch (error) {
      console.error('Error loading services for body type:', error);
      setServices([]);
    }
  }

  const loadInitialData = async () => {
    try {
      // Nu mai setăm loading - lăsăm modalul să apară instant
      const [makesRes, servicesRes, bodyTypesRes] = await Promise.all([
        publicAPI.getVehicleMakes(),
        publicAPI.getServicesWithPrices(i18n.language),
        publicAPI.getBodyTypes(i18n.language)
      ])
      
      console.log('🚗 Makes response:', makesRes)
      console.log('🔧 Services response:', servicesRes)
      console.log('🚙 Body types response:', bodyTypesRes)
      
      setMakes(Array.isArray(makesRes.data) ? makesRes.data : [])
      setServices(Array.isArray(servicesRes.data) ? servicesRes.data : [])
      setBodyTypes(Array.isArray(bodyTypesRes.data) ? bodyTypesRes.data : [])
      
      // Setăm tipurile direct deoarece nu mai avem pasul 3

    } catch (error) {
      setError('Failed to load data')
      console.error('Error loading data:', error)
      // Setăm date fallback în caz de eroare
      setMakes(['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche'])
      setServices([
        {
          id: '1',
          name: 'Premium Wash',
          name_en: 'Premium Wash',
          description: 'Spălare completă exterioară',
          description_en: 'Complete exterior cleaning',
          category: 'exterior',
          category_en: 'exterior',
          duration_minutes: 45,
          is_active: true,
          prices: [
            { id: '1', service_id: '1', body_type_key: 'suv', price_min: 35, duration_minutes: 45, is_active: true },
            { id: '2', service_id: '1', body_type_key: 'berlina', price_min: 25, duration_minutes: 40, is_active: true }
          ]
        }
      ])
      setBodyTypes([
        { id: '1', key: 'suv', name: 'SUV', name_en: 'SUV', description: '', description_en: '', sort_order: 1, is_active: true },
        { id: '2', key: 'berlina', name: 'Berlina', name_en: 'Sedan', description: '', description_en: '', sort_order: 2, is_active: true }
      ])
      // Setăm tipurile direct

    }
  }

  const getUniqueMakes = () => {
    return Array.isArray(makes) ? makes : []
  }

  const getModelsForMake = () => {
    return Array.isArray(models) ? models : []
  }



  const getBodiesForType = () => {
    return Array.isArray(bodyTypes) ? bodyTypes.filter(bt => bt.is_active).map(bt => ({
      key: bt.key,
      name: i18n.language === 'en' && bt.name_en ? bt.name_en : bt.name
    })) : []
  }

  const getServicePriceForBodyType = (service: ServiceWithPrices, bodyTypeKey: string) => {
    return service.prices && Array.isArray(service.prices) ? service.prices.find(price => price.body_type_key === bodyTypeKey && price.is_active) : undefined
  }

  const getFilteredServices = () => {
    // Show all services regardless of whether they have prices for the selected body type
    return Array.isArray(services) ? services : []
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const loadModelsForMake = async (make: string) => {
    try {
      setLoadingModels(true)
      const modelsRes = await publicAPI.getVehicleModels(make)
      setModels(modelsRes.data)
    } catch (error) {
      console.error('Error loading models:', error)
      setModels([])
    } finally {
      setLoadingModels(false)
    }
  }

  const loadTypes = async () => {
    // Nu mai încărcăm tipurile de vehicule deoarece am eliminat pasul 3
    // Setăm direct tipurile disponibile pentru caroserii

  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setBookingData(prev => {
        const parentValue = prev[parent as keyof BookingData]
        if (typeof parentValue === 'object' && parentValue !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentValue as Record<string, any>,
              [child]: value
            }
          }
        }
        return prev
      })
    } else {
      setBookingData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleServiceToggle = (serviceId: string) => {
    setBookingData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }))
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return !!bookingData.make
      case 2: return !!bookingData.model
      case 3: return !!bookingData.body
      case 4: return bookingData.services.length > 0
      case 5: return !!bookingData.user.name && !!bookingData.user.email && !!bookingData.user.phone && !!bookingData.date
      default: return false
    }
  }

  const isFormValid = () => {
    return !!bookingData.make && 
           !!bookingData.model && 
           !!bookingData.body && 
           bookingData.services.length > 0 &&
           !!bookingData.user.name && 
           !!bookingData.user.email && 
           !!bookingData.user.phone && 
           !!bookingData.date
  }

  const handleSubmit = async () => {
    try {
      setError('')
      
      const response = await publicAPI.createBooking(bookingData)
      
      if (response.data.success) {
        // Show success notification immediately
        console.log('Calling showSuccess with message:', t('bookingConfirmed') || 'Programarea a fost confirmată!')
        showSuccess(t('bookingConfirmed') || 'Programarea a fost confirmată!')
        // Close modal immediately after notification
        if (onCancel) {
          onCancel()
        }
        // Reset form after modal closes
        setTimeout(() => {
          setBookingData({
            make: '',
            model: '',
            body: '',
            services: [],
            user: { name: '', email: '', phone: '' },
            date: '',
            newsletter: false,
            locale: i18n.language
          })
          setCurrentStep(1)
        }, 300)
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error)
        showError(error.response.data.error)
      } else {
        setError('Failed to create booking')
        showError('Failed to create booking')
      }
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="wizard-step">
            <h3>{t('vehicleBrand')}</h3>
            <div className="form-group">
              <select
                className="form-select"
                value={bookingData.make}
                onChange={(e) => {
                  const make = e.target.value
                  handleInputChange('make', make)
                  handleInputChange('model', '')
                  handleInputChange('body', '')
                  if (make) {
                    // Încarcă modelele fără să aștepți - UI-ul rămâne responsiv
                    loadModelsForMake(make)
                  } else {
                    setModels([])
                  }
                }}
              >
                <option value="">{t('vehicleBrand')}</option>
                {getUniqueMakes().map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
              {loadingModels && (
                <div className="loading-indicator">
                  <span>Se încarcă modelele...</span>
                </div>
              )}
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="wizard-step">
            <h3>{t('vehicleModel')}</h3>
            <div className="form-group">
              <select
                className="form-select"
                value={bookingData.model}
                onChange={(e) => {
                  const model = e.target.value
                  handleInputChange('model', model)
                  handleInputChange('body', '')
                  if (model) {
                    // Încarcă tipurile fără să aștepți - UI-ul rămâne responsiv
                    loadTypes()
                  } else {

                  }
                }}
                disabled={!bookingData.make}
              >
                <option value="">{t('vehicleModel')}</option>
                {getModelsForMake().map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="wizard-step">
            <h3>{t('vehicleBody')}</h3>
            <div className="form-group">
              <select
                className="form-select"
                value={bookingData.body}
                onChange={(e) => {
                  const bodyType = e.target.value;
                  handleInputChange('body', bodyType);
                  // Resetăm serviciile selectate când schimbăm tipul de caroserie
                  if (bookingData.services.length > 0) {
                    handleInputChange('services', []);
                  }
                }}
                disabled={!bookingData.model}
              >
                <option value="">{t('vehicleBody')}</option>
                {getBodiesForType().map(body => (
                  <option key={body.key} value={body.key}>{body.name}</option>
                ))}
              </select>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="wizard-step">
            <h3>{t('selectService')}</h3>
            {!bookingData.body && (
              <div className="info-message">
                <p>Selectează mai întâi tipul de caroserie pentru a vedea prețurile</p>
              </div>
            )}
            <div className="service-grid">
              {getFilteredServices().map(service => {
                const servicePrice = bookingData.body ? getServicePriceForBodyType(service, bookingData.body) : null
                const serviceName = i18n.language === 'en' && service.name_en ? service.name_en : service.name
                const serviceDesc = i18n.language === 'en' && service.description_en ? service.description_en : service.description
                
                return (
                  <div
                    key={service.id}
                    className={`service-card ${bookingData.services.includes(service.id) ? 'selected' : ''}`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <h4>{serviceName}</h4>
                    <p>{serviceDesc}</p>
                    <div className="service-price">
                      {servicePrice ? (
                        <>
                          De la €{servicePrice.price_min}
                          {servicePrice.price_max && servicePrice.price_max > servicePrice.price_min && (
                            <span> - €{servicePrice.price_max}</span>
                          )}
                        </>
                      ) : (
                        <span className="unavailable">Indisponibil</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Newsletter & Checkout Card */}
            <div className="newsletter-checkout-card">
              <div className="card-header">
                <i className="icon-newsletter">📧</i>
                <h4>{t('newsletterSubscription') || 'Nieuwsbrief Abonnement'}</h4>
              </div>
              <div className="card-content">
                <p className="newsletter-description">
                  {t('newsletterDescription') || 'Blijf op de hoogte van onze nieuwste diensten en aanbiedingen!'}
                </p>
                <div className="newsletter-checkbox-wrapper">
                  <label className="newsletter-label">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={bookingData.newsletter}
                      onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    <span className="newsletter-text">
                      {t('subscribeNewsletter') || 'Schrijf me in voor de nieuwsbrief'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 5:
        return (
          <div className="wizard-step step-5-container">
            <h3>{t('personalDetails')}</h3>
            <div className="step-5-scroll-content">
              <div className="form-group">
                <label className="form-label">{t('name')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={bookingData.user.name}
                  onChange={(e) => handleInputChange('user.name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('email')}</label>
                <input
                  type="email"
                  className="form-input"
                  value={bookingData.user.email}
                  onChange={(e) => handleInputChange('user.email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('phone')}</label>
                <input
                  type="tel"
                  className="form-input"
                  value={bookingData.user.phone}
                  onChange={(e) => handleInputChange('user.phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('selectDate')}</label>
                <input
                  type="date"
                  className="form-input date-input-instant"
                  value={bookingData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                />
              </div>
              
              {/* Booking Summary Card */}
              <div className="booking-summary-card">
                <div className="summary-card-header">
                  <i className="icon-summary">📋</i>
                  <h4>{t('summary')}</h4>
                </div>
                <div className="summary-card-content">
                  <div className="summary-item">
                    <span className="summary-label">{t('vehicleBrand')}:</span>
                    <span className="summary-value">{bookingData.make}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">{t('vehicleModel')}:</span>
                    <span className="summary-value">{bookingData.model}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">{t('vehicleBody')}:</span>
                    <span className="summary-value">{bookingData.body}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">{t('service')}:</span>
                    <span className="summary-value services-list">
                      {bookingData.services.length > 0 ? bookingData.services.map(serviceId => {
                        const service = services.find(s => s.id === serviceId)
                        const serviceName = service ? (i18n.language === 'en' && service.name_en ? service.name_en : service.name) : ''
                        return serviceName
                      }).join(', ') : 'Niciun serviciu selectat'}
                    </span>
                  </div>
                  <div className="summary-total">
                    <span className="summary-label total-label">{t('total')}:</span>
                    <span className="summary-value total-value">€{bookingData.services.reduce((total, serviceId) => {
                      const service = services.find(s => s.id === serviceId)
                      const servicePrice = service && bookingData.body ? getServicePriceForBodyType(service, bookingData.body) : null
                      return total + (servicePrice?.price_min || 0)
                    }, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  // Eliminat blocarea cu loading - afișăm conținutul instant
  return (
    <div className={`booking-wizard-modal ${currentStep === 5 ? 'no-scroll' : ''}`}>
      {/* Afișează întotdeauna butonul de închidere pe ecrane mici */}
      <button className="modal-close-btn" onClick={onCancel || (() => window.history.back())}>
        ×
      </button>
      {renderProgressCircles()}
      
      <div className={`booking-wizard-content ${currentStep === 5 ? 'step-6-content' : ''}`}>
        {error && <div className="error-message">{error}</div>}
        
        {renderStep()}
        
        <div className="wizard-actions">
          {currentStep > 1 && (
            <button className="btn wizard-back-btn" onClick={handleBack}>
              {t('back')}
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button 
              className="btn btn-primary wizard-next-btn" 
              onClick={handleNext}
              disabled={!canProceedToNext()}
            >
              {t('next')}
            </button>
          ) : (
            <button 
              className="btn btn-primary wizard-next-btn" 
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              {t('confirm')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingWizard