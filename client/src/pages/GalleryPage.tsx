import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { publicAPI } from '../services/api'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './GalleryPage.css'

interface GalleryImage {
  id: string
  url: string
  title: string
  description: string
  category: string
}

const GalleryPage: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { currentLanguage } = useLanguage()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const categories = ['all', 'detailing-interior', 'detailing-exterior', 'ambient-lights', 'starlight-ceiling', 'chrome-delete', 'trim-wrapping', 'polish-auto', 'ceramic-protection', 'before-after']

  useEffect(() => {
    // Get selected category from navigation state if available
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory)
    }
    loadGalleryImages()
  }, [currentLanguage, location.state])

  const loadGalleryImages = async () => {
    try {
      const response = await publicAPI.getGallery(currentLanguage)
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

  const handleImageClick = (imageId: string) => {
    setSelectedImage(selectedImage === imageId ? null : imageId)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(image => image.category === selectedCategory)

  if (loading) {
    return (
      <div className="gallery-page">
        <Header />
        <main className="gallery-main">
          <div className="container">
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="gallery-page">
      <Header />
      <main className="gallery-main">
        <div className="container">
          <div className="gallery-header">
            <h1 className="gallery-title">{t('galleryPage.title')}</h1>
            <p className="gallery-subtitle">{t('galleryPage.subtitle')}</p>
          </div>

          <div className="gallery-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {t(`galleryPage.categories.${category}`)}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {Array.isArray(filteredImages) && filteredImages.map((image, index) => (
              <div 
                key={image.id} 
                className={`gallery-item ${selectedImage === image.id ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleImageClick(image.id)}
              >
                <div className="image-wrapper">
                  <img 
                    src={image.url} 
                    alt={image.title}
                    className="gallery-image"
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <h3 className="image-title">{image.title}</h3>
                      <p className="image-description">{image.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="no-images">
              <p>{t('galleryPage.noImages') || 'No images found for this category.'}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default GalleryPage