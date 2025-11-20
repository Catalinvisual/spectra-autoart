import axios from 'axios'

class VehiclesAPIService {
  constructor() {
    this.baseURL = 'https://the-vehicles-api.herokuapp.com'
    this.brands = null
    this.types = null
    this.models = null
    this.lastFetch = null
    this.cacheTimeout = 24 * 60 * 60 * 1000 // 24 hours
  }

  async initialize() {
    try {
      console.log('🚗 Initializing Vehicles API Service...')
      
      // Fetch brands and types on initialization
      await this.fetchBrands()
      await this.fetchTypes()
      
      console.log('✅ Vehicles API Service initialized successfully')
      return true
    } catch (error) {
      console.error('❌ Failed to initialize Vehicles API Service:', error.message)
      return false
    }
  }

  async fetchBrands() {
    try {
      const response = await axios.get(`${this.baseURL}/brands/`)
      this.brands = response.data
      console.log(`📋 Fetched ${this.brands.length} vehicle brands`)
      return this.brands
    } catch (error) {
      console.error('Error fetching brands:', error.message)
      throw error
    }
  }

  async fetchTypes() {
    try {
      const response = await axios.get(`${this.baseURL}/types/`)
      this.types = response.data
      console.log(`📋 Fetched ${this.types.length} vehicle types`)
      return this.types
    } catch (error) {
      console.error('Error fetching types:', error.message)
      throw error
    }
  }

  async fetchModelsByBrand(brandId) {
    try {
      const response = await axios.get(`${this.baseURL}/models?brandId=${brandId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching models for brand ${brandId}:`, error.message)
      throw error
    }
  }

  async getAllVehicles() {
    try {
      if (!this.brands) {
        await this.fetchBrands()
      }

      const vehicles = []
      
      // Fetch models for each brand
      for (const brand of this.brands) {
        try {
          const models = await this.fetchModelsByBrand(brand.id)
          
          models.forEach(model => {
            vehicles.push({
              id: `vehicle-${brand.id}-${model.id}`,
              make: brand.brand,
              model: model.model,
              type: model.type?.type || 'Car',
              body: this.getBodyType(model.model, model.type?.type)
            })
          })
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          console.warn(`⚠️  Skipping brand ${brand.brand} due to error:`, error.message)
          continue
        }
      }
      
      console.log(`🚗 Total vehicles fetched: ${vehicles.length}`)
      return vehicles
    } catch (error) {
      console.error('Error getting all vehicles:', error.message)
      console.log('⚠️  Using fallback vehicles data')
      // Return fallback vehicles data
      return [
        { id: 'vehicle-bmw-1', make: 'BMW', model: 'Seria 3', type: 'Car', body: 'Sedan' },
        { id: 'vehicle-bmw-2', make: 'BMW', model: 'X5', type: 'SUV', body: 'SUV' },
        { id: 'vehicle-audi-1', make: 'Audi', model: 'A4', type: 'Car', body: 'Sedan' },
        { id: 'vehicle-audi-2', make: 'Audi', model: 'Q7', type: 'SUV', body: 'SUV' },
        { id: 'vehicle-mercedes-1', make: 'Mercedes-Benz', model: 'C-Class', type: 'Car', body: 'Sedan' },
        { id: 'vehicle-mercedes-2', make: 'Mercedes-Benz', model: 'GLE', type: 'SUV', body: 'SUV' },
        { id: 'vehicle-vw-1', make: 'Volkswagen', model: 'Golf', type: 'Car', body: 'Hatchback' },
        { id: 'vehicle-vw-2', make: 'Volkswagen', model: 'Touareg', type: 'SUV', body: 'SUV' },
        { id: 'vehicle-toyota-1', make: 'Toyota', model: 'Corolla', type: 'Car', body: 'Sedan' },
        { id: 'vehicle-toyota-2', make: 'Toyota', model: 'RAV4', type: 'SUV', body: 'SUV' }
      ]
    }
  }

  getBodyType(modelName, type) {
    const modelLower = modelName.toLowerCase()
    const typeLower = type?.toLowerCase() || ''
    
    // Determine body type based on model name and type
    if (modelLower.includes('van') || modelLower.includes('transporter')) return 'Van'
    if (modelLower.includes('pickup')) return 'Pickup'
    if (modelLower.includes('cabriolet') || modelLower.includes('convertible')) return 'Convertible'
    if (modelLower.includes('coupe') || modelLower.includes('coupe')) return 'Coupe'
    if (modelLower.includes('hatchback')) return 'Hatchback'
    if (modelLower.includes('wagon') || modelLower.includes('estate') || modelLower.includes('touring')) return 'Wagon'
    if (typeLower.includes('suv') || modelLower.includes('suv')) return 'SUV'
    if (typeLower.includes('motorcycle')) return 'Motorcycle'
    if (typeLower.includes('truck')) return 'Truck'
    
    // Default to common types
    if (typeLower.includes('car')) return 'Sedan'
    
    return type || 'Sedan'
  }

 async getBrands() {
    try {
      if (!this.brands) {
        await this.fetchBrands()
      }
      return this.brands || []
    } catch (error) {
      console.warn('⚠️  Using fallback brands due to API error:', error.message)
      // Return fallback brands if API fails
      return [
        { id: 'bmw', brand: 'BMW' },
        { id: 'audi', brand: 'Audi' },
        { id: 'mercedes', brand: 'Mercedes-Benz' },
        { id: 'volkswagen', brand: 'Volkswagen' },
        { id: 'toyota', brand: 'Toyota' },
        { id: 'honda', brand: 'Honda' },
        { id: 'ford', brand: 'Ford' },
        { id: 'renault', brand: 'Renault' },
        { id: 'peugeot', brand: 'Peugeot' },
        { id: 'citroen', brand: 'Citroen' }
      ]
    }
  }

  getTypes() {
    return this.types || []
  }

  // Cache management
  isCacheValid() {
    return this.lastFetch && (Date.now() - this.lastFetch) < this.cacheTimeout
  }

  updateCacheTimestamp() {
    this.lastFetch = Date.now()
  }
}

export default new VehiclesAPIService()