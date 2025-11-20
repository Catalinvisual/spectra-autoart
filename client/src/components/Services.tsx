import { useTranslation } from 'react-i18next'
import { useScrollAnimation } from '../hooks/useAnimations'
import { publicAPI } from '../services/api'
import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import type { ServiceWithPrices } from './BookingWizard'
import './Services.css'



interface ServicesProps {
  openBookingModal?: () => void
}

const Services: React.FC<ServicesProps> = ({ openBookingModal }) => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()
  const [setServicesElement] = useScrollAnimation()
  const [services, setServices] = useState<ServiceWithPrices[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [currentLanguage])

  const loadServices = async () => {
    try {
      setLoading(true)
      
      // Load services with prices
      const servicesResponse = await publicAPI.getServicesWithPrices(currentLanguage)
      setServices(servicesResponse.data)
      
    } catch (error) {
      console.error('Error loading services:', error)
      // Fallback data
      setServices([
        {
          id: '1',
          name: 'Premium Wash',
          name_en: 'Premium Wash',
          description: 'Spălare completă exterioară cu produse de calitate superioară',
          description_en: 'Complete exterior cleaning with premium products',
          category: 'exterior',
          category_en: 'exterior',
          duration_minutes: 45,
          is_active: true,
          prices: [
            { id: '1', service_id: '1', body_type_key: 'suv', price_min: 35, price_max: 45, duration_minutes: 45, is_active: true },
            { id: '2', service_id: '1', body_type_key: 'berlina', price_min: 25, price_max: 35, duration_minutes: 40, is_active: true },
            { id: '3', service_id: '1', body_type_key: 'hatchback', price_min: 20, price_max: 30, duration_minutes: 35, is_active: true }
          ]
        },
        {
          id: '2',
          name: 'Interior Detail',
          name_en: 'Interior Detail',
          description: 'Curățare profundă interior cu extracție și deodorizare',
          description_en: 'Deep interior cleaning with extraction and deodorizing',
          category: 'interior',
          category_en: 'interior',
          duration_minutes: 120,
          is_active: true,
          prices: [
            { id: '4', service_id: '2', body_type_key: 'suv', price_min: 120, price_max: 150, duration_minutes: 150, is_active: true },
            { id: '5', service_id: '2', body_type_key: 'berlina', price_min: 100, price_max: 130, duration_minutes: 120, is_active: true },
            { id: '6', service_id: '2', body_type_key: 'hatchback', price_min: 90, price_max: 120, duration_minutes: 105, is_active: true }
          ]
        },
        {
          id: '3',
          name: 'Ceramic Coating',
          name_en: 'Ceramic Coating',
          description: 'Aplicare protecție ceramică pentru vopsea',
          description_en: 'Ceramic coating application for paint protection',
          category: 'protection',
          category_en: 'protection',
          duration_minutes: 240,
          is_active: true,
          prices: [
            { id: '7', service_id: '3', body_type_key: 'suv', price_min: 500, price_max: 600, duration_minutes: 300, is_active: true },
            { id: '8', service_id: '3', body_type_key: 'berlina', price_min: 400, price_max: 500, duration_minutes: 240, is_active: true },
            { id: '9', service_id: '3', body_type_key: 'hatchback', price_min: 350, price_max: 450, duration_minutes: 210, is_active: true }
          ]
        }
      ])
      
    } finally {
      setLoading(false)
    }
  }

  // Temporarily commented out to avoid warnings
  // const getServicePrice = (service: ServiceWithPrices, bodyTypeKey: string) => {
  //   if (!service.prices || !Array.isArray(service.prices)) {
  //     return null
  //   }
  //   return service.prices.find(price => price.body_type_key === bodyTypeKey && price.is_active)
  // }

  const getMinPriceForService = (service: ServiceWithPrices) => {
    if (!service.prices || !Array.isArray(service.prices)) {
      return null
    }
    const activePrices = service.prices.filter(price => price.is_active)
    if (activePrices.length === 0) return null
    return Math.min(...activePrices.map(price => price.price_min))
  }

  // Temporarily commented out to avoid warnings
  // const formatPrice = (price: any) => {
  //   if (price.price_max) {
  //     return `€${price.price_min} - €${price.price_max}`
  //   }
  //   return `€${price.price_min}`
  // }

  if (loading) {
    return (
      <section id="services" className="services-section">
        <div className="container">
          <h2 className="section-title">{t('ourServices')}</h2>
          <div className="loading">Loading services...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="services-section" ref={setServicesElement}>
      <div className="container">
        <h2 className="section-title">{t('ourServices')}</h2>
        
        <div className="services-grid">
          {services.map((service, index) => {
            // Temporarily commented out to avoid warnings
            // const currentPrice = getServicePrice(service, selectedBodyType)
            const minPrice = getMinPriceForService(service)
            
            return (
              <div 
                key={service.id} 
                className="service-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="service-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3>{currentLanguage === 'en' && service.name_en ? service.name_en : service.name}</h3>
                <p>{currentLanguage === 'en' && service.description_en ? service.description_en : service.description}</p>
                
                {/* Price Display - Show minimum price for all services */}
                <div className="service-price">
                  {minPrice && (
                    <>
                      <span className="price-amount">de la €{minPrice}</span>
                      <div className="price-note">Preț minim</div>
                    </>
                  )}
                </div>
                
                <button className="service-book-btn" onClick={openBookingModal}>
                  {t('bookNow')}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Services