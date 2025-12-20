import { useTranslation } from 'react-i18next'
import { useScrollAnimation, useScrollReveal } from '../hooks/useAnimations'
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
      
      // Load services with cached translations - this avoids repeated DeepL calls
      // Include inactive services to show all services with prices
      const servicesResponse = await publicAPI.getServicesWithCachedTranslations(currentLanguage, false)
      setServices(servicesResponse.data)
      
    } catch (error) {
      console.error('Error loading services with cached translations:', error)
      // Fallback to the old endpoint if cached translations fail
      try {
        const fallbackResponse = await publicAPI.getServicesWithPrices(currentLanguage)
        setServices(fallbackResponse.data)
      } catch (fallbackError) {
        console.error('Fallback services loading also failed:', fallbackError)
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
      }
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
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">{t('servicesPage.loading')}</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="services-section" ref={setServicesElement}>
      <div className="container">
        <h2 className="section-title">{t('ourServices')}</h2>
        
        <div className="services-grid">
          {Array.isArray(services) && services.map((service, index) => {
            const minPrice = getMinPriceForService(service)
            
            return (
              <ServiceCard 
                key={service.id}
                service={service}
                minPrice={minPrice}
                index={index}
                currentLanguage={currentLanguage}
                onBook={openBookingModal}
                t={t}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

interface ServiceCardProps {
  service: ServiceWithPrices
  minPrice: number | null
  index: number
  currentLanguage: string
  onBook?: () => void
  t: any
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, minPrice, index, currentLanguage, onBook, t }) => {
  const [setCardRef] = useScrollReveal()
  
  const getServiceName = () => {
    const lang = (currentLanguage || 'nl').toLowerCase()
    if (lang === 'nl' && service.name_nl) return service.name_nl as string
    if (lang === 'en' && service.name_en) return service.name_en as string
    if (lang === 'es' && service.name_es) return service.name_es as string
    if (lang === 'pl' && service.name_pl) return service.name_pl as string
    if (lang === 'ro' && service.name_ro) return service.name_ro as string
    return service.name
  }
  
  const getServiceDescription = () => {
    const lang = (currentLanguage || 'nl').toLowerCase()
    if (lang === 'nl' && service.description_nl) return service.description_nl as string
    if (lang === 'en' && service.description_en) return service.description_en as string
    if (lang === 'es' && service.description_es) return service.description_es as string
    if (lang === 'pl' && service.description_pl) return service.description_pl as string
    if (lang === 'ro' && service.description_ro) return service.description_ro as string
    return service.description
  }
  
  return (
    <div 
      ref={setCardRef}
      className="service-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Container pentru liniile de border animate */}
      <div className="border-runner">
        <div className="border-line"></div>
        <div className="border-line"></div>
      </div>
      
      <div className="service-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <h3>{getServiceName()}</h3>
      <p>{getServiceDescription()}</p>
      
      {/* Price Display - Show minimum price for all services */}
      <div className="service-price">
        {minPrice && (
          <>
            <span className="price-amount">{t('servicesPage.fromPrice')} €{minPrice}</span>
            <div className="price-note">{t('servicesPage.minimumPrice')}</div>
          </>
        )}
      </div>
      
      <button className="service-book-btn" onClick={onBook}>
        {t('bookNow')}
      </button>
    </div>
  )
}

export default Services