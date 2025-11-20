import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { currentLanguage } = useLanguage()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [setAnimationElement] = useScrollAnimation()

  const categories = ['all', 'exterior', 'interior', 'detailing', 'chrome-delete']

  useEffect(() => {
    loadGalleryImages()
  }, [currentLanguage])

  const loadGalleryImages = async () => {
    try {
      const response = await publicAPI.getGallery(currentLanguage)
      setImages(response.data)
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

  if (loading) {
    return (
      <section className="gallery-section">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
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
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {t(`galleryPage.categories.${category}`)}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id} 
              className="gallery-item"
              style={{ animationDelay: `${index * 0.1}s` }}
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
      </div>
    </section>
  )
}

export default Gallery