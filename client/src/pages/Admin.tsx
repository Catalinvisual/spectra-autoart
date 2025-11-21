import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import './Admin.css'
import i18n from '../i18n'

interface Booking {
  id: string
  user: {
    name: string
    email: string
    phone: string
  }
  date: string
  services: Array<{
    id: string
    name: string
  }>
  total: number
  status: string
}

interface Service {
  id: string
  name: string | { nl: string; en: string; es: string; pl: string; ro: string }
  description: string | { nl: string; en: string; es: string; pl: string; ro: string }
  price: number
  active?: boolean
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
  const navigate = useNavigate()
  const { showError, showInfo } = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetEmail, setResetEmail] = useState('')


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
      console.log('Found existing token, setting authenticated')
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Login attempt with:', loginForm.email, loginForm.password)
      
      // Always use API login to get a proper JWT token
      const response = await adminAPI.login({ email: loginForm.email, password: loginForm.password })
      localStorage.setItem('adminToken', response.data.token)
      setIsAuthenticated(true)
      console.log('API login successful')
      
    } catch (error) {
      console.error('Login error:', error)
      showError(t('admin.loginFailed'))
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

  const handleForgotPassword = () => {
    setShowResetForm(true)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // În producție, acesta ar trebui să trimită un email de resetare
      // Pentru moment, afișăm instrucțiuni de recuperare
      showInfo(t('passwordResetInstructions') || t('admin.passwordResetInstructions') || 'Dacă ai uitat parola, contactează administratorul sistemului.')
      setShowResetForm(false)
      setResetEmail('')
    } catch (error) {
      console.error('Password reset error:', error)
      showError(t('passwordResetFailed') || t('admin.passwordResetFailed') || 'Resetarea parolei a eșuat.')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setShowResetForm(false)
    setResetEmail('')
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="login-header">
            <h2>{t('adminPanel')}</h2>
            <button onClick={handleGoHome} className="home-btn" title="Go to Home">
              ← Home
            </button>
          </div>
          
          {!showResetForm ? (
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
                  {loading ? 'Logging in...' : t('login')}
                </button>
              </form>
              <div className="login-footer">
                <button onClick={handleForgotPassword} className="forgot-password-btn">
                  Forgot Password?
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label>{t('email')}</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder={t('pleaseEnter') + ' ' + t('email')}
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? t('sendingDots') : t('send')}
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
            🏠 Home
          </button>
          <select 
            value={i18n.language} 
            onChange={(e) => i18n.changeLanguage(e.target.value)}
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
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            {t('dashboard')}
          </button>
          <button 
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            {t('bookings')}
          </button>
          <button 
            className={activeTab === 'services' ? 'active' : ''}
            onClick={() => setActiveTab('services')}
          >
            {t('services')}
          </button>
          <button 
            className={activeTab === 'vehicle-services' ? 'active' : ''}
            onClick={() => setActiveTab('vehicle-services')}
          >
            {t('vehicleServices')}
          </button>
          <button 
            className={activeTab === 'gallery' ? 'active' : ''}
            onClick={() => setActiveTab('gallery')}
          >
            {t('galleryAdmin')}
          </button>
          <button 
            className={activeTab === 'newsletter' ? 'active' : ''}
            onClick={() => setActiveTab('newsletter')}
          >
            {t('newsletterSubscribers')}
          </button>
        </nav>

        <main className="admin-main">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'bookings' && <BookingsManagement />}
          {activeTab === 'services' && <ServicesManagement />}
          {activeTab === 'vehicle-services' && <VehicleServicesManagement />}
          {activeTab === 'gallery' && <GalleryManagement />}
          {activeTab === 'newsletter' && <NewsletterManagement />}
        </main>
      </div>
    </div>
  )
}

