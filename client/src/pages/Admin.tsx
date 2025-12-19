import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { adminAPI } from '../services/api'
import './Admin.css'

// Interfețe TypeScript
interface Booking {
  _id: string
  user: {
    name: string
    email: string
    phone: string
  }
  date: string
  time?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  make: string
  model: string
  body: string
  services: Array<{
    name: string
    price: number
  }>
  total: number
  createdAt: string
}

interface GalleryImage {
  _id: string
  title: string
  alt_text: string
  url: string
  category: string
  order: number
}



interface PortalModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

interface BookingCardProps {
  booking: Booking
  formatDate: (dateString: string, time?: string) => string
  formatTotal: (total: number) => string
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => string
  openDetailsModal: (booking: Booking) => void
  handleDeleteBookingLocal: (id: string) => void
  bookingOperations: { updating: string[]; deleting: string[] }
  t: (key: string) => string
}

interface BookingsManagementProps {
  t: (key: string) => string
  i18n: any
}

interface GalleryManagementProps {
  t: (key: string) => string
  i18n: any
}

// Componentă PortalModal pentru modale
const PortalModal: React.FC<PortalModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
}

// Componentă BookingCard optimizată cu React.memo
const BookingCard = React.memo<BookingCardProps>(({
  booking,
  formatDate,
  formatTotal,
  getStatusColor,
  getStatusIcon,
  openDetailsModal,
  handleDeleteBookingLocal,
  bookingOperations,
  t
}) => {
  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div className="booking-status" style={{ backgroundColor: getStatusColor(booking.status) }}>
          {getStatusIcon(booking.status)} {t(`admin.${booking.status}`) || t(booking.status) || booking.status}
        </div>
        <div className="booking-datetime">
          <div className="booking-date">
            📅 {formatDate(booking.date, booking.time)}
          </div>
        </div>
      </div>
      
      <div className="booking-card-body">
        <div className="customer-info">
          <div className="customer-name">
            👤 {booking.user.name || t('admin.noName')}
          </div>
          <div className="customer-contact">
            📧 {booking.user.email || t('admin.noEmail')}
          </div>
          <div className="vehicle-info">
            🚗 {booking.make} {booking.model} ({booking.body})
          </div>
        </div>
        
        <div className="services-preview">
          <div className="services-title">{t('admin.services')}:</div>
          <div className="services-list">
            {booking.services.slice(0, 3).map((service, index) => (
              <span key={index} className="service-tag">
                {t(`services.${service.name}`) || service.name}
              </span>
            ))}
            {booking.services.length > 3 && (
              <span className="service-tag more">
                +{booking.services.length - 3} {t('admin.more')}
              </span>
            )}
          </div>
        </div>
        
        <div className="booking-total">
          💰 {formatTotal(booking.total)}
        </div>
      </div>
      
      <div className="booking-card-actions">
        <button 
          onClick={() => openDetailsModal(booking)}
          className="btn-details"
          disabled={bookingOperations.updating.includes(booking._id) || bookingOperations.deleting.includes(booking._id)}
        >
          {t('admin.details')}
        </button>
        <button 
          onClick={() => handleDeleteBookingLocal(booking._id)}
          className="btn-delete"
          disabled={bookingOperations.updating.includes(booking._id) || bookingOperations.deleting.includes(booking._id)}
        >
          {bookingOperations.deleting.includes(booking._id) ? t('admin.deleting') : t('admin.delete')}
        </button>
      </div>
    </div>
  )
})

BookingCard.displayName = 'BookingCard'

