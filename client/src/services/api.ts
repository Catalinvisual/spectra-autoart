import axios from 'axios'
import type { VehicleData, Service, BookingData, BodyType, ServiceWithPrices } from '../components/BookingWizard'

const resolveBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    const u = envUrl.trim()
    if (u.endsWith('/api')) return u
    if (u.endsWith('/')) return `${u}api`
    return `${u}/api`
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/api`
  }
  return '/api'
}

  const API_BASE_URL = resolveBaseURL()

console.log('🔍 API Base URL:', API_BASE_URL)
console.log('🔍 VITE_API_URL env:', import.meta.env.VITE_API_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased timeout to 60 seconds for service creation
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Debug logging for testimonial requests
    if (config.url?.includes('/public/testimonials')) {
      console.log('🎯 Testimonials Request:', {
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        method: config.method,
        headers: config.headers,
        timeout: config.timeout
      })
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Debug logging for testimonial responses
    if (response.config.url?.includes('/public/testimonials')) {
      console.log('✅ Testimonials Response:', {
        url: response.config.url,
        status: response.status,
        statusText: response.statusText,
        data: response.data
      })
    }
    
    // Debug logging for admin services
    if (response.config.url?.includes('/admin/services')) {
      console.log('🌐 API Response before processing:', response)
      console.log('📦 Response data before unwrap:', response.data)
    }
    
    // Debug logging for admin bookings
    if (response.config.url?.includes('/admin/bookings')) {
      console.log('🌐 Bookings API Response before processing:', response)
      console.log('📦 Bookings data before unwrap:', response.data)
    }
    
    // Unwrap the response data if it has the standard API format
    if (response.data && response.data.success === true && response.data.data !== undefined) {
      response.data = response.data.data
    } else if (response.data && response.data.success === false) {
      // Handle error responses - keep the error structure
      console.error('API Error Response:', response.data)
    }
    
    // Debug logging for admin services after processing
    if (response.config.url?.includes('/admin/services')) {
      console.log('✅ API Response after processing:', response)
      console.log('📋 Response data after unwrap:', response.data)
    }
    
    // Debug logging for admin bookings after processing
    if (response.config.url?.includes('/admin/bookings')) {
      console.log('✅ Bookings API Response after processing:', response)
      console.log('📋 Bookings data after unwrap:', response.data)
    }
    
    // Debug logging for ALL admin responses to identify HTML returns
    if (response.config.url?.includes('/admin/') && typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.log('❌ ADMIN HTML RESPONSE DETECTED:', {
        url: response.config.url,
        method: response.config.method,
        status: response.status,
        dataType: typeof response.data,
        dataPreview: response.data.substring(0, 200)
      })
    }
    
    return response
  },
  (error) => {
    // Debug logging for testimonial errors
    if (error.config?.url?.includes('/public/testimonials')) {
      console.log('❌ Testimonials Error:', {
        url: error.config.url,
        method: error.config.method,
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      })
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      // Only redirect to admin login if not already on admin page
      if (!window.location.pathname.includes('/admin')) {
        window.location.href = '/admin'
      }
    }
    return Promise.reject(error)
  }
)

// Public API endpoints
  export const publicAPI = {
  getVehicles: () => api.get<VehicleData[]>('/public/vehicles'),
  getVehicleMakes: () => api.get<string[]>('/public/vehicles/makes'),
  getVehicleTypes: () => api.get<string[]>('/public/vehicles/types'),
  getVehicleModels: (make: string) => api.get<string[]>(`/public/vehicles/makes/${make}/models`),
  getServices: (lang?: string) => api.get<Service[]>(`/public/services${lang ? `?lang=${lang}` : ''}`),
  getServicesWithPrices: (lang?: string, bodyType?: string) => {
    const params = new URLSearchParams();
    if (lang) params.append('lang', lang);
    if (bodyType) params.append('bodyType', bodyType);
    const queryString = params.toString();
    return api.get<ServiceWithPrices[]>(`/vehicle-services/services-with-prices${queryString ? `?${queryString}` : ''}`);
  },
  getServicesWithCachedTranslations: (lang?: string, activeOnly: boolean = true) => {
    const params = new URLSearchParams();
    params.append('active_only', activeOnly ? 'true' : 'false');
    const queryString = params.toString();
    return api.get<ServiceWithPrices[]>(`/services/cached/translations/${lang || 'nl'}${queryString ? `?${queryString}` : ''}`);
  },
  getBodyTypes: (lang?: string) => api.get<BodyType[]>(`/public/body-types${lang ? `?lang=${lang}` : ''}`),
  getGallery: (lang?: string) => api.get('/public/gallery' + (lang ? `?lang=${lang}` : '')),
  getTestimonials: (lang?: string) => api.get('/public/testimonials' + (lang ? `?lang=${lang}` : '')),
  submitTestimonial: (data: { name: string; rating: number; comment: string }) => api.post('/public/testimonials', data),
  createBooking: (data: BookingData) => api.post('/public/bookings', data),
  submitContact: (data: { name: string; email: string; phone?: string; subject: string; message: string }) => api.post('/public/contact', data),
  subscribeNewsletter: (data: { email: string; locale?: string }) => api.post('/public/newsletter/subscribe', data),
  translateText: (data: { text: string; target: string; source?: string }) => api.post('/translate', data),
  translateBatch: (data: { texts: string[]; target: string; source?: string }) => api.post('/translate/batch', data),
  getAvailability: (date?: string) => api.get(`/public/bookings/availability${date ? `?date=${date}` : ''}`)
  ,askChat: (question: string, lang: string) => api.post('/public/chat', { question, lang })
}

// Admin API endpoints
export const adminAPI = {
  login: (credentials: { email: string; password: string }) => api.post('/admin/auth/login', credentials),
  getBookings: () => api.get('/admin/bookings'),
  updateBooking: (id: string, data: any) => api.patch(`/admin/bookings/${id}`, data),
  deleteBooking: (id: string) => api.delete(`/admin/bookings/${id}`),

  getVehicleServices: () => api.get('/admin/vehicle-services'),
  createVehicleService: (data: any) => api.post('/admin/vehicle-services', data),
  createVehicleServiceWithTranslation: (data: any) => api.post('/admin/services/create-with-translation', data),
  updateVehicleService: (id: string, data: any) => api.put(`/admin/vehicle-services/${id}`, data),
  deleteVehicleService: (id: string) => api.delete(`/admin/vehicle-services/${id}`),
  getBodyTypes: () => api.get('/admin/body-types'),
  createBodyType: (data: any) => api.post('/admin/body-types', data),
  updateBodyType: (id: string, data: any) => api.put(`/admin/body-types/${id}`, data),
  deleteBodyType: (id: string) => api.delete(`/admin/body-types/${id}`),
  getGallery: () => api.get('/admin/gallery'),
  uploadImage: (data: { url: string; alt_text: string; category: string; active: boolean }) => api.post('/admin/gallery', data),
  uploadImageFile: (formData: FormData) => api.post('/admin/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  deleteImage: (id: string) => api.delete(`/admin/gallery/${id}`),
  updateImage: (id: string, data: { active?: boolean; alt_text?: string; category?: string }) => api.put(`/admin/gallery/${id}`, data),
  getNewsletterSubscribers: () => api.get('/admin/newsletter-subscribers'),
  sendNewsletter: (data: { subject: string; content: string }) => api.post('/admin/newsletter/send', data)
}

export default api