// Dashboard Component
const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalServices: 0,
    totalSubscribers: 0
  })

  useEffect(() => {
    // Load dashboard stats
    const loadStats = async () => {
      try {
        const bookingsResponse = await adminAPI.getBookings()
        const servicesResponse = await adminAPI.getServices()
        const subscribersResponse = await adminAPI.getNewsletterSubscribers()

        const bookings = bookingsResponse.data
        setStats({
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
          totalServices: servicesResponse.data.length,
          totalSubscribers: subscribersResponse.data.length
        })
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      }
    }

    loadStats()
  }, [])

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
          <h3>{t('admin.totalServices')}</h3>
          <p className="stat-number">{stats.totalServices}</p>
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
const BookingsManagement: React.FC = () => {
  const { t } = useTranslation()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const response = await adminAPI.getBookings()
      setBookings(response.data)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await adminAPI.updateBooking(id, { status })
      loadBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const deleteBooking = async (id: string) => {
    if (window.confirm(t('admin.areYouSureDeleteBooking'))) {
      try {
        await adminAPI.deleteBooking(id)
        loadBookings()
      } catch (error) {
        console.error('Error deleting booking:', error)
      }
    }
  }

  if (loading) return <div className="loading">{t('admin.loadingBookings')}</div>

  return (
    <div className="bookings-management">
      <h2>{t('admin.bookingsManagement')}</h2>
      <div className="bookings-list">
        {Array.isArray(bookings) && bookings.map((booking: any) => (
          <div key={booking.id} className="booking-item">
            <div className="booking-info">
              <h4>{booking.user.name}</h4>
              <p>{booking.user.email}</p>
              <p>{booking.user.phone}</p>
              <p><strong>{t('admin.date')}:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>{t('services')}:</strong> 
                {Array.isArray(booking.services) 
                  ? booking.services.map((s: any) => {
                      // Try to get translated service name from available data
                      if (typeof s.name === 'object') {
                        return s.name[i18n.language] || s.name.nl || s.name.en || s.name
                      }
                      return s.name
                    }).join(', ') 
                  : t('admin.noServices')
                }
              </p>
              <p><strong>{t('admin.total')}:</strong> €{booking.total}</p>
            </div>
            <div className="booking-actions">
              <select 
                value={booking.status}
                onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                className={`status-select ${booking.status}`}
              >
                <option value="pending">{t('pending')}</option>
                <option value="confirmed">{t('confirmed')}</option>
                <option value="cancelled">{t('cancelled')}</option>
              </select>
              <button onClick={() => deleteBooking(booking.id)} className="delete-btn">
                {t('admin.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Services Management Component
const ServicesManagement: React.FC = () => {
  const { t } = useTranslation()
  const { showSuccess, showError } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  })

  const loadServices = async () => {
    try {
      const response = await adminAPI.getServices()
      console.log('🔍 API Response:', response)
      console.log('📋 Services data:', response.data)
      setServices(response.data)
    } catch (error) {
      console.error('Error loading services:', error)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Prepare multilingual data for server
      const serviceData = {
        name: {
          nl: formData.name,
          en: formData.name,
          es: formData.name,
          pl: formData.name,
          ro: formData.name
        },
        description: {
          nl: formData.description,
          en: formData.description,
          es: formData.description,
          pl: formData.description,
          ro: formData.description
        },
        price: parseFloat(formData.price) || 0,
        active: true
      }
      
      if (editingService) {
        await adminAPI.updateService(editingService.id, serviceData)
        showSuccess(t('admin.serviceUpdated'))
      } else {
        await adminAPI.createService(serviceData)
        showSuccess(t('admin.serviceCreated'))
      }
      setShowForm(false)
      setEditingService(null)
      setFormData({ name: '', description: '', price: '' })
      loadServices()
    } catch (error) {
      console.error('Error saving service:', error)
      showError(t('admin.errorSavingService', { message: error instanceof Error ? error.message : 'Unknown error' }))
    }
  }

  const editService = (service: Service) => {
    setEditingService(service)
    // Handle both string and object name/description formats
    const name = typeof service.name === 'object' ? service.name.nl : service.name
    const description = typeof service.description === 'object' ? service.description.nl : service.description
    
    setFormData({
      name: name,
      description: description,
      price: String(service.price)
    })
    setShowForm(true)
  }

  const deleteService = async (id: string) => {
    if (window.confirm(t('admin.areYouSureDeleteService'))) {
      try {
        await adminAPI.deleteService(id)
        loadServices()
      } catch (error) {
        console.error('Error deleting service:', error)
      }
    }
  }

  return (
    <div className="services-management">
      <div className="management-header">
        <h2>{t('admin.servicesManagement')}</h2>
        <button onClick={() => setShowForm(true)} className="add-btn">
          {t('admin.addService')}
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <h3>{editingService ? t('admin.editService') : t('admin.addService')}</h3>
            <form onSubmit={handleSubmit}>
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
                <label>{t('admin.price')} (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit">{t('admin.save')}</button>
                <button type="button" onClick={() => {
                  setShowForm(false)
                  setEditingService(null)
                  setFormData({ name: '', description: '', price: '' })
                }}>
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="services-list">
        {Array.isArray(services) && services.map((service: any) => {
          // Handle multilingual service data
          console.log('🔍 Processing service:', service)
          console.log('🔍 Service name type:', typeof service.name)
          console.log('🔍 Service name value:', service.name)
          console.log('🔍 Service description type:', typeof service.description)
          console.log('🔍 Service description value:', service.description)
          
          const serviceName = typeof service.name === 'object' ? service.name.nl : service.name
          const serviceDescription = typeof service.description === 'object' ? service.description.nl : service.description
          
          console.log('🔍 Final serviceName:', serviceName)
          console.log('🔍 Final serviceDescription:', serviceDescription)
          
          return (
            <div key={service.id} className="service-item">
              <div className="service-info">
                <h4>{serviceName}</h4>
                <p>{serviceDescription}</p>
                <p className="price">€{service.price}</p>
              </div>
              <div className="service-actions">
                <button onClick={() => editService(service)} className="edit-btn">
                  {t('admin.edit')}
                </button>
                <button onClick={() => deleteService(service.id)} className="delete-btn">
                  {t('admin.delete')}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Vehicle Services Management Component
const VehicleServicesManagement: React.FC = () => {
  const { t } = useTranslation()
  const { showSuccess, showError } = useToast()
  const [vehicleServices, setVehicleServices] = useState<VehicleService[]>([])
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<VehicleService | null>(null)
  const [showBodyTypesForm, setShowBodyTypesForm] = useState(false)
  const [editingBodyType, setEditingBodyType] = useState<BodyType | null>(null)
  
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

  // Debug effect to track price changes
  useEffect(() => {
    console.log('=== FORM DATA PRICES CHANGED ===');
    console.log('Current prices:', JSON.parse(JSON.stringify(formData.prices)));
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
      showError(t('admin.errorLoadingVehicleServices'))
    }
  }

  const loadBodyTypes = async () => {
    try {
      const response = await adminAPI.getBodyTypes()
      setBodyTypes(response.data)
    } catch (error) {
      console.error('Error loading body types:', error)
      showError(t('admin.errorLoadingBodyTypes'))
    }
  }

  useEffect(() => {
    loadVehicleServices()
    loadBodyTypes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const serviceData = {
        ...formData,
        prices: formData.prices || []
      }
      
      if (editingService) {
        await adminAPI.updateVehicleService(editingService.id, serviceData)
        showSuccess(t('admin.vehicleServiceUpdated'))
      } else {
        await adminAPI.createVehicleService(serviceData)
        showSuccess(t('admin.vehicleServiceCreated'))
      }
      
      setShowForm(false)
      setEditingService(null)
      resetForm()
      loadVehicleServices()
    } catch (error) {
      console.error('Error saving vehicle service:', error)
      showError(t('admin.errorSavingVehicleService'))
    }
  }

  const handleBodyTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingBodyType) {
        await adminAPI.updateBodyType(editingBodyType.id, bodyTypeFormData)
        showSuccess(t('admin.bodyTypeUpdated'))
      } else {
        await adminAPI.createBodyType(bodyTypeFormData)
        showSuccess(t('admin.bodyTypeCreated'))
      }
      
      setShowBodyTypesForm(false)
      setEditingBodyType(null)
      resetBodyTypeForm()
      loadBodyTypes()
    } catch (error) {
      console.error('Error saving body type:', error)
      showError(t('admin.errorSavingBodyType'))
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

  const editVehicleService = (service: VehicleService) => {
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
      prices: service.prices || []
    })
    setShowForm(true)
  }

  const editBodyType = (bodyType: BodyType) => {
    setEditingBodyType(bodyType)
    setBodyTypeFormData({
      key: bodyType.key,
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
    if (window.confirm(t('admin.areYouSureDeleteVehicleService'))) {
      try {
        await adminAPI.deleteVehicleService(id)
        showSuccess(t('admin.vehicleServiceDeleted'))
        loadVehicleServices()
      } catch (error) {
        console.error('Error deleting vehicle service:', error)
        showError(t('admin.errorDeletingVehicleService'))
      }
    }
  }

  const deleteBodyType = async (id: string) => {
    if (window.confirm(t('admin.areYouSureDeleteBodyType'))) {
      try {
        await adminAPI.deleteBodyType(id)
        showSuccess(t('admin.bodyTypeDeleted'))
        loadBodyTypes()
      } catch (error) {
        console.error('Error deleting body type:', error)
        showError(t('admin.errorDeletingBodyType'))
      }
    }
  }

  const getBodyTypeName = (bodyTypeKey: string) => {
    const bodyType = bodyTypes.find(bt => bt.key === bodyTypeKey)
    if (!bodyType) return bodyTypeKey
    
    // Return translated name based on current language
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
    return service[`name_${currentLang}` as keyof VehicleService] as string || service.name
  }

  const getVehicleServiceDescription = (service: VehicleService) => {
    const currentLang = i18n.language
    // Return description in current language, fallback to default description if not available
    return service[`description_${currentLang}` as keyof VehicleService] as string || service.description
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

      {/* Vehicle Service Form Modal */}
      {showForm && (
        <div className="form-modal">
          <div className="form-container large-form">
            <h3>{editingService ? t('admin.editVehicleService') : t('admin.addVehicleService')}</h3>
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
                  {Array.isArray(bodyTypes) && bodyTypes.map((bodyType) => {
                    const existingPrice = formData.prices?.find(p => p.body_type_key === bodyType.key);
                    
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
                    
                    return (
                      <div key={bodyType.key} className="price-input-group">
                        <label>
                          <span className="body-type-icon">{getBodyTypeIcon(bodyType.key)}</span>
                          {bodyType.name}
                        </label>
                        <div className="price-inputs">
                          <div className="price-input-wrapper">
                            <span className="currency-symbol">€</span>
                            <input
                              type="number"
                              placeholder={`Minim - ${bodyType.key}`}
                              value={existingPrice?.price_min || ''}
                              data-body-type={bodyType.key}
                              id={`price-min-${bodyType.key}`}
                              onChange={(e) => {
                                // Capture the current bodyType key to avoid closure issues
                                const currentBodyTypeKey = bodyType.key;
                                
                                const newPrices = [...(formData.prices || [])];
                                const priceIndex = newPrices.findIndex(p => p.body_type_key === currentBodyTypeKey);
                                const priceValue = e.target.value ? parseFloat(e.target.value) : 0;
                                
                                if (priceIndex >= 0) {
                                  newPrices[priceIndex] = {
                                    ...newPrices[priceIndex],
                                    price_min: priceValue
                                  };
                                } else {
                                  newPrices.push({
                                    id: '',
                                    service_id: '',
                                    body_type_key: currentBodyTypeKey,
                                    price_min: priceValue,
                                    price_max: undefined,
                                    duration_minutes: 60,
                                    is_active: true
                                  });
                                }
                                
                                console.log(`All prices after update:`, JSON.parse(JSON.stringify(newPrices)));
                                console.log(`=== END PRICE UPDATE ===`);
                                
                                setFormData(prev => ({ 
                                  ...prev, 
                                  prices: newPrices 
                                }));
                              }}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="price-input-wrapper">
                            <span className="currency-symbol">€</span>
                            <input
                              type="number"
                              placeholder={`Maxim - ${bodyType.key}`}
                              value={existingPrice?.price_max || ''}
                              data-body-type={bodyType.key}
                              id={`price-max-${bodyType.key}`}
                              onChange={(e) => {
                                // Capture the current bodyType key to avoid closure issues
                                const currentBodyTypeKey = bodyType.key;
                                
                                const newPrices = [...(formData.prices || [])];
                                const priceIndex = newPrices.findIndex(p => p.body_type_key === currentBodyTypeKey);
                                const priceValue = e.target.value ? parseFloat(e.target.value) : undefined;
                                
                                if (priceIndex >= 0) {
                                  newPrices[priceIndex] = {
                                    ...newPrices[priceIndex],
                                    price_max: priceValue
                                  };
                                } else {
                                  newPrices.push({
                                    id: '',
                                    service_id: '',
                                    body_type_key: currentBodyTypeKey,
                                    price_min: 0,
                                    price_max: priceValue,
                                    duration_minutes: 60,
                                    is_active: true
                                  });
                                }
                                
                                setFormData(prev => ({ ...prev, prices: newPrices }));
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
      )}

      {/* Body Types Form Modal */}
      {showBodyTypesForm && (
        <div className="form-modal">
          <div className="form-container">
            <h3>{editingBodyType ? t('admin.editBodyType') : t('admin.addBodyType')}</h3>
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
      )}

      {/* Vehicle Services List */}
      <div className="services-list">
        {Array.isArray(vehicleServices) && vehicleServices.map((service) => (
          <div key={service.id} className="service-item">
            <div className="service-info">
              <h4>{getVehicleServiceName(service)}</h4>
              <p>{getVehicleServiceDescription(service)}</p>
              <p className="category">{t('admin.category')}: {service.category}</p>

              <div className="prices-info">
                <h5>{t('admin.prices')}:</h5>
                {Array.isArray(service.prices) && service.prices.map((price) => (
                  <div key={price.id} className="price-item">
                    <span>{getBodyTypeName(price.body_type_key)}: €{price.price_min}</span>
                    {price.price_max && <span> - €{price.price_max}</span>}

                    <span className={price.is_active ? 'active' : 'inactive'}>
                      {price.is_active ? t('admin.active') : t('admin.inactive')}
                    </span>
                  </div>
                ))}
              </div>
              <p className={service.is_active ? 'active' : 'inactive'}>
                {service.is_active ? t('admin.active') : t('admin.inactive')}
              </p>
            </div>
            <div className="service-actions">
              <button onClick={() => editVehicleService(service)} className="edit-btn">
                {t('admin.edit')}
              </button>
              <button onClick={() => deleteVehicleService(service.id)} className="delete-btn">
                {t('admin.delete')}
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
                <h4>{getBodyTypeName(bodyType.key)}</h4>
                <p>{getBodyTypeDescription(bodyType)}</p>
                <p className="key">{t('admin.key')}: {bodyType.key}</p>
                <p className={bodyType.is_active ? 'active' : 'inactive'}>
                  {bodyType.is_active ? t('admin.active') : t('admin.inactive')}
                </p>
              </div>
              <div className="body-type-actions">
                <button onClick={() => editBodyType(bodyType)} className="edit-btn">
                  {t('admin.edit')}
                </button>
                <button onClick={() => deleteBodyType(bodyType.id)} className="delete-btn">
                  {t('admin.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
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

const GalleryManagement: React.FC = () => {
  const { t } = useTranslation()
  const { showSuccess, showError, showWarning } = useToast()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [newImage, setNewImage] = useState<Omit<GalleryImage, 'id'>>({
    url: '',
    alt_text: '',
    category: 'general',
    active: true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getGallery()
      setImages(response.data)
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
    }
  }

  const handleChooseFile = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  const handleChooseUrl = () => {
    setNewImage({ ...newImage, url: ' ' })
    setSelectedFile(null)
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewImage({ ...newImage, url: e.target.value })
    setSelectedFile(null) // Clear file selection when URL is entered
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newImage.url.trim() && !selectedFile) {
      showWarning(t('admin.pleaseSelectImageOrEnterUrl'))
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      
      // Add file if selected
      if (selectedFile) {
        formData.append('image', selectedFile)
      } else if (newImage.url.trim()) {
        formData.append('url', newImage.url.trim())
      }
      
      formData.append('alt_text', newImage.alt_text)
      formData.append('category', newImage.category)
      formData.append('active', String(newImage.active))
      
      await adminAPI.uploadImage(formData)
      setNewImage({ url: '', alt_text: '', category: 'general', active: true })
      setSelectedFile(null)
      await loadImages()
      showSuccess(t('admin.imageAdded'))
    } catch (error) {
      console.error('Error adding image:', error)
      showError(t('admin.failedToAddImage'))
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
      await loadImages()
      showSuccess(t('admin.imageDeleted'))
    } catch (error) {
      console.error('Error deleting image:', error)
      showError(t('admin.failedToDeleteImage'))
    } finally {
      setLoading(false)
    }
  }

  const toggleImageStatus = async (imageId: string, currentStatus: boolean) => {
    try {
      setLoading(true)
      // For now, we'll delete and re-add with updated status
      // In a real implementation, you'd have an update endpoint
      const image = images.find(img => img.id === imageId)
      if (image) {
        await adminAPI.deleteImage(imageId)
        const formData = new FormData()
        formData.append('url', image.url)
        formData.append('alt_text', image.alt_text)
        formData.append('category', image.category)
        formData.append('active', String(!currentStatus))
        await adminAPI.uploadImage(formData)
        await loadImages()
      }
    } catch (error) {
      console.error('Error updating image status:', error)
      showError(t('admin.failedToUpdateImageStatus'))
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
            <div className="image-input-options">
              <div className="input-option">
                <label>
                  <input
                    type="radio"
                    name="imageSource"
                    value="file"
                    checked={selectedFile !== null}
                    onChange={() => setNewImage({ ...newImage, url: '' })}
                  />
                  {t('admin.uploadFile')}
                </label>
                {selectedFile !== null && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                )}
              </div>
              <div className="input-option">
                <label>
                  <input
                    type="radio"
                    name="imageSource"
                    value="url"
                    checked={newImage.url !== ''}
                    onChange={() => setSelectedFile(null)}
                  />
                  {t('admin.useUrl')}
                </label>
                {newImage.url !== '' && (
                  <input
                    type="url"
                    value={newImage.url}
                    onChange={handleUrlChange}
                    placeholder={t('admin.imageUrlPlaceholder')}
                    className="url-input"
                  />
                )}
              </div>
            </div>
            {(selectedFile === null && newImage.url === '') && (
              <div className="input-prompt">
                <button
                  type="button"
                  onClick={handleChooseFile}
                  className="prompt-button"
                >
                  {t('admin.chooseImageFile')}
                </button>
                <span className="or-text"> {t('admin.or')} </span>
                <button
                  type="button"
                  onClick={handleChooseUrl}
                  className="prompt-button"
                >
                  {t('admin.enterImageUrl')}
                </button>
              </div>
            )}
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
              <option value="general">{t('admin.general')}</option>
              <option value="detailing">{t('admin.detailing')}</option>
              <option value="chrome-delete">Chrome Delete</option>
              <option value="before-after">{t('admin.beforeAfter')}</option>
              <option value="interior">{t('admin.interior')}</option>
              <option value="exterior">{t('admin.exterior')}</option>
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
        <h3>{t('admin.existingImages')} ({images.length})</h3>
        
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
                  <div className="image-category">{image.category}</div>
                  <div className="image-status">
                    {t('admin.status')}: {image.active ? t('admin.active') : t('admin.inactive')}
                  </div>
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
const NewsletterManagement: React.FC = () => {
  const { t } = useTranslation()
  const { showSuccess, showError, showWarning } = useToast()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [newsletterSubject, setNewsletterSubject] = useState('')
  const [newsletterContent, setNewsletterContent] = useState('')
  const [newsletterHTML, setNewsletterHTML] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadSubscribers()
  }, [])

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
      showWarning(t('admin.pleaseEnterNewsletterSubject'))
      return
    }

    if (!newsletterContent.trim() && !newsletterHTML.trim()) {
      showWarning(t('admin.pleaseEnterNewsletterContent'))
      return
    }

    if (window.confirm(t('admin.sendNewsletterToCountSubscribers', { count: subscribers.length }))) {
      try {
        setSending(true)
        await adminAPI.sendNewsletter({
          subject: newsletterSubject,
          content: newsletterHTML || `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${newsletterContent.replace(/\n/g, '<br>')}</div>`
        })
        showSuccess(t('admin.newsletterSentSuccessfully'))
        setNewsletterSubject('')
        setNewsletterContent('')
        setNewsletterHTML('')
      } catch (error) {
        console.error('Error sending newsletter:', error)
        showError(t('admin.failedToSendNewsletter'))
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