// Componentă BookingsManagement optimizată
const BookingsManagement: React.FC<BookingsManagementProps> = ({ t, i18n }) => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [bookingOperations, setBookingOperations] = useState({ updating: [] as string[], deleting: [] as string[] })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Funcții memoizate pentru performanță
  const formatDate = useCallback((dateString: string, time?: string) => {
    if (!dateString || dateString === 'Invalid Date') {
      return t('admin.noDate') || 'No date specified'
    }
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return t('admin.invalidDate') || 'Invalid date'
      }
      
      const datePart = date.toLocaleDateString(i18n.language, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
      
      const timePart = time && typeof time === 'string' && time.trim() !== ''
        ? time
        : date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })
      
      return `${datePart} • ${timePart}`
    } catch {
      return t('admin.invalidDate') || 'Invalid date'
    }
  }, [t, i18n.language])

  const formatTotal = useCallback((total: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(total)
  }, [])

  const getStatusColor = useCallback((status: string) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#4caf50',
      completed: '#2196f3',
      cancelled: '#f44336'
    }
    return colors[status as keyof typeof colors] || '#757575'
  }, [])

  const getStatusIcon = useCallback((status: string) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      completed: '✅',
      cancelled: '❌'
    }
    return icons[status as keyof typeof icons] || '📋'
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getBookings()
      setBookings(response.data)
    } catch (error) {
      console.error('Error loading bookings:', error)
      showToast(t('admin.errorLoadingBookings'), 'error')
    } finally {
      setLoading(false)
    }
  }, [t, showToast])

  const openDetailsModal = useCallback((booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }, [])

  const closeDetailsModal = useCallback(() => {
    setShowDetailsModal(false)
    setSelectedBooking(null)
  }, [])



  const handleDeleteBooking = useCallback(async (id: string) => {
    if (!window.confirm(t('admin.confirmDeleteBooking'))) return
    
    try {
      setBookingOperations(prev => ({ ...prev, deleting: [...prev.deleting, id] }))
      await adminAPI.deleteBooking(id)
      await loadBookings()
      showToast(t('admin.bookingDeleted'), 'success')
    } catch (error) {
      console.error('Error deleting booking:', error)
      showToast(t('admin.errorDeletingBooking'), 'error')
    } finally {
      setBookingOperations(prev => ({ ...prev, deleting: prev.deleting.filter(bookingId => bookingId !== id) }))
    }
  }, [loadBookings, showToast, t])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="bookings-management">
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
      
      <div className="section-header">
        <h2>{t('admin.bookingsManagement')}</h2>
        <button onClick={loadBookings} className="btn-refresh">
          🔄 {t('admin.refresh')}
        </button>
      </div>

      <div className="bookings-grid">
        {bookings.map(booking => (
          <BookingCard
            key={booking._id}
            booking={booking}
            formatDate={formatDate}
            formatTotal={formatTotal}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            openDetailsModal={openDetailsModal}
            handleDeleteBookingLocal={handleDeleteBooking}
            bookingOperations={bookingOperations}
            t={t}
          />
        ))}
      </div>

      {showDetailsModal && selectedBooking && (
        <PortalModal isOpen={showDetailsModal} onClose={closeDetailsModal}>
          <div className="booking-details">
            <h2>{t('admin.bookingDetails')}</h2>
            <div className="details-content">
              <div className="detail-section">
                <h3>{t('admin.customerInformation')}</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>{t('admin.name')}:</label>
                    <span>{selectedBooking.user.name || t('admin.noName')}</span>
                  </div>
                  <div className="detail-item">
                    <label>{t('admin.email')}:</label>
                    <span>{selectedBooking.user.email || t('admin.noEmail')}</span>
                  </div>
                  <div className="detail-item">
                    <label>{t('admin.phone')}:</label>
                    <span>{selectedBooking.user.phone || t('admin.noPhone')}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>{t('admin.bookingInformation')}</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>{t('admin.date')}:</label>
                    <span>{formatDate(selectedBooking.date, selectedBooking.time)}</span>
                  </div>
                  <div className="detail-item">
                    <label>{t('admin.status')}:</label>
                    <span style={{ color: getStatusColor(selectedBooking.status) }}>
                      {getStatusIcon(selectedBooking.status)} {t(`admin.${selectedBooking.status}`) || selectedBooking.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>{t('admin.vehicle')}:</label>
                    <span>{selectedBooking.make} {selectedBooking.model}</span>
                  </div>
                  <div className="detail-item">
                    <label>{t('admin.bodyType')}:</label>
                    <span>{selectedBooking.body}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>{t('admin.services')}</h3>
                <div className="services-list">
                  {selectedBooking.services.map((service, index) => (
                    <div key={index} className="service-item">
                      <span>{t(`services.${service.name}`) || service.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="detail-section">
                <h3>{t('admin.total')}</h3>
                <div className="total-amount">
                  {formatTotal(selectedBooking.total)}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeDetailsModal} className="close-modal-btn">{t('close')}</button>
            </div>
          </div>
        </PortalModal>
      )}
    </div>
  )
}

// Componentă GalleryManagement optimizată
const GalleryManagement: React.FC<GalleryManagementProps> = ({ t }) => {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [newImage, setNewImage] = useState({ title: '', alt_text: '', url: '', category: '', order: 0 })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const loadImages = useCallback(async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getGallery()
      setImages(response.data)
    } catch (error) {
      console.error('Error loading images:', error)
      showToast(t('admin.errorLoadingImages'), 'error')
    } finally {
      setLoading(false)
    }
  }, [t, showToast])

  const handleAddImage = useCallback(async () => {
    if (!newImage.title || !newImage.alt_text || !newImage.url) {
      showToast(t('admin.pleaseFillAllFields'), 'error')
      return
    }

    try {
      await adminAPI.uploadImage({
        url: newImage.url,
        alt_text: newImage.alt_text,
        category: newImage.category,
        active: true
      })
      await loadImages()
      setShowAddModal(false)
      setNewImage({ title: '', alt_text: '', url: '', category: '', order: 0 })
      showToast(t('admin.imageAdded'), 'success')
    } catch (error) {
      console.error('Error adding image:', error)
      showToast(t('admin.errorAddingImage'), 'error')
    }
  }, [newImage, loadImages, showToast, t])

  const handleEditImage = useCallback(async (image: GalleryImage) => {
    try {
      await adminAPI.updateImage(image._id, {
        alt_text: image.alt_text,
        category: image.category
      })
      await loadImages()
      setEditingImage(null)
      showToast(t('admin.imageUpdated'), 'success')
    } catch (error) {
      console.error('Error updating image:', error)
      showToast(t('admin.errorUpdatingImage'), 'error')
    }
  }, [loadImages, showToast, t])

  const handleDeleteImage = useCallback(async (id: string) => {
    if (!window.confirm(t('admin.confirmDeleteImage'))) return
    
    try {
      await adminAPI.deleteImage(id)
      await loadImages()
      showToast(t('admin.imageDeleted'), 'success')
    } catch (error) {
      console.error('Error deleting image:', error)
      showToast(t('admin.errorDeletingImage'), 'error')
    }
  }, [loadImages, showToast, t])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>{t('admin.loading')}</p>
      </div>
    )
  }

  return (
    <div className="gallery-management">
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
      
      <div className="section-header">
        <h2>{t('admin.galleryManagement')}</h2>
        <button onClick={() => setShowAddModal(true)} className="btn-add">
          ➕ {t('admin.addImage')}
        </button>
      </div>

      <div className="gallery-grid">
        {images.map(image => (
          <div key={image._id} className="gallery-item">
            <img src={image.url} alt={image.alt_text} loading="lazy" />
            <div className="gallery-item-info">
              <h3>{image.title}</h3>
              <p>{image.alt_text}</p>
              <div className="gallery-item-actions">
                <button onClick={() => setEditingImage(image)} className="btn-edit">
                  {t('admin.edit')}
                </button>
                <button onClick={() => handleDeleteImage(image._id)} className="btn-delete">
                  {t('admin.delete')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <PortalModal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
          <div className="add-image-modal">
            <h2>{t('admin.addImage')}</h2>
            <div className="form-group">
              <label>{t('admin.title')}:</label>
              <input
                type="text"
                value={newImage.title}
                onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t('admin.enterTitle')}
              />
            </div>
            <div className="form-group">
              <label>{t('admin.altText')}:</label>
              <input
                type="text"
                value={newImage.alt_text}
                onChange={(e) => setNewImage(prev => ({ ...prev, alt_text: e.target.value }))}
                placeholder={t('admin.enterAltText')}
              />
            </div>
            <div className="form-group">
              <label>{t('admin.imageUrl')}:</label>
              <input
                type="text"
                value={newImage.url}
                onChange={(e) => setNewImage(prev => ({ ...prev, url: e.target.value }))}
                placeholder={t('admin.enterImageUrl')}
              />
            </div>
            <div className="form-group">
              <label>{t('admin.category')}:</label>
              <input
                type="text"
                value={newImage.category}
                onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                placeholder={t('admin.enterCategory')}
              />
            </div>
            <div className="form-group">
              <label>{t('admin.order')}:</label>
              <input
                type="number"
                value={newImage.order}
                onChange={(e) => setNewImage(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                placeholder={t('admin.enterOrder')}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleAddImage} className="btn-save">
                {t('admin.save')}
              </button>
              <button onClick={() => setShowAddModal(false)} className="btn-cancel">
                {t('admin.cancel')}
              </button>
            </div>
          </div>
        </PortalModal>
      )}

      {editingImage && (
        <PortalModal isOpen={!!editingImage} onClose={() => setEditingImage(null)}>
          <div className="edit-image-modal">
            <h2>{t('admin.editImage')}</h2>
            <div className="form-group">
              <label>{t('admin.title')}:</label>
              <input
                type="text"
                value={editingImage.title}
                onChange={(e) => setEditingImage(prev => prev ? { ...prev, title: e.target.value } : null)}
                placeholder={t('admin.enterTitle')}
              />
            </div>
            <div className="form-group">
              <label>{t('admin.altText')}:</label>
              <input
                type="text"
                value={editingImage.alt_text}
                onChange={(e) => setEditingImage(prev => prev ? { ...prev, alt_text: e.target.value } : null)}
                placeholder={t('admin.enterAltText')}
              />
            </div>
            <div className="form-group">
              <label>{t('admin.imageUrl')}:</label>
              <input
                type="text"
                value={editingImage.url}
                onChange={(e) => setEditingImage(prev => prev ? { ...prev, url: e.target.value } : null)}
                placeholder={t('admin.enterImageUrl')}
              />
            </div>
            <div className="form-group">
              <label>{t('admin.category')}:</label>
              <input
                type="text"
                value={editingImage.category}
                onChange={(e) => setEditingImage(prev => prev ? { ...prev, category: e.target.value } : null)}
                placeholder={t('admin.enterCategory')}
              />
            </div>
            <div className="form-group">
              <label>{t('admin.order')}:</label>
              <input
                type="number"
                value={editingImage.order}
                onChange={(e) => setEditingImage(prev => prev ? { ...prev, order: parseInt(e.target.value) || 0 } : null)}
                placeholder={t('admin.enterOrder')}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => handleEditImage(editingImage)} className="btn-save">
                {t('admin.save')}
              </button>
              <button onClick={() => setEditingImage(null)} className="btn-cancel">
                {t('admin.cancel')}
              </button>
            </div>
          </div>
        </PortalModal>
      )}
    </div>
  )
}

