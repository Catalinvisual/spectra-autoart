import axios from 'axios'
import type { VehicleData, Service, BookingData, BodyType, ServiceWithPrices } from '../components/BookingWizard'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Debug logging for admin services
    if (response.config.url?.includes('/admin/services')) {
      console.log('🌐 API Response before processing:', response)
      console.log('📦 Response data before unwrap:', response.data)
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
    
    return response
  },
  (error) => {
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
    return api.get<ServiceWithPrices[]>(`/services-with-prices${queryString ? `?${queryString}` : ''}`);
  },
  getBodyTypes: (lang?: string) => api.get<BodyType[]>(`/public/body-types${lang ? `?lang=${lang}` : ''}`),
  getGallery: (lang?: string) => api.get('/public/gallery' + (lang ? `?lang=${lang}` : '')),
  getTestimonials: (lang?: string) => api.get('/public/testimonials' + (lang ? `?lang=${lang}` : '')),
  submitTestimonial: (data: { name: string; rating: number; comment: string }) => api.post('/public/testimonials', data),
  createBooking: (data: BookingData) => api.post('/public/bookings', data),
  subscribeNewsletter: (data: { email: string }) => api.post('/public/newsletter', data),
  translateText: (data: { text: string; target: string; source?: string }) => api.post('/public/translate', data),
  translateBatch: (data: { texts: string[]; target: string; source?: string }) => api.post('/public/translate/batch', data)
}

// Admin API endpoints
export const adminAPI = {
  login: (credentials: { email: string; password: string }) => api.post('/admin/auth/login', credentials),
  getBookings: () => api.get('/admin/bookings'),
  updateBooking: (id: string, data: any) => api.put(`/admin/bookings/${id}`, data),
  deleteBooking: (id: string) => api.delete(`/admin/bookings/${id}`),
  getServices: () => api.get('/admin/services'),
  createService: (data: any) => api.post('/admin/services', data),
  updateService: (id: string, data: any) => api.put(`/admin/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/admin/services/${id}`),
  getVehicleServices: () => api.get('/admin/vehicle-services'),
  createVehicleService: (data: any) => api.post('/admin/vehicle-services', data),
  updateVehicleService: (id: string, data: any) => api.put(`/admin/vehicle-services/${id}`, data),
  deleteVehicleService: (id: string) => api.delete(`/admin/vehicle-services/${id}`),
  getBodyTypes: () => api.get('/admin/body-types'),
  createBodyType: (data: any) => api.post('/admin/body-types', data),
  updateBodyType: (id: string, data: any) => api.put(`/admin/body-types/${id}`, data),
  deleteBodyType: (id: string) => api.delete(`/admin/body-types/${id}`),
  getGallery: () => api.get('/admin/gallery'),
  uploadImage: (data: FormData) => api.post('/admin/gallery', data),
  deleteImage: (id: string) => api.delete(`/admin/gallery/${id}`),
  getNewsletterSubscribers: () => api.get('/admin/newsletter-subscribers'),
  sendNewsletter: (data: { subject: string; content: string }) => api.post('/admin/newsletter/send', data)
}

export default api