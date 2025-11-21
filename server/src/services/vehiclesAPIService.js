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
      console.log(`⚠️  Using fallback models for brand ${brandId}`)
      
      // Return fallback models based on brand
      const fallbackModels = {
        'bmw': [
          { id: '1', model: 'Seria 3', type: { type: 'Car' } },
          { id: '2', model: 'Seria 5', type: { type: 'Car' } },
          { id: '3', model: 'X1', type: { type: 'SUV' } },
          { id: '4', model: 'X3', type: { type: 'SUV' } },
          { id: '5', model: 'X5', type: { type: 'SUV' } }
        ],
        'audi': [
          { id: '1', model: 'A3', type: { type: 'Car' } },
          { id: '2', model: 'A4', type: { type: 'Car' } },
          { id: '3', model: 'A6', type: { type: 'Car' } },
          { id: '4', model: 'Q3', type: { type: 'SUV' } },
          { id: '5', model: 'Q5', type: { type: 'SUV' } },
          { id: '6', model: 'Q7', type: { type: 'SUV' } }
        ],
        'mercedes': [
          { id: '1', model: 'A-Class', type: { type: 'Car' } },
          { id: '2', model: 'C-Class', type: { type: 'Car' } },
          { id: '3', model: 'E-Class', type: { type: 'Car' } },
          { id: '4', model: 'GLA', type: { type: 'SUV' } },
          { id: '5', model: 'GLC', type: { type: 'SUV' } },
          { id: '6', model: 'GLE', type: { type: 'SUV' } }
        ],
        'volkswagen': [
          { id: '1', model: 'Golf', type: { type: 'Car' } },
          { id: '2', model: 'Passat', type: { type: 'Car' } },
          { id: '3', model: 'Tiguan', type: { type: 'SUV' } },
          { id: '4', model: 'Touareg', type: { type: 'SUV' } },
          { id: '5', model: 'Polo', type: { type: 'Car' } }
        ],
        'toyota': [
          { id: '1', model: 'Corolla', type: { type: 'Car' } },
          { id: '2', model: 'Camry', type: { type: 'Car' } },
          { id: '3', model: 'RAV4', type: { type: 'SUV' } },
          { id: '4', model: 'Highlander', type: { type: 'SUV' } },
          { id: '5', model: 'Yaris', type: { type: 'Car' } }
        ],
        'honda': [
          { id: '1', model: 'Civic', type: { type: 'Car' } },
          { id: '2', model: 'Accord', type: { type: 'Car' } },
          { id: '3', model: 'CR-V', type: { type: 'SUV' } },
          { id: '4', model: 'HR-V', type: { type: 'SUV' } },
          { id: '5', model: 'Jazz', type: { type: 'Car' } }
        ],
        'ford': [
          { id: '1', model: 'Focus', type: { type: 'Car' } },
          { id: '2', model: 'Mondeo', type: { type: 'Car' } },
          { id: '3', model: 'Kuga', type: { type: 'SUV' } },
          { id: '4', model: 'Edge', type: { type: 'SUV' } },
          { id: '5', model: 'Fiesta', type: { type: 'Car' } }
        ],
        'renault': [
          { id: '1', model: 'Clio', type: { type: 'Car' } },
          { id: '2', model: 'Megane', type: { type: 'Car' } },
          { id: '3', model: 'Kadjar', type: { type: 'SUV' } },
          { id: '4', model: 'Captur', type: { type: 'SUV' } },
          { id: '5', model: 'Scenic', type: { type: 'MPV' } }
        ],
        'peugeot': [
          { id: '1', model: '208', type: { type: 'Car' } },
          { id: '2', model: '308', type: { type: 'Car' } },
          { id: '3', model: '3008', type: { type: 'SUV' } },
          { id: '4', model: '5008', type: { type: 'SUV' } },
          { id: '5', model: '2008', type: { type: 'SUV' } }
        ],
        'citroen': [
          { id: '1', model: 'C3', type: { type: 'Car' } },
          { id: '2', model: 'C4', type: { type: 'Car' } },
          { id: '3', model: 'C5 Aircross', type: { type: 'SUV' } },
          { id: '4', model: 'Berlingo', type: { type: 'MPV' } },
          { id: '5', model: 'C1', type: { type: 'Car' } }
        ]
      }
      
      return fallbackModels[brandId] || [
        { id: '1', model: 'Model 1', type: { type: 'Car' } },
        { id: '2', model: 'Model 2', type: { type: 'Car' } },
        { id: '3', model: 'Model 3', type: { type: 'SUV' } }
      ]
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