// Componenta principală Admin
const Admin: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState<'bookings' | 'gallery' | 'services' | 'prices' | 'body-types'>('bookings')
  const [showLogin, setShowLogin] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) {
          setShowLogin(true)
          setLoading(false)
          return
        }
        
        const response = await adminAPI.verifyToken(token)
        if (response.data && response.data.valid) {
          setShowLogin(false)
        } else {
          localStorage.removeItem('adminToken')
          setShowLogin(true)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        localStorage.removeItem('adminToken')
        setShowLogin(true)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setShowLogin(true)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const response = await adminAPI.login(loginForm)
      localStorage.setItem('adminToken', response.data.token)
      setShowLogin(false)
      setLoginForm({ email: '', password: '' })
    } catch (error) {
      console.error('Login error:', error)
      setLoginError(t('loginFailed') || 'Invalid credentials')
    }
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>{t('admin.loading')}</p>
      </div>
    )
  }

  if (showLogin) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-form">
          <h2>{t('login') || 'Admin Login'}</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>{t('email') || 'Email'}:</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder={t('email') || 'Enter email'}
              />
            </div>
            <div className="form-group">
              <label>{t('password') || 'Password'}:</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
                placeholder={t('password') || 'Enter password'}
              />
            </div>
            {loginError && <div className="error-message">{loginError}</div>}
            <button type="submit" className="login-btn">
              {t('login') || 'Login'}
            </button>
            <div className="login-actions">
              <button 
                type="button" 
                className="forgot-password-btn"
                onClick={() => window.location.href = '/admin/reset-password'}
              >
                {t('forgotPassword') || 'Forgot Password?'}
              </button>
              <button 
                type="button" 
                className="home-btn"
                onClick={() => window.location.href = '/'}
                title={t('backToHome') || 'Back to Home'}
              >
                🏠
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>{t('admin.panel')}</h1>
        <button onClick={handleLogout} className="logout-btn">
          {t('admin.logout')}
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          {t('admin.bookings')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          {t('admin.gallery')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          {t('admin.services')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'prices' ? 'active' : ''}`}
          onClick={() => setActiveTab('prices')}
        >
          {t('admin.prices')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'body-types' ? 'active' : ''}`}
          onClick={() => setActiveTab('body-types')}
        >
          {t('admin.bodyTypes')}
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'bookings' && <BookingsManagement t={t} i18n={i18n} />}
        {activeTab === 'gallery' && <GalleryManagement t={t} i18n={i18n} />}
        {activeTab === 'services' && <div>{t('admin.servicesManagement')}</div>}
        {activeTab === 'prices' && <div>{t('admin.pricesManagement')}</div>}
        {activeTab === 'body-types' && <div>{t('admin.bodyTypesManagement')}</div>}
      </div>
    </div>
  )
}

export default Admin