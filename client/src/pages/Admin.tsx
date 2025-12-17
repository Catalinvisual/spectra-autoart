import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { adminAPI, publicAPI } from '../services/api'
import api from '../services/api'
import { useToast } from '../contexts/ToastContext'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { CalendarComponent } from '../components/BookingWizard'
import { useCalendarSync, calendarSyncManager } from '../hooks/useCalendarSync'
import '../components/BookingWizard.css'
import './Admin.css'
import i18n from '../i18n'
import { useLanguage } from '../contexts/LanguageContext'

interface Booking {
  id: string
  user: {
    name: string
    email: string
    phone: string
  }
  date: string
  time?: string
  services: Array<{
    id: string
    name: string
  }>
  total: number
  status: string
  make?: string
  model?: string
  body?: string
  newsletter?: boolean
  locale?: string
}



interface Subscriber {
  email: string
  subscribedAt: string
}

interface BodyType {
  id: string
  key: string
  name: string
  name_en?: string
  name_nl?: string
  name_es?: string
  name_pl?: string
  name_ro?: string
  description?: string
  description_en?: string
  description_nl?: string
  description_es?: string
  description_pl?: string
  description_ro?: string
  is_active: boolean
  sort_order: number
}

interface ServicePrice {
  id: string
  service_id: string
  body_type_key: string
  price_min: number
  price_max?: number
  duration_minutes: number
  is_active: boolean
}

interface VehicleService {
  id: string
  name: string
  name_en?: string
  name_nl?: string
  name_es?: string
  name_pl?: string
  name_ro?: string
  description: string
  description_en?: string
  description_nl?: string
  description_es?: string
  description_pl?: string
  description_ro?: string
  category: string
  category_en?: string
  category_nl?: string
  category_es?: string
  category_pl?: string
  category_ro?: string
  duration_minutes: number
  is_active: boolean
  prices: ServicePrice[]
}

const Admin: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { currentLanguage, setLanguage } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [bookingsRefreshKey, setBookingsRefreshKey] = useState(0)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false)
  


  // Force Dutch or Romanian for admin panel
  useEffect(() => {
    const currentLang = i18n.language
    if (!['nl', 'ro'].includes(currentLang)) {
      i18n.changeLanguage('nl')
    }
  }, [i18n])

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  // Check for password reset token in URL
  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setResetToken(token)
      setShowResetPasswordForm(true)
    }
  }, [searchParams])

  // Session expiration check
  useEffect(() => {
    if (!isAuthenticated) return

    const checkSession = async () => {
      try {
        const response = await adminAPI.checkSession()
        if (!response.data.valid) {
          // Session expired, logout
          handleLogout()
          toast.showError('Sesiunea a expirat. Vă rugăm să vă autentificați din nou.')
        }
      } catch (error) {
        // Token invalid or expired
        handleLogout()
        toast.showError('Sesiunea a expirat. Vă rugăm să vă autentificați din nou.')
      }
    }

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000)
    
    // Also check on window focus (when user returns to the tab)
    const handleFocus = () => {
      if (isAuthenticated) {
        checkSession()
      }
    }
    
    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Always use API login to get a proper JWT token
      const response = await adminAPI.login({ email: loginForm.email, password: loginForm.password })
      localStorage.setItem('adminToken', response.data.token)
      setIsAuthenticated(true)
      
    } catch (error) {
      console.error('Login error:', error)
      toast.showError(t('admin.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const deleteBooking = (id: string) => {
    setBookingToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDeleteBooking = async () => {
    if (bookingToDelete) {
      try {
        // Apel către server pentru ștergere
        await adminAPI.deleteBooking(bookingToDelete)
        
        // Reîmprospătează lista pentru sincronizare completă (instantă)
        setBookingsRefreshKey(prev => prev + 1)
        
        toast.showSuccess(t('admin.bookingDeleted'))
      } catch (error) {
        console.error('Error deleting booking:', error)
        toast.showError(t('admin.errorDeletingBooking'))
        
        // În caz de eroare, reîmprospătează lista pentru a restaura starea
        setBookingsRefreshKey(prev => prev + 1)
      } finally {
        setShowDeleteModal(false)
        setBookingToDelete(null)
      }
    }
  }

  const cancelDeleteBooking = () => {
    setShowDeleteModal(false)
    setBookingToDelete(null)
  }

  const handleForgotPassword = () => {
    setShowResetForm(true)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Call the forgot password API
      await adminAPI.forgotPassword()
      toast.showSuccess(t('passwordResetSent', { email: 'contact@spectraautoart.nl' }))
      setShowResetForm(false)
    } catch (error) {
      console.error('Password reset error:', error)
      toast.showError(t('passwordResetError'))
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setShowResetForm(false)
    setShowResetPasswordForm(false)
    setResetToken('')
    setNewPassword('')
    setConfirmPassword('')
    navigate('/admin')
  }

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.showError('Wachtwoorden komen niet overeen')
      return
    }
    
    if (newPassword.length < 6) {
      toast.showError('Wachtwoord moet minimaal 6 tekens bevatten')
      return
    }

    setLoading(true)
    try {
      await adminAPI.resetPassword(resetToken, newPassword)
      toast.showSuccess('Wachtwoord succesvol gereset! U kunt nu inloggen.')
      setShowResetPasswordForm(false)
      setResetToken('')
      setNewPassword('')
      setConfirmPassword('')
      navigate('/admin')
    } catch (error) {
      console.error('Reset password error:', error)
      toast.showError('Wachtwoord reset mislukt. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="login-header">
            <h2>{t('adminPanel')}</h2>
            <button onClick={handleGoHome} className="home-btn" title={t('goHome')}>
              ← {t('home')}
            </button>
          </div>
          
          {showResetPasswordForm ? (
            <div className="reset-password-form">
              <h3>Wachtwoord Resetten</h3>
              <form onSubmit={handleResetPasswordSubmit}>
                <div className="form-group">
                  <label>Nieuw Wachtwoord</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>Bevestig Wachtwoord</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Bezig...' : 'Wachtwoord Resetten'}
                </button>
              </form>
              <div className="login-footer">
                <button onClick={handleBackToLogin} className="back-to-login-btn">
                  ← {t('back')}
                </button>
              </div>
            </div>
          ) : !showResetForm ? (
            <>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>{t('login')}</label>
                  <input
                    type="text"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('password')}</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? t('loggingIn') : t('login')}
                </button>
              </form>
              <div className="login-footer">
                <button onClick={handleForgotPassword} className="forgot-password-btn">
                  {t('forgotPassword')}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="forgot-password-info">
                <p className="reset-password-message">
                  {t('passwordResetWillBeSent')}
                </p>
                <div className="default-email-display">
                  <strong>contact@spectraautoart.nl</strong>
                </div>
              </div>
              <form onSubmit={handleResetPassword}>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? t('sendingDots') : t('sendResetLink')}
                </button>
              </form>
              <div className="login-footer">
                <button onClick={handleBackToLogin} className="back-to-login-btn">
                  ← {t('back')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>{t('adminPanel')}</h1>
        <div className="header-actions">
          <button onClick={handleGoHome} className="home-btn">
            🏠 {t('home')}
          </button>
          <select 
            value={currentLanguage} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-selector"
          >
            <option value="nl">Nederlands</option>
            <option value="ro">Română</option>
          </select>
          <button onClick={handleLogout} className="logout-btn">
            {t('logout')}
          </button>
        </div>
      </header>

      <div className="admin-content">
        <nav className="admin-nav">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            {t('admin.dashboard')}
          </button>
          <button 
            className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            {t('bookings')}
          </button>

          <button 
            className={`nav-btn ${activeTab === 'vehicle-services' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicle-services')}
          >
            {t('vehicleServices')}
          </button>
          <button 
            className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            {t('galleryAdmin')}
          </button>
          <button 
            className={`nav-btn ${activeTab === 'newsletter' ? 'active' : ''}`}
            onClick={() => setActiveTab('newsletter')}
          >
            {t('newsletterSubscribers')}
          </button>
        </nav>

        <main className="admin-main">
          {activeTab === 'dashboard' && <Dashboard isAuthenticated={isAuthenticated} />}
          {activeTab === 'bookings' && <BookingsManagement onDeleteBooking={deleteBooking} refreshKey={bookingsRefreshKey} isAuthenticated={isAuthenticated} />}

          {activeTab === 'vehicle-services' && <VehicleServicesManagement isAuthenticated={isAuthenticated} />}
          {activeTab === 'gallery' && <GalleryManagement isAuthenticated={isAuthenticated} />}
          {activeTab === 'newsletter' && <NewsletterManagement isAuthenticated={isAuthenticated} />}
        </main>
      </div>

      {/* Delete Confirmation Modal - Moved to admin-panel level for proper positioning */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={cancelDeleteBooking}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗑️ {t('admin.confirmDelete')}</h2>
              <button onClick={cancelDeleteBooking} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <div className="warning-icon">⚠️</div>
                <p>{t('admin.deleteBookingWarning')}</p>
                <p className="delete-note">{t('admin.thisActionCannotBeUndone')}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={confirmDeleteBooking} className="delete-confirm-btn">
                🗑️ {t('admin.confirmDelete')}
              </button>
              <button onClick={cancelDeleteBooking} className="cancel-btn">
                {t('admin.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Dashboard Component
interface DashboardProps {
  isAuthenticated: boolean
}

const Dashboard: React.FC<DashboardProps> = ({ isAuthenticated }) => {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalSubscribers: 0
  })

  useEffect(() => {
    // Load dashboard stats
    const loadStats = async () => {
      try {
        const bookingsResponse = await adminAPI.getBookings()
        const subscribersResponse = await adminAPI.getNewsletterSubscribers()

        const bookings = bookingsResponse.data
        setStats({
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
          totalSubscribers: subscribersResponse.data.length
        })
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      }
    }

    if (isAuthenticated) {
      loadStats()
    }
  }, [isAuthenticated])

  return (
    <div className="dashboard">
      <h2>{t('admin.dashboard')}</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{t('admin.totalBookings')}</h3>
          <p className="stat-number">{stats.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>{t('admin.pendingBookings')}</h3>
          <p className="stat-number">{stats.pendingBookings}</p>
        </div>

        <div className="stat-card">
          <h3>{t('admin.newsletterSubscribers')}</h3>
          <p className="stat-number">{stats.totalSubscribers}</p>
        </div>
      </div>
    </div>
  )
}

// Bookings Management Component
interface BookingsManagementProps {
  onDeleteBooking: (id: string) => void
  onBookingDeleted?: (id: string) => void
  refreshKey?: number
  isAuthenticated: boolean
}

const BookingsManagement: React.FC<BookingsManagementProps> = ({ onDeleteBooking, refreshKey, isAuthenticated }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [originalBooking, setOriginalBooking] = useState<Booking | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const { bookedDates: bookedDatesAdmin } = useCalendarSync()
  const [bookingOperations, setBookingOperations] = useState<{
    updating: string[]
    deleting: string[]
  }>({ updating: [], deleting: [] })

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (refreshKey && refreshKey > 0) {
      loadBookings()
    }
  }, [refreshKey])

  const loadBookings = async () => {
    try {
      const response = await adminAPI.getBookings()
      
      // Transform server data to match frontend structure
      const normalizeStatus = (value: string) => {
        const v = String(value || '').toLowerCase().trim()
        if (!v) return 'pending'
        if (['pending', 'în așteptare', 'in asteptare', 'in așteptare'].includes(v)) return 'pending'
        if (['confirmed', 'confirmat', 'bevestigd'].includes(v)) return 'confirmed'
        if (['cancelled', 'anulat', 'geannuleerd'].includes(v)) return 'cancelled'
        if (['completed', 'finalizat', 'afgerond'].includes(v)) return 'completed'
        return 'pending'
      }
      const transformedBookings = response.data.map((booking: any) => {
        return {
          id: booking.id,
          user: {
            name: booking.customer_name || booking.user?.name || '',
            email: booking.customer_email || booking.user?.email || '',
            phone: booking.customer_phone || booking.user?.phone || ''
          },
          date: booking.date || '',
          time: booking.time || '',
          services: Array.isArray(booking.services) ? booking.services.map((service: any) => ({
            id: service.id || service.name || '',
            name: service.name || ''
          })) : (typeof booking.services === 'string' ? [{ id: booking.services, name: booking.services }] : []),
          total: typeof booking.total === 'string' ? parseFloat(booking.total) : booking.total || 0,
          status: normalizeStatus(booking.status),
          make: booking.make || booking.vehicle_make || '',
          model: booking.model || booking.vehicle_model || '',
          body: booking.body || booking.vehicle_body || ''
        }
      })
      
      setBookings(transformedBookings)
      
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string, time?: string) => {
    if (!dateString || dateString === 'Invalid Date') {
      return t('admin.noDate') || 'No date specified'
    }
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return t('admin.invalidDate') || 'Invalid date'
      }
      
      // Format date and time separately for better visual appeal
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
  }

  const formatServices = (services: any[]) => {
    if (!Array.isArray(services) || services.length === 0) {
      return t('admin.noServices') || 'No services selected'
    }
    
    return services.map((service: any) => {
      let serviceName = ''
      if (typeof service.name === 'object') {
        serviceName = service.name[i18n.language] || service.name.nl || service.name.en || service.name
      } else {
        serviceName = service.name || t('admin.unknownService') || 'Unknown service'
      }
      
      // Include price if available and greater than 0
      if (service.price && service.price > 0) {
        return `${serviceName} (€${service.price})`
      }
      
      return serviceName
    }).join(', ')
  }

  const formatTotal = (total: number) => {
    const numTotal = parseFloat(String(total)) || 0
    return `€${numTotal.toFixed(2)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#2ecc71'
      case 'confirmed': return '#00e5ff'
      case 'cancelled': return '#ff4757'
      case 'pending':
      default: return '#ffa502'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'confirmed': return '' // Removed green check icon
      case 'cancelled': return '❌'
      case 'pending':
      default: return '⏳'
    }
  }

  const openDetailsModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setSelectedBooking(null)
    setShowDetailsModal(false)
  }

  const handleDeleteBookingLocal = (bookingId: string) => {
    // Marchează operațiunea de ștergere ca în desfășurare
    setBookingOperations(prev => ({ ...prev, deleting: [...prev.deleting, bookingId] }))
    
    // NU șterge local încă - așteaptă confirmarea
    // Apel callback pentru ștergerea pe server (deschide modalul de confirmare)
    if (onDeleteBooking) {
      onDeleteBooking(bookingId)
    }
  }

  const openEditModal = (booking: Booking) => {
    console.log('📝 DEBUG openEditModal called with booking:', booking)
    // Stocăm o copie deep a datelor originale pentru comparație
    const originalCopy = JSON.parse(JSON.stringify(booking))
    setOriginalBooking(originalCopy)
    setEditingBooking(booking)
    setShowEditModal(true)
  }

  const hasUnsavedChanges = () => {
    if (!editingBooking || !originalBooking) return false
    
    console.log('🔍 DEBUG hasUnsavedChanges:')
    console.log('📋 Original:', originalBooking)
    console.log('✏️ Current:', editingBooking)
    console.log('📅 Original date:', JSON.stringify(originalBooking.date))
    console.log('📅 Current date:', JSON.stringify(editingBooking.date))
    console.log('📅 Date comparison:', originalBooking.date !== editingBooking.date)
    console.log('⏰ Original time:', JSON.stringify(originalBooking.time))
    console.log('⏰ Current time:', JSON.stringify(editingBooking.time))
    console.log('⏰ Time changed:', originalBooking.time !== editingBooking.time)
    console.log('📊 Status changed:', originalBooking.status !== editingBooking.status)
    
    const hasChanges = (
      originalBooking.status !== editingBooking.status ||
      originalBooking.date !== editingBooking.date ||
      originalBooking.time !== editingBooking.time ||
      originalBooking.user.name !== editingBooking.user.name ||
      originalBooking.user.email !== editingBooking.user.email ||
      originalBooking.user.phone !== editingBooking.user.phone
    )
    
    console.log('🔄 Has unsaved changes:', hasChanges)
    return hasChanges
  }

  const closeEditModal = () => {
    console.log('🚪 closeEditModal called')
    // Verificăm dacă există modificări nesalvate
    if (hasUnsavedChanges()) {
      console.log('⚠️ Unsaved changes detected, showing confirmation dialog')
      const confirmClose = window.confirm('Aveți modificări nesalvate. Sigur doriți să închideți?')
      if (!confirmClose) {
        console.log('❌ User cancelled modal close')
        return
      }
      console.log('✅ User confirmed modal close despite unsaved changes')
    }
    
    console.log('🔄 Closing edit modal and resetting state')
    setEditingBooking(null)
    setOriginalBooking(null)
    setShowEditModal(false)
  }

  // Funcție pentru curățarea operațiunilor blocate din BookingsManagement
  const clearLocalBlockedOperations = () => {
    setBookingOperations({ updating: [], deleting: [] })
  }

  // Calendar sync is handled by useCalendarSync hook - no need for local updates

  useEffect(() => {
    const active = showDetailsModal || showEditModal
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    if (active) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
    }
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
    }
  }, [showDetailsModal, showEditModal])

  // Calendar sync is now handled by useCalendarSync hook


  const saveBookingEdit = async () => {
    if (!editingBooking || !originalBooking) return
    
    try {
      console.log('🔍 DEBUG saveBookingEdit:')
      console.log('📋 Original booking:', originalBooking)
      console.log('✏️ Editing booking:', editingBooking)
      console.log('📅 Date comparison:', originalBooking.date, '!==', editingBooking.date, '=', originalBooking.date !== editingBooking.date)
      console.log('⏰ Time comparison:', originalBooking.time, '!==', editingBooking.time, '=', originalBooking.time !== editingBooking.time)
      console.log('📊 Status comparison:', originalBooking.status, '!==', editingBooking.status, '=', originalBooking.status !== editingBooking.status)
      
      // Verifică dacă există modificări
      const hasChanges = 
        originalBooking.status !== editingBooking.status ||
        originalBooking.date !== editingBooking.date ||
        originalBooking.time !== editingBooking.time ||
        originalBooking.user.name !== editingBooking.user.name ||
        originalBooking.user.email !== editingBooking.user.email ||
        originalBooking.user.phone !== editingBooking.user.phone
      
      if (!hasChanges) {
        // Nu există modificări, doar închide modalul fără să verificăm din nou
        setEditingBooking(null)
        setOriginalBooking(null)
        setShowEditModal(false)
        return
      }
      
      // Marchează operațiunea ca în desfășurare
      setBookingOperations(prev => ({ ...prev, updating: [...prev.updating, editingBooking.id] }))
      
      // Optimizare: Actualizează imediat UI pentru feedback instant
      setBookings(prev => prev.map((b: Booking) => b.id === editingBooking.id ? { 
        ...b, 
        status: editingBooking.status, 
        date: editingBooking.date, 
        time: editingBooking.time,
        make: editingBooking.make,
        model: editingBooking.model,
        body: editingBooking.body
      } : b))
      
      // Închide modalul imediat
      setShowEditModal(false)
      setEditingBooking(null)
      
      // Afișează notificare de succes imediat
      toast.showSuccess(t('admin.status') + ' ' + t(`admin.${editingBooking.status}`))
      
      // Salvează pe server în background fără să blocheze UI
      try {
        const response = await adminAPI.updateBooking(editingBooking.id, { 
          status: editingBooking.status, 
          date: editingBooking.date, 
          time: editingBooking.time,
          make: editingBooking.make,
          model: editingBooking.model,
          body: editingBooking.body
        })
        
        // Verificăm răspunsul de la server doar pentru debugging
        if (response.data && response.data.hasChanges === false) {
          console.log('No changes detected on server')
        }
        
        // Notifică toate componentele să reîmprospăteze calendarul
        calendarSyncManager.notifyRefresh()
        
      } catch (error) {
        console.error('Error updating booking:', error)
        // Dacă actualizarea eșuează, reîmprospătează lista completă
        toast.showError(t('admin.errorUpdatingBooking') || 'Error updating booking')
        loadBookings()
      } finally {
        // Elimină din lista de operațiuni active
        setBookingOperations(prev => ({ 
          ...prev, 
          updating: prev.updating.filter(id => id !== editingBooking.id) 
        }))
      }
      setOriginalBooking(null)
      setShowEditModal(false)
    } catch (error) {
      console.error('Error updating booking:', error)
      toast.showError(t('admin.status') + ' ' + t('admin.updateFailed'))
    }
  }

  if (loading) return <div className="loading">{t('admin.loadingBookings')}</div>

  return (
    <div className="bookings-management">
      <div className="bookings-header">
        <h2>{t('admin.bookingsManagement')}</h2>
        <div className="bookings-stats">
          <span className="stat-item">
            <strong>{bookings.length}</strong> {t('admin.totalBookings')}
          </span>
          <span className="stat-item">
            <strong>{bookings.filter(b => b.status === 'pending').length}</strong> {t('admin.pending')}
          </span>
          {(bookingOperations.updating.length > 0 || bookingOperations.deleting.length > 0) && (
            <button 
              onClick={clearLocalBlockedOperations}
              className="clear-operations-btn"
              title={t('admin.clearBlockedOperations') || 'Curăță operațiunile blocate'}
            >
              🔄 {t('admin.clear') || 'Curăță'}
            </button>
          )}
          <span className="stat-item">
            <strong>{bookings.filter(b => b.status === 'confirmed').length}</strong> {t('admin.confirmed')}
          </span>
        </div>
      </div>
      
      <div className="bookings-grid">
        {Array.isArray(bookings) && bookings.map((booking: any) => (
          <div key={booking.id} className="booking-card">
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
                <div className="customer-avatar">
                  {booking.user.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="customer-details">
                  <h3>{booking.user.name || t('admin.noName')}</h3>
                  <p className="customer-email">📧 {booking.user.email || t('admin.noEmail')}</p>
                  <p className="customer-phone">📱 {booking.user.phone || t('admin.noPhone')}</p>
                </div>
              </div>
              

              
              <div className="booking-services">
                <h4>{t('services')}:</h4>
                <p>{formatServices(booking.services)}</p>
              </div>
              
              <div className="booking-total">
                <span className="total-label">{t('admin.total')}:</span>
                <span className="total-amount">{formatTotal(booking.total)}</span>
              </div>
            </div>
            
            <div className="booking-card-actions">
              <button 
                onClick={() => openDetailsModal(booking)}
                className="details-btn"
                title={t('admin.viewDetails')}
              >
                👁️ {t('admin.details')}
              </button>
              <button 
                onClick={() => openEditModal(booking)}
                className="edit-btn"
                title={t('admin.editBooking')}
                disabled={bookingOperations.updating.includes(booking.id) || bookingOperations.deleting.includes(booking.id)}
              >
                {bookingOperations.updating.includes(booking.id) ? '⏳' : '✏️'} {t('admin.edit')}
              </button>

              

              <button 
                onClick={() => handleDeleteBookingLocal(booking.id)} 
                className="delete-btn"
                title={t('admin.deleteBooking')}
                disabled={bookingOperations.updating.includes(booking.id) || bookingOperations.deleting.includes(booking.id)}
              >
                {bookingOperations.deleting.includes(booking.id) ? '⏳' : '🗑️'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <PortalModal isOpen={showDetailsModal} onClose={closeDetailsModal} overlayClass="details-modal" contentClass="modal-content details-modal-content">
          <div>
            <div className="modal-header">
              <h2>{t('admin.bookingDetails')}</h2>
              <button onClick={closeDetailsModal} className="close-btn" aria-label={t('close')}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>{t('admin.customerInformation')}</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>{t('admin.name')}:</label>
                    <span>{selectedBooking.user.name || t('admin.notSpecified')}</span>
                  </div>
                  <div className="detail-item">
                    <label>{t('admin.email')}:</label>
                    <span>{selectedBooking.user.email || t('admin.notSpecified')}</span>
                  </div>
                  <div className="detail-item">
                    <label>{t('admin.phone')}:</label>
                    <span>{selectedBooking.user.phone || t('admin.notSpecified')}</span>
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
                      {getStatusIcon(selectedBooking.status)} {t(selectedBooking.status) || selectedBooking.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>{t('admin.total')}:</label>
                    <span className="total-highlight">{formatTotal(selectedBooking.total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>{t('services')}</h3>
                <div className="services-list">
                  {Array.isArray(selectedBooking.services) && selectedBooking.services.length > 0 ? (
                    selectedBooking.services.map((service: any, index: number) => (
                      <div key={service.id || service.name || `service-${index}`} className="service-item-detail">
                        {typeof service.name === 'object' 
                          ? service.name[i18n.language] || service.name.nl || service.name.en || service.name
                          : service.name
                        }
                      </div>
                    ))
                  ) : (
                    <p>{t('admin.noServices')}</p>
                  )}
                </div>
              </div>
              
              {selectedBooking.newsletter && (
                <div className="detail-section">
                  <h3>{t('admin.newsletter')}</h3>
                  <p>✅ {t('admin.subscribedToNewsletter')}</p>
                </div>
              )}
            </div>
          </div>
        </PortalModal>
      )}

      {/* Edit Modal */}
      {showEditModal && editingBooking && (
        <PortalModal isOpen={showEditModal} onClose={closeEditModal} contentClass="modal-content edit-modal-content" preventOverlayClose={true}>
            <div className="modal-header">
              <h2>{t('admin.editBooking')}</h2>
              <button onClick={() => {
                console.log('❌ Close button clicked')
                closeEditModal()
              }} className="close-btn" aria-label={t('close')} style={{cursor: 'pointer'}}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { 
                console.log('📝 DEBUG: Form submitted!') 
                e.preventDefault(); 
                saveBookingEdit(); 
              }}>
                <div className="form-group">
                  <label>{t('admin.customerName')}:</label>
                  <input
                    type="text"
                    value={editingBooking.user.name || ''}
                    onChange={(e) => setEditingBooking({
                      ...editingBooking,
                      user: { ...editingBooking.user, name: e.target.value }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>{t('admin.email')}:</label>
                  <input
                    type="email"
                    value={editingBooking.user.email || ''}
                    onChange={(e) => setEditingBooking({
                      ...editingBooking,
                      user: { ...editingBooking.user, email: e.target.value }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>{t('admin.phone')}:</label>
                  <input
                    type="tel"
                    value={editingBooking.user.phone || ''}
                    onChange={(e) => setEditingBooking({
                      ...editingBooking,
                      user: { ...editingBooking.user, phone: e.target.value }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>{t('admin.date')}:</label>
                  <input
                    type="date"
                    value={(editingBooking.date || '').substring(0, 10)}
                    onChange={(e) => setEditingBooking({
                      ...editingBooking,
                      date: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>{t('admin.time') || 'Ora'}:</label>
                  <input
                    type="time"
                    value={(editingBooking.time || '').replace(/^'+/, '')}
                    onChange={(e) => setEditingBooking({
                      ...editingBooking,
                      time: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>{t('selectDate')}</label>
                  <CalendarComponent
                    selectedDate={editingBooking.date || ''}
                    onDateSelect={(date) => setEditingBooking({ ...editingBooking, date })}
                    bookedDates={bookedDatesAdmin}
                  />
                </div>
                <div className="form-group">
                  <label>{t('selectTime')}</label>
                  <input
                    type="time"
                    value={editingBooking.time || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, time: e.target.value })}
                    min="09:00"
                    max="18:00"
                  />
                </div>
                <div className="form-group">
                  <label>{t('admin.status')}:</label>
                  <select
                    value={editingBooking.status}
                    onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })}
                  >
                    <option value="pending">{t('admin.pending')}</option>
                    <option value="confirmed">{t('admin.confirmed')}</option>
                    <option value="cancelled">{t('admin.cancelled')}</option>
                    <option value="completed">{t('admin.completed')}</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">{t('admin.save')}</button>
                  <button type="button" onClick={() => {
                    console.log('🚫 Cancel button clicked')
                    closeEditModal()
                  }} className="cancel-btn">{t('admin.cancel')}</button>
                </div>
              </form>
            </div>
        </PortalModal>
      )}
    </div>
  )
}

// Services Management Component


// Vehicle Services Management Component
interface VehicleServicesManagementProps {
  isAuthenticated: boolean
}

const VehicleServicesManagement: React.FC<VehicleServicesManagementProps> = ({ isAuthenticated }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const [vehicleServices, setVehicleServices] = useState<VehicleService[]>([])
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<VehicleService | null>(null)
  const [showBodyTypesForm, setShowBodyTypesForm] = useState(false)
  const [editingBodyType, setEditingBodyType] = useState<BodyType | null>(null)
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean
    type: 'vehicleService' | 'bodyType' | null
    itemId: string | null
    itemName: string | null
  }>({
    isOpen: false,
    type: null,
    itemId: null,
    itemName: null
  })
  
  useEffect(() => {
    const active = showForm || showBodyTypesForm
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    if (active) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
    }
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
    }
  }, [showForm, showBodyTypesForm])

  
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    name_nl: '',
    name_es: '',
    name_pl: '',
    name_ro: '',
    description: '',
    description_en: '',
    description_nl: '',
    description_es: '',
    description_pl: '',
    description_ro: '',
    category: '',
    category_en: '',
    category_nl: '',
    category_es: '',
    category_pl: '',
    category_ro: '',
    is_active: true,
    prices: [] as ServicePrice[]
  })

  // Track price changes
  useEffect(() => {
    // Prices tracking logic
  }, [formData.prices])

  const [bodyTypeFormData, setBodyTypeFormData] = useState({
    key: '',
    name: '',
    name_en: '',
    name_nl: '',
    name_es: '',
    name_pl: '',
    name_ro: '',
    description: '',
    description_en: '',
    description_nl: '',
    description_es: '',
    description_pl: '',
    description_ro: '',
    is_active: true,
    sort_order: 0
  })

  const loadVehicleServices = async () => {
    try {
      const response = await adminAPI.getVehicleServices()
      setVehicleServices(response.data)
    } catch (error) {
      console.error('Error loading vehicle services:', error)
      toast.showError(t('admin.errorLoadingVehicleServices'))
    }
  }

  const loadBodyTypes = async () => {
    try {
      const response = await adminAPI.getBodyTypes()
      console.log('🔍 BodyTypes API Response:', response.data)
      
      // Log detailed structure of each body type
      response.data.forEach((bt: any, index: number) => {
        console.log(`📋 BodyType[${index}]:`, {
          id: bt?.id,
          key: bt?.key,
          name: bt?.name,
          name_en: bt?.name_en,
          name_nl: bt?.name_nl,
          keys: Object.keys(bt || {}),
          fullObject: bt
        })
      })
      
      // Filter out invalid body types (missing id or key)
      const validBodyTypes = response.data.filter((bt: any) => bt && (bt.key || bt.id))
      console.log('✅ Valid body types:', validBodyTypes)
      console.log('❌ Invalid body types filtered out:', response.data.length - validBodyTypes.length)
      
      // Check for duplicates among valid ids/keys
      const keys = validBodyTypes.map((bt: any) => bt.key || bt.id)
      const duplicates = keys.filter((key: string, index: number) => keys.indexOf(key) !== index)
      if (duplicates.length > 0) {
        console.warn('⚠️ Duplicate body type keys found:', duplicates)
      }
      
      setBodyTypes(validBodyTypes)
    } catch (error) {
      console.error('Error loading body types:', error)
      toast.showError(t('admin.errorLoadingBodyTypes'))
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadVehicleServices()
      loadBodyTypes()
    }
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const normalizedPrices = (formData.prices || [])
        .map(p => ({
          ...p,
          body_type_key: mapFrontendBodyTypeKey((p.body_type_key || '').toString().toLowerCase())
        }))
        .filter(p => p && typeof p.body_type_key === 'string' && p.body_type_key && p.price_min !== undefined && p.price_min !== null)
        .map(p => ({
          body_type_key: String(p.body_type_key).toLowerCase(),
          price_min: p.price_min,
          duration_minutes: p.duration_minutes || 60,
          is_active: p.is_active !== undefined ? p.is_active : true
        }))

      const serviceData = {
        ...formData,
        prices: normalizedPrices
      }
      
      if (editingService) {
        await adminAPI.updateVehicleService(editingService.id, serviceData)
        toast.showSuccess(t('admin.vehicleServiceUpdated'))
      } else {
        // Use the new translation-enabled endpoint for creating services
        await adminAPI.createVehicleServiceWithTranslation(serviceData)
        toast.showSuccess(t('admin.vehicleServiceCreatedWithTranslation'))
      }
      
      setShowForm(false)
      setEditingService(null)
      resetForm()
      loadVehicleServices()
    } catch (error) {
      console.error('Error saving vehicle service:', error)
      toast.showError(t('admin.errorSavingVehicleService'))
    }
  }

  const handleBodyTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingBodyType) {
        await adminAPI.updateBodyType(editingBodyType.id, bodyTypeFormData)
        toast.showSuccess(t('admin.bodyTypeUpdated'))
      } else {
        await adminAPI.createBodyType(bodyTypeFormData)
        toast.showSuccess(t('admin.bodyTypeCreated'))
      }
      
      setShowBodyTypesForm(false)
      setEditingBodyType(null)
      resetBodyTypeForm()
      loadBodyTypes()
    } catch (error) {
      console.error('Error saving body type:', error)
      toast.showError(t('admin.errorSavingBodyType'))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      name_en: '',
      name_nl: '',
      name_es: '',
      name_pl: '',
      name_ro: '',
      description: '',
      description_en: '',
      description_nl: '',
      description_es: '',
      description_pl: '',
      description_ro: '',
      category: '',
      category_en: '',
      category_nl: '',
      category_es: '',
      category_pl: '',
      category_ro: '',
      is_active: true,
      prices: []
    })
  }

  const resetBodyTypeForm = () => {
    setBodyTypeFormData({
      key: '',
      name: '',
      name_en: '',
      name_nl: '',
      name_es: '',
      name_pl: '',
      name_ro: '',
      description: '',
      description_en: '',
      description_nl: '',
      description_es: '',
      description_pl: '',
      description_ro: '',
      is_active: true,
      sort_order: 0
    })
  }

  const editVehicleService = async (service: VehicleService) => {
    const existingNormalized = (service.prices || []).map(p => ({
      ...p,
      body_type_key: mapFrontendBodyTypeKey(String(p.body_type_key || '').toLowerCase()),
      price_min: typeof p.price_min === 'number' ? p.price_min : (parseFloat(String(p.price_min)) || 0),
      duration_minutes: p.duration_minutes || 60,
      is_active: p.is_active !== undefined ? p.is_active : true
    }))

    let completePrices = [...existingNormalized]

    try {
      const lang = i18n.language || 'nl'
      const resp = await publicAPI.getServicesWithPrices(lang)
      const fromSheets = Array.isArray(resp.data) ? resp.data.find((s: any) => String(s.id) === String(service.id)) : null
      if (fromSheets && Array.isArray(fromSheets.prices)) {
        const sheetPrices = fromSheets.prices.map((sp: any) => ({
          id: '',
          service_id: service.id,
          body_type_key: mapFrontendBodyTypeKey(String(sp.body_type_key || '').toLowerCase()),
          price_min: typeof sp.price_min === 'number' ? sp.price_min : (parseFloat(String(sp.price_min)) || 0),
          duration_minutes: typeof sp.duration_minutes === 'number' ? sp.duration_minutes : (parseInt(String(sp.duration_minutes)) || 60),
          is_active: sp.is_active !== false
        }))
        completePrices = sheetPrices
      }
    } catch (_) {}

    // Do not prefill missing body types with 0; keep only existing prices

    setEditingService(service)
    setFormData({
      name: service.name,
      name_en: service.name_en || '',
      name_nl: service.name_nl || '',
      name_es: service.name_es || '',
      name_pl: service.name_pl || '',
      name_ro: service.name_ro || '',
      description: service.description,
      description_en: service.description_en || '',
      description_nl: service.description_nl || '',
      description_es: service.description_es || '',
      description_pl: service.description_pl || '',
      description_ro: service.description_ro || '',
      category: service.category,
      category_en: service.category_en || '',
      category_nl: service.category_nl || '',
      category_es: service.category_es || '',
      category_pl: service.category_pl || '',
      category_ro: service.category_ro || '',
      is_active: service.is_active,
      prices: completePrices.sort((a, b) => (a.price_min || 0) - (b.price_min || 0))
    })
    setShowForm(true)
  }

  const editBodyType = (bodyType: BodyType) => {
    setEditingBodyType(bodyType)
    setBodyTypeFormData({
      key: bodyType.key || bodyType.id || '',
      name: bodyType.name,
      name_en: bodyType.name_en || '',
      name_nl: bodyType.name_nl || '',
      name_es: bodyType.name_es || '',
      name_pl: bodyType.name_pl || '',
      name_ro: bodyType.name_ro || '',
      description: bodyType.description || '',
      description_en: bodyType.description_en || '',
      description_nl: bodyType.description_nl || '',
      description_es: bodyType.description_es || '',
      description_pl: bodyType.description_pl || '',
      description_ro: bodyType.description_ro || '',
      is_active: bodyType.is_active,
      sort_order: bodyType.sort_order
    })
    setShowBodyTypesForm(true)
  }

  const deleteVehicleService = async (id: string) => {
    const service = vehicleServices.find(s => s.id === id)
    if (service) {
      setDeleteModalState({
        isOpen: true,
        type: 'vehicleService',
        itemId: id,
        itemName: service.name
      })
    }
  }

  const deleteBodyType = async (id: string) => {
    const bodyType = bodyTypes.find(bt => bt.id === id)
    if (bodyType) {
      setDeleteModalState({
        isOpen: true,
        type: 'bodyType',
        itemId: id,
        itemName: bodyType.name
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteModalState.itemId || !deleteModalState.type) return

    try {
      if (deleteModalState.type === 'vehicleService') {
        await adminAPI.deleteVehicleService(deleteModalState.itemId)
        toast.showSuccess(t('admin.vehicleServiceDeleted'))
        loadVehicleServices()
      } else if (deleteModalState.type === 'bodyType') {
        await adminAPI.deleteBodyType(deleteModalState.itemId)
        toast.showSuccess(t('admin.bodyTypeDeleted'))
        loadBodyTypes()
      }
    } catch (error) {
      console.error(`Error deleting ${deleteModalState.type}:`, error)
      if (deleteModalState.type === 'vehicleService') {
        toast.showError(t('admin.errorDeletingVehicleService'))
      } else {
        toast.showError(t('admin.errorDeletingBodyType'))
      }
    } finally {
      setDeleteModalState({
        isOpen: false,
        type: null,
        itemId: null,
        itemName: null
      })
    }
  }

  const closeDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      type: null,
      itemId: null,
      itemName: null
    })
  }

  const getBodyTypeName = (bodyTypeKey: string) => {
    const keyInput = String(bodyTypeKey || '').toLowerCase()
    const canonical = mapFrontendBodyTypeKey(keyInput)
    const bodyType = bodyTypes.find(bt => String(bt.key || bt.name).toLowerCase() === canonical)
    if (!bodyType) return canonical || bodyTypeKey
    const currentLang = i18n.language
    const translatedName = bodyType[`name_${currentLang}` as keyof BodyType] as string
    return translatedName || bodyType.name
  }

  const getBodyTypeDescription = (bodyType: BodyType) => {
    const currentLang = i18n.language
    const translatedDescription = bodyType[`description_${currentLang}` as keyof BodyType] as string
    return translatedDescription || bodyType.description || ''
  }



  const getVehicleServiceName = (service: VehicleService) => {
    const currentLang = i18n.language
    // Return name in current language, fallback to default name if not available
    const translatedName = service[`name_${currentLang}` as keyof VehicleService] as string;
    console.log('DEBUG getVehicleServiceName:', {
      currentLang,
      translatedName,
      fallbackName: service.name,
      finalResult: translatedName || service.name
    });
    return translatedName || service.name;
  }

  const getVehicleServiceDescription = (service: VehicleService) => {
    const currentLang = i18n.language
    // Return description in current language, fallback to default description if not available
    const translatedDescription = service[`description_${currentLang}` as keyof VehicleService] as string;
    console.log('DEBUG getVehicleServiceDescription:', {
      currentLang,
      translatedDescription,
      fallbackDescription: service.description,
      finalResult: translatedDescription || service.description
    });
    return translatedDescription || service.description;
  }

  const getVehicleServiceCategory = (service: VehicleService) => {
    const currentLang = i18n.language
    // Return category in current language, fallback to default category if not available
    const translatedCategory = service[`category_${currentLang}` as keyof VehicleService] as string;
    console.log('DEBUG getVehicleServiceCategory:', {
      currentLang,
      translatedCategory,
      fallbackCategory: service.category,
      finalResult: translatedCategory || service.category
    });
    return translatedCategory || service.category;
  }

  // Car icons for different body types
  const getBodyTypeIcon = (key: string) => {
    switch (key) {
      case 'suv': return '🚙';
      case 'berlina': return '🚗';
      case 'break': return '🚗';
      case 'hatchback': return '🚗';
      case 'coupe': return '🏎️';
      case 'cabrio': return '🚘';
      case 'van': return '🚐';
      default: return '🚗';
    }
  };

  const mapFrontendBodyTypeKey = (k: string) => {
    const key = String(k || '').toLowerCase()
    if (key === 'sedan') return 'berlina'
    if (key === 'wagon' || key === 'estate') return 'break'
    return key
  }

  return (
    <div className="vehicle-services-management">
      <div className="management-header">
        <h2>{t('admin.vehicleServicesManagement')}</h2>
        <div className="header-actions">
          <button onClick={() => setShowBodyTypesForm(true)} className="add-btn">
            {t('admin.manageBodyTypes')}
          </button>
          <button onClick={() => setShowForm(true)} className="add-btn">
            {t('admin.addVehicleService')}
          </button>
        </div>
      </div>

      {showForm && (
        <PortalModal isOpen={showForm} onClose={() => { setShowForm(false); setEditingService(null); resetForm(); }} overlayClass="services-modal vehicle-services-management" contentClass="modal-content services-modal-content">
          <div>
            <div className="modal-header">
              <h3>{editingService ? t('admin.editVehicleService') : t('admin.addVehicleService')}</h3>
              <button className="close-btn" type="button" aria-label={t('close')} onClick={() => { setShowForm(false); setEditingService(null); resetForm(); }}>×</button>
            </div>
            <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h4>{t('admin.basicInfo')}</h4>
                <div className="form-group">
                  <label>{t('admin.name')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('admin.description')}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('admin.category')}</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    />
                    {t('admin.active')}
                  </label>
                </div>
              </div>

              {/* Body Type Pricing */}
              <div className="form-section">
                <h4>{t('admin.pricingPerBodyType')}</h4>
                <div className="body-type-prices">
                  {Array.isArray(bodyTypes) && bodyTypes.map((bodyType, index) => {
                    console.log(`🔍 Processing bodyType[${index}]:`, bodyType)
                    
                    // Use key or id for validation
                    const bodyTypeIdentifier = bodyType?.key || bodyType?.name
                    const identifierLower = bodyTypeIdentifier ? String(bodyTypeIdentifier).toLowerCase() : ''
                    const canonicalKey = identifierLower ? mapFrontendBodyTypeKey(identifierLower) : ''
                    if (!bodyType || !bodyTypeIdentifier) {
                      console.warn(`⚠️ Invalid bodyType at index ${index}:`, bodyType)
                      return null
                    }
                    
                    const existingPrice = formData.prices?.find(p => {
                      const key = String(p.body_type_key).toLowerCase()
                      return key === canonicalKey || key === identifierLower
                    })
                    
                    return (
                      <div key={bodyTypeIdentifier} className="price-input-group">
                        <label>
                          <span className="body-type-icon">{getBodyTypeIcon(bodyTypeIdentifier)}</span>
                          {bodyType.name}
                        </label>
                        <div className="price-inputs">
                          <div className="price-input-wrapper">
                            <span className="currency-symbol">€</span>
                            <input
                              type="number"
                              placeholder={`Minim - ${bodyTypeIdentifier}`}
                              value={existingPrice?.price_min !== undefined ? existingPrice.price_min : ''}
                              data-body-type={bodyTypeIdentifier}
                              id={`price-min-${bodyTypeIdentifier}`}
                              onChange={(e) => {
                                const currentBodyTypeIdentifier = canonicalKey;
                                
                                const newPrices = [...(formData.prices || [])];
                                const priceIndex = newPrices.findIndex(p => String(p.body_type_key).toLowerCase() === currentBodyTypeIdentifier);
                                const priceValue = e.target.value ? parseFloat(e.target.value) : 0;
                                
                                if (priceIndex >= 0) {
                                  newPrices[priceIndex] = {
                                    ...newPrices[priceIndex],
                                    price_min: priceValue
                                  };
                                } else {
                                  newPrices.push({
                                    id: '',
                                    service_id: editingService?.id || '',
                                    body_type_key: currentBodyTypeIdentifier,
                                    price_min: priceValue,
                                    duration_minutes: 60,
                                    is_active: true
                                  });
                                }
                                
                                setFormData(prev => ({ 
                                  ...prev, 
                                  prices: newPrices 
                                }));
                              }}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit">{t('admin.save')}</button>
                <button type="button" onClick={() => {
                  setShowForm(false)
                  setEditingService(null)
                  resetForm()
                }}>
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
            </div>
          </div>
        </PortalModal>
      )}

      {/* Body Types Form Modal */}
      {showBodyTypesForm && (
        <PortalModal isOpen={showBodyTypesForm} onClose={() => { setShowBodyTypesForm(false); setEditingBodyType(null); resetBodyTypeForm(); }} overlayClass="services-modal vehicle-services-management" contentClass="modal-content services-modal-content">
          <div>
            <div className="modal-header">
              <h3>{editingBodyType ? t('admin.editBodyType') : t('admin.addBodyType')}</h3>
              <button className="close-btn" type="button" aria-label={t('close')} onClick={() => { setShowBodyTypesForm(false); setEditingBodyType(null); resetBodyTypeForm(); }}>×</button>
            </div>
            <div className="modal-body">
            <form onSubmit={handleBodyTypeSubmit}>
              <div className="form-group">
                <label>{t('admin.key')}</label>
                <input
                  type="text"
                  value={bodyTypeFormData.key}
                  onChange={(e) => setBodyTypeFormData(prev => ({ ...prev, key: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('admin.name')}</label>
                <input
                  type="text"
                  value={bodyTypeFormData.name}
                  onChange={(e) => setBodyTypeFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('admin.description')}</label>
                <textarea
                  value={bodyTypeFormData.description}
                  onChange={(e) => setBodyTypeFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>{t('admin.sortOrder')}</label>
                <input
                  type="number"
                  value={bodyTypeFormData.sort_order}
                  onChange={(e) => setBodyTypeFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={bodyTypeFormData.is_active}
                    onChange={(e) => setBodyTypeFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                  {t('admin.active')}
                </label>
              </div>
              <div className="form-actions">
                <button type="submit">{t('admin.save')}</button>
                <button type="button" onClick={() => {
                  setShowBodyTypesForm(false)
                  setEditingBodyType(null)
                  resetBodyTypeForm()
                }}>
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
            </div>
          </div>
        </PortalModal>
      )}

      {/* Vehicle Services List */}
      <div className="services-list">
        {Array.isArray(vehicleServices) && vehicleServices.map((service) => (
          <div key={service.id} className="service-item">
            <div className="service-info">
              {/* DEBUG: Afișează toate proprietățile serviciului */}
              {(() => {
                console.log('DEBUG Service:', {
                  id: service.id,
                  name: service.name,
                  name_en: service.name_en,
                  name_nl: service.name_nl,
                  description: service.description,
                  description_en: service.description_en,
                  description_nl: service.description_nl,
                  category: service.category,
                  category_en: service.category_en,
                  category_nl: service.category_nl
                });
                return null;
              })()}
              <h4>{getVehicleServiceName(service)}</h4>
              <p>{getVehicleServiceDescription(service)}</p>
              <p className="category">{t('admin.category')}: {getVehicleServiceCategory(service)}</p>

              <div className="prices-info">
                <h5>{t('admin.prices')}:</h5>
                <div className="prices-grid">
                  {Array.isArray(service.prices) && service.prices.length > 0 ? (
                    (() => {
                      const normalized = service.prices.map(price => ({
                        ...price,
                        body_type_key: String(price.body_type_key || '').toLowerCase()
                      }))

                      const sortedPrices = normalized.slice().sort((a, b) => {
                        const av = typeof (a as any).price_min === 'string' ? parseFloat((a as any).price_min) : (a.price_min || 0)
                        const bv = typeof (b as any).price_min === 'string' ? parseFloat((b as any).price_min) : (b.price_min || 0)
                        return av - bv
                      })

                      return sortedPrices.map((price, index) => (
                        <div key={`${price.body_type_key}-${index}`} className="price-item">
                          <span>{getBodyTypeName(price.body_type_key)}: €{typeof (price as any).price_min === 'string' ? parseFloat((price as any).price_min) : price.price_min}</span>
                        </div>
                      ))
                    })()
                  ) : (
                    <div className="price-item no-prices">
                      <span>No prices</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="service-actions">
              <button onClick={() => editVehicleService(service)} className="edit-btn">
                {t('admin.edit')}
              </button>
              <button onClick={() => deleteVehicleService(service.id)} className="delete-btn" title={t('admin.delete')}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Body Types List */}
      <div className="body-types-section">
        <h3>{t('admin.bodyTypes')}</h3>
        <div className="body-types-list">
          {Array.isArray(bodyTypes) && bodyTypes.map((bodyType) => (
            <div key={bodyType.id} className="body-type-item">
              <div className="body-type-info">
                <h4>{getBodyTypeName(bodyType.key || bodyType.id)}</h4>
                <p>{getBodyTypeDescription(bodyType)}</p>
                <p className="key">{t('admin.key')}: {bodyType.key || bodyType.id}</p>
              </div>
              <div className="body-type-actions">
                <button onClick={() => editBodyType(bodyType)} className="edit-btn">
                  {t('admin.edit')}
                </button>
                <button onClick={() => deleteBodyType(bodyType.id)} className="delete-btn" title={t('admin.delete')}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title={deleteModalState.type === 'vehicleService' ? t('admin.deleteVehicleService') : t('admin.deleteBodyType')}
        message={deleteModalState.type === 'vehicleService' 
          ? t('admin.areYouSureDeleteVehicleService') 
          : t('admin.areYouSureDeleteBodyType')
        }
        itemName={deleteModalState.itemName || undefined}
        cancelText={t('admin.cancel')}
        confirmText={t('admin.delete')}
        warningText={t('admin.thisActionCannotBeUndone')}
      />
    </div>
  )
}

// Gallery Management Component
interface GalleryImage {
  id: string
  url: string
  alt_text: string
  category: string
  active: boolean
}

interface GalleryManagementProps {
  isAuthenticated: boolean
}

const GalleryManagement: React.FC<GalleryManagementProps> = ({ isAuthenticated }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [newImage, setNewImage] = useState<Omit<GalleryImage, 'id'>>({
    url: '',
    alt_text: '',
    category: 'general',
    active: true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    if (isAuthenticated) {
      loadImages()
    }
  }, [isAuthenticated])

  const loadImages = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getGallery()
      
      // Procesează și filtrează imagini duplicate
      const processedImages = response.data
        .map((image: any) => {
          // Curăță URL-ul de spații și caractere speciale
          let cleanUrl = image.url?.toString().trim().replace(/^`|`$/g, '') || ''
          
          // Verifică dacă URL-ul este deja complet (Cloudinary sau alt serviciu)
          let finalUrl = cleanUrl
          if (cleanUrl && !cleanUrl.startsWith('http')) {
            // Doar pentru URL-uri relative locale
            const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'
            const normalizedPath = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`
            finalUrl = `${baseUrl}${normalizedPath}`
          }
          
          return {
            ...image,
            url: finalUrl
          }
        })
        .filter((image: any) => image.url && image.id) // Filtrează imagini fără URL sau ID
      
      // Elimină duplicate bazate pe ID
      const uniqueImages = processedImages.filter((image: any, index: number, self: any[]) => 
        index === self.findIndex((i: any) => i.id === image.id)
      )
      
      setImages(uniqueImages)
    } catch (error) {
      console.error('Error loading gallery images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setNewImage({ ...newImage, url: '' }) // Clear URL when file is selected
      
      // Creează preview URL pentru imaginea selectată
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }



  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile && !newImage.url) {
      toast.showWarning(t('admin.pleaseSelectImage'))
      return
    }

    try {
      setLoading(true)
      
      // Dacă avem fișier selectat, folosim upload de fișier
      if (selectedFile) {
        // Creează FormData pentru upload de fișier
        const formData = new FormData()
        formData.append('image', selectedFile)
        formData.append('alt_text', newImage.alt_text)
        formData.append('category', newImage.category)
        formData.append('active', newImage.active.toString())
        
        // Utilizează axios direct pentru upload de fișier
        const token = localStorage.getItem('adminToken')
        await api.post('/gallery', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        })
      } else if (newImage.url) {
        // Dacă avem doar URL, folosim endpoint-ul clasic
        const imageData = {
          url: newImage.url,
          alt_text: newImage.alt_text,
          category: newImage.category,
          active: newImage.active
        }
        
        await adminAPI.uploadImage(imageData)
      }
      
      setNewImage({ url: '', alt_text: '', category: 'general', active: true })
      setSelectedFile(null)
      setPreviewUrl('')
      // Actualizează local lista fără reîncărcare completă
      // Creează obiectul imageData pentru actualizarea locală
      const uploadedImageData = {
        id: Date.now().toString(), // ID temporar pentru local
        url: newImage.url || (selectedFile ? URL.createObjectURL(selectedFile) : ''),
        alt_text: newImage.alt_text,
        category: newImage.category,
        active: newImage.active,
        createdAt: new Date().toISOString()
      }
      setImages(prevImages => [...prevImages, uploadedImageData])
      toast.showSuccess(t('admin.imageAdded'))
    } catch (error) {
      console.error('Error adding image:', error)
      toast.showError(t('admin.failedToAddImage'))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm(t('admin.areYouSureDeleteImage'))) {
      return
    }

    try {
      setLoading(true)
      await adminAPI.deleteImage(imageId)
      
      // Actualizează local lista de imagini fără a reîncărca tot
      setImages(prevImages => prevImages.filter(img => img.id !== imageId))
      
      toast.showSuccess(t('admin.imageDeleted'))
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.showError(t('admin.failedToDeleteImage'))
      
      // În caz de eroare, reîncarcă lista completă
      await loadImages()
    } finally {
      setLoading(false)
    }
  }

  const toggleImageStatus = async (imageId: string, currentStatus: boolean) => {
    try {
      setLoading(true)
      
      // Găsește imaginea curentă
      const image = images.find(img => img.id === imageId)
      if (!image) {
        toast.showError(t('admin.imageNotFound'))
        return
      }
      
      // Actualizează statusul local imediat pentru feedback rapid
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === imageId ? { ...img, active: !currentStatus } : img
        )
      )
      
      try {
        // Folosește noul endpoint de update în loc de ștergere și re-upload
        await adminAPI.updateImage(imageId, { active: !currentStatus })
        
        toast.showSuccess(t('admin.imageStatusUpdated'))
      } catch (error) {
        console.error('Error updating image status:', error)
        // Revenire la statusul anterior în caz de eroare
        setImages(prevImages => 
          prevImages.map(img => 
            img.id === imageId ? { ...img, active: currentStatus } : img
          )
        )
        toast.showError(t('admin.failedToUpdateImageStatus'))
      }
    } catch (error) {
      console.error('Error in toggleImageStatus:', error)
      toast.showError(t('admin.failedToUpdateImageStatus'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gallery-management">
      <h2>{t('admin.galleryManagement')}</h2>
      
      {/* Add New Image Form */}
      <div className="add-image-form">
        <h3>{t('admin.addNewImage')}</h3>
        <form onSubmit={handleAddImage}>
          <div className="form-group">
            <label>{t('admin.selectImage')} *</label>
            <div className="image-upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
                id="imageFileInput"
              />
              <button
                type="button"
                onClick={() => document.getElementById('imageFileInput')?.click()}
                className="upload-button"
              >
                {t('admin.chooseImageFile')}
              </button>
              
              {/* Preview imagine */}
              {previewUrl && (
                <div className="image-preview-container">
                  <img src={previewUrl} alt="Preview" className="image-preview" />
                  <div className="preview-info">
                    {selectedFile?.name}
                  </div>
                </div>
              )}
              
              {selectedFile && !previewUrl && (
                <div className="selected-file-info">
                  {selectedFile.name}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label>{t('admin.altText')}</label>
            <input
              type="text"
              value={newImage.alt_text}
              onChange={(e) => setNewImage({ ...newImage, alt_text: e.target.value })}
              placeholder={t('admin.descriptionOfImage')}
            />
          </div>
          
          <div className="form-group">
            <label>{t('admin.category')}</label>
            <select
              value={newImage.category}
              onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
            >
              <option value="detailing-interior">{t('admin.detailingInterior')}</option>
              <option value="detailing-exterior">{t('admin.detailingExterior')}</option>
              <option value="ambient-lights">{t('admin.ambientLights')}</option>
              <option value="starlight-ceiling">{t('admin.starlightCeiling')}</option>
              <option value="chrome-delete">{t('admin.chromeDelete')}</option>
              <option value="trim-wrapping">{t('admin.trimWrapping')}</option>
              <option value="polish-auto">{t('admin.polishAuto')}</option>
              <option value="ceramic-protection">{t('admin.ceramicProtection')}</option>
              <option value="before-after">{t('admin.beforeAfter')}</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={newImage.active}
                onChange={(e) => setNewImage({ ...newImage, active: e.target.checked })}
              />
              {t('admin.active')}
            </label>
          </div>
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? t('admin.adding') : t('admin.addImage')}
          </button>
        </form>
      </div>

      {/* Existing Images */}
      <div className="existing-images">
        <h3>
          {t('admin.existingImages')} ({images.length})
        </h3>
        
        {loading ? (
          <div className="loading">{t('admin.loadingImages')}</div>
        ) : images.length === 0 ? (
          <div className="no-images">{t('admin.noImages')}</div>
        ) : (
          <div className="images-grid">
            {Array.isArray(images) && images.map((image) => (
              <div key={image.id} className="image-item">
                <img 
                  src={image.url} 
                  alt={image.alt_text || t('admin.galleryImage')}
                  className="gallery-thumbnail"
                />
                <div className="image-info">
                  <div className="image-category">{t(`galleryPage.categories.${image.category}`)}</div>
                </div>
                <div className="image-actions">
                  <button 
                    onClick={() => toggleImageStatus(image.id, image.active)}
                    className={image.active ? 'deactivate-btn' : 'activate-btn'}
                  >
                    {image.active ? t('admin.deactivate') : t('admin.activate')}
                  </button>
                  <button 
                    onClick={() => handleDeleteImage(image.id)}
                    className="delete-btn"
                  >
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Newsletter Management Component
interface NewsletterManagementProps {
  isAuthenticated: boolean
}

const NewsletterManagement: React.FC<NewsletterManagementProps> = ({ isAuthenticated }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [newsletterSubject, setNewsletterSubject] = useState('')
  const [newsletterContent, setNewsletterContent] = useState('')
  const [newsletterHTML, setNewsletterHTML] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadSubscribers()
    }
  }, [isAuthenticated])

  const loadSubscribers = async () => {
    try {
      const response = await adminAPI.getNewsletterSubscribers()
      setSubscribers(response.data)
    } catch (error) {
      console.error('Error loading subscribers:', error)
    }
  }

  const sendNewsletter = async () => {
    if (!newsletterSubject.trim()) {
      toast.showWarning(t('admin.pleaseEnterNewsletterSubject'))
      return
    }

    if (!newsletterContent.trim() && !newsletterHTML.trim()) {
      toast.showWarning(t('admin.pleaseEnterNewsletterContent'))
      return
    }

    if (window.confirm(t('admin.sendNewsletterToCountSubscribers', { count: subscribers.length }))) {
      try {
        setSending(true)
        await adminAPI.sendNewsletter({
          subject: newsletterSubject,
          content: newsletterHTML || `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${newsletterContent.replace(/\n/g, '<br>')}</div>`
        })
        toast.showSuccess(t('admin.newsletterSentSuccessfully'))
        setNewsletterSubject('')
        setNewsletterContent('')
        setNewsletterHTML('')
      } catch (error) {
        console.error('Error sending newsletter:', error)
        toast.showError(t('admin.failedToSendNewsletter'))
      } finally {
        setSending(false)
      }
    }
  }

  return (
    <div className="newsletter-management">
      <h2>{t('admin.newsletterManagement')}</h2>
      
      <div className="newsletter-section">
        <h3>{t('admin.sendNewsletter')}</h3>
        
        <div className="form-group">
          <label>{t('admin.subjectRequired')}</label>
          <input
            type="text"
            value={newsletterSubject}
            onChange={(e) => setNewsletterSubject(e.target.value)}
            placeholder={t('admin.enterNewsletterSubjectPlaceholder')}
            className="newsletter-input"
          />
        </div>

        <div className="form-group">
          <label>{t('admin.textContentForEmailClients')}</label>
          <textarea
            value={newsletterContent}
            onChange={(e) => setNewsletterContent(e.target.value)}
            placeholder={t('admin.enterPlainTextContentPlaceholder')}
            rows={6}
            className="newsletter-textarea"
          />
        </div>

        <div className="form-group">
          <label>{t('admin.htmlContentOptional')}</label>
          <textarea
            value={newsletterHTML}
            onChange={(e) => setNewsletterHTML(e.target.value)}
            placeholder={t('admin.enterHtmlContentPlaceholder')}
            rows={8}
            className="newsletter-textarea"
          />
        </div>

        <button 
          onClick={sendNewsletter} 
          className="send-btn"
          disabled={sending}
        >
          {sending ? t('admin.sendingDots') : t('admin.sendToCountSubscribers', { count: subscribers.length })}
        </button>
      </div>

      <div className="subscribers-section">
        <h3>{t('admin.subscribersCount', { count: subscribers.length })}</h3>
        <div className="subscribers-list">
          {Array.isArray(subscribers) && subscribers.map((subscriber: any) => (
            <div key={subscriber.email} className="subscriber-item">
              <span>{subscriber.email}</span>
              <span>{new Date(subscriber.subscribedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Admin
  const PortalModal: React.FC<{ isOpen: boolean; onClose: () => void; overlayClass?: string; contentClass?: string; children: React.ReactNode; preventOverlayClose?: boolean }> = ({ isOpen, onClose, overlayClass, contentClass, children, preventOverlayClose = false }) => {
    if (!isOpen) return null
    
    const handleOverlayClick = () => {
      console.log('🎯 Overlay clicked, preventOverlayClose:', preventOverlayClose)
      // Prevenim închiderea dacă preventOverlayClose este true
      if (preventOverlayClose) {
        console.log('🚫 Modal close prevented by preventOverlayClose')
        return
      }
      console.log('🔄 Calling onClose from overlay click')
      onClose()
    }
    
    return ReactDOM.createPortal(
      <div className={['portal-modal-overlay', overlayClass].filter(Boolean).join(' ')} onClick={handleOverlayClick}>
        <div className={['portal-modal-content', contentClass].filter(Boolean).join(' ')} onClick={(e) => {
          console.log('📦 Modal content clicked, stopping propagation')
          e.stopPropagation()
        }}>
          {children}
        </div>
      </div>,
      document.body
    )
  }
