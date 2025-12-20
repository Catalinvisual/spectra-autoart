import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { publicAPI } from '../services/api'
import { useScrollAnimation } from '../hooks/useAnimations'
import { useLanguage } from '../contexts/LanguageContext'
import './Gallery.css'

interface GalleryImage {
  id: string
  url: string
  title: string
  description: string
  category: string
}

const Gallery: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { currentLanguage } = useLanguage()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [setAnimationElement] = useScrollAnimation()
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallMobile, setIsSmallMobile] = useState(false)

  const categories = ['all', 'detailing-interior', 'detailing-exterior', 'ambient-lights', 'starlight-ceiling', 'chrome-delete', 'trim-wrapping', 'polish-auto', 'ceramic-protection', 'before-after']

  const handleCardFlip = (imageId: string) => {
    const card = document.querySelector(`[data-image-id="${imageId}"]`)
    if (card) {
      card.classList.toggle('flipped')
    }
  }

  const handleViewAllClick = () => {
    navigate('/gallery', { state: { selectedCategory } })
  }

  useEffect(() => {
    loadGalleryImages()
  }, [currentLanguage])

  // Detect screen size for responsive image limits
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsSmallMobile(window.innerWidth <= 480)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const loadGalleryImages = async () => {
    try {
      const response = await publicAPI.getGallery(currentLanguage)
      console.log('🔍 Gallery public API response:', response.data)
      // Construiește URL-uri complete pentru imagini
      const processedImages = response.data.map((image: GalleryImage) => {
        const apiBase = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : '')
        const baseUrl = (apiBase && apiBase.replace('/api', '')) || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080')
        let fullUrl = image.url
        
        // Dacă URL-ul nu începe cu http, construiește URL complet
        if (image.url && !image.url.startsWith('http')) {
          // Asigură-te că URL-ul începe cu / pentru a fi o cale relativă validă
          const normalizedPath = image.url.startsWith('/') ? image.url : `/${image.url}`
          fullUrl = `${baseUrl}${normalizedPath}`
        }
        
        console.log('🔍 Gallery image URL processing:', {
          original: image.url,
          baseUrl: baseUrl,
          fullUrl: fullUrl,
          startsWithHttp: image.url.startsWith('http')
        })
        return {
          ...image,
          url: fullUrl
        }
      })
      setImages(processedImages)
    } catch (error) {
      console.error('Error loading gallery images:', error)
      // Fallback gallery images
      setImages([
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
          title: t('galleryPage.fallback.premiumDetailing'),
          description: t('galleryPage.fallback.completeDetailing'),
          category: 'detailing'
        },
        {
          id: '2',
          url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
          title: t('galleryPage.fallback.chromeDelete'),
          description: t('galleryPage.fallback.chromeTransformation'),
          category: 'chrome-delete'
        },
        {
          id: '3',
          url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
          title: t('galleryPage.fallback.interiorDetail'),
          description: t('galleryPage.fallback.interiorCleaning'),
          category: 'interior'
        },
        {
          id: '4',
          url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
          title: t('galleryPage.fallback.exteriorPolish'),
          description: t('galleryPage.fallback.paintCorrection'),
          category: 'exterior'
        },
        {
          id: '5',
          url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop',
          title: t('gallery.fallback.ceramicCoating'),
          description: t('gallery.fallback.paintProtection'),
          category: 'exterior'
        },
        {
          id: '6',
          url: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=800&h=600&fit=crop',
          title: t('gallery.fallback.engineBay'),
          description: t('gallery.fallback.engineDetailing'),
          category: 'detailing'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(image => image.category === selectedCategory)

  // Limit images based on screen size
  const getLimitedImages = (images: GalleryImage[]) => {
    if (isSmallMobile) return images.slice(0, 3)
    if (isMobile) return images.slice(0, 3)
    return images.slice(0, 8) // Desktop: max 8 images
  }

  const displayImages = getLimitedImages(filteredImages)
  const hasMoreImages = filteredImages.length > displayImages.length

  if (loading) {
    return (
      <section className="gallery-section">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">{t('galleryPage.loading')}</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="gallery-section" ref={setAnimationElement}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('galleryPage.title')}</h2>
          <p className="section-subtitle">{t('galleryPage.subtitle')}</p>
        </div>

        <div className="gallery-filters">
          <div className="category-dropdown">
            <button 
              className="filter-btn dropdown-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {selectedCategory === 'all' ? t('galleryPage.categories.all') : t(`galleryPage.categories.${selectedCategory}`)}
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {showDropdown && (
              <div className="dropdown-content">
                <button
                  key="all"
                  className={`dropdown-item ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory('all')
                    setShowDropdown(false)
                  }}
                >
                  {t('galleryPage.categories.all')}
                </button>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <button
                    key={category}
                    className={`dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(category)
                      setShowDropdown(false)
                    }}
                  >
                    {t(`galleryPage.categories.${category}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="gallery-grid no-gap">
          {Array.isArray(displayImages) && displayImages.map((image, index) => (
            <div 
              key={image.id} 
              className="gallery-item flip-card"
              data-image-id={image.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleCardFlip(image.id)}
            >
              <div className="flip-card-inner">
                {/* Front side - Image */}
                <div className="flip-card-front">
                  <div className="image-wrapper">
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className="gallery-image"
                      loading="lazy"
                    />
                  </div>
                </div>
                
                {/* Back side - Description */}
                <div className="flip-card-back">
                  <div className="overlay-content">
                    <h3 className="image-title">{image.title}</h3>
                    <p className="image-description">{image.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {hasMoreImages && (
          <div className="view-all-container">
            <button className="view-all-btn" onClick={handleViewAllClick}>
              {t('galleryPage.viewAll')}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Gallery
