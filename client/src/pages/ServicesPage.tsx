import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import { publicAPI } from '../services/api'
import { useScrollReveal } from '../hooks/useAnimations'
import type { ServiceWithPrices } from '../components/BookingWizard'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import './ServicesPage.css'

interface ServiceCardProps {
  service: ServiceWithPrices
  index: number
  currentLanguage: string
  onBook: () => void
  t: any
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, currentLanguage, onBook, t }) => {
  const [setCardRef] = useScrollReveal()
  
  const getServiceName = (service: ServiceWithPrices) => {
    const lang = (currentLanguage || 'nl').toLowerCase()
    if (lang === 'nl' && service.name_nl) return service.name_nl as string
    if (lang === 'en' && service.name_en) return service.name_en as string
    if (lang === 'es' && service.name_es) return service.name_es as string
    if (lang === 'pl' && service.name_pl) return service.name_pl as string
    if (lang === 'ro' && service.name_ro) return service.name_ro as string
    return service.name
  }

  const getServiceDescription = (service: ServiceWithPrices) => {
    const lang = (currentLanguage || 'nl').toLowerCase()
    if (lang === 'nl' && service.description_nl) return service.description_nl as string
    if (lang === 'en' && service.description_en) return service.description_en as string
    if (lang === 'es' && service.description_es) return service.description_es as string
    if (lang === 'pl' && service.description_pl) return service.description_pl as string
    if (lang === 'ro' && service.description_ro) return service.description_ro as string
    return service.description
  }
  
  const getMinPriceForService = (service: ServiceWithPrices) => {
    if (!service.prices || !Array.isArray(service.prices)) {
      return null
    }
    const activePrices = service.prices.filter(price => price.is_active)
    if (activePrices.length === 0) return null
    return Math.min(...activePrices.map(price => price.price_min))
  }
  
  const minPrice = getMinPriceForService(service)
  
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
      
      <h3>{getServiceName(service)}</h3>
      <p>{getServiceDescription(service)}</p>
      
      {/* Afișare preț */}
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

const ServicesPage: React.FC = () => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()
  const navigate = useNavigate()
  const [services, setServices] = useState<ServiceWithPrices[]>([])
  const [loading, setLoading] = useState(true)
  const loadAllServices = async () => {
    try {
      setLoading(true)
      
      // Încarcă toate serviciile cu traduceri cache
      const servicesResponse = await publicAPI.getServicesWithCachedTranslations(currentLanguage, false)
      setServices(servicesResponse.data)
      
    } catch (error) {
      console.error('Error loading all services:', error)
      // Fallback la endpoint-ul vechi dacă cache-ul eșuează
      try {
        const fallbackResponse = await publicAPI.getServicesWithPrices(currentLanguage)
        setServices(fallbackResponse.data)
      } catch (fallbackError) {
        console.error('Fallback services loading also failed:', fallbackError)
        setServices([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllServices()
  }, [currentLanguage])

  const handleBookService = () => {
    navigate('/#booking')
  }

  if (loading) {
    return (
      <div className="services-page">
        <Header />
        <main className="services-main">
          <div className="container">
            <h1 className="page-title">{t('ourServices')}</h1>
            <div className="loading-container">
              <div className="spinner"></div>
              <div className="loading-text">{t('servicesPage.loading')}</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="services-page">
      <Header />
      <main className="services-main">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">{t('ourServices')}</h1>
            <p className="page-subtitle">
              {t('servicesPage.allServicesDescription', 'Discover our complete range of premium auto detailing and styling services')}
            </p>
          </div>
          
          <div className="services-grid">
            {Array.isArray(services) && services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                currentLanguage={currentLanguage}
                onBook={handleBookService}
                t={t}
              />
            ))}
          </div>
          
          {services.length === 0 && (
            <div className="no-services">
              <p>{t('servicesPage.noServices', 'No services available at the moment.')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ServicesPage