import { vehicleServicesService } from './src/services/vehicleServicesService.js';

// Simulăm contextul din admin.js
async function testAdminContext() {
  console.log('=== Test Admin Context ===');
  
  // Inițializăm serviciile
  if (!vehicleServicesService.services || vehicleServicesService.services.length === 0) {
    console.log(`📧 DEBUG Loading services from Google Sheets...`)
    try {
      await vehicleServicesService.loadFromGoogleSheets()
      console.log(`📧 DEBUG Services loaded:`, vehicleServicesService.services.length)
    } catch (error) {
      console.error(`❌ Error loading services:`, error)
      console.log(`📧 DEBUG Using demo data as fallback...`)
      // Folosim demo data ca fallback
      try {
        const demoResult = await vehicleServicesService.initializeDemoData()
        console.log(`📧 DEBUG Demo data loaded:`, demoResult)
      } catch (demoError) {
        console.error(`❌ Error loading demo data:`, demoError)
      }
    }
  }
  
  const bodyTypeKey = 'suv';
  console.log(`📧 DEBUG bodyTypeKey: "${bodyTypeKey}"`)
  console.log(`📧 DEBUG vehicleServicesService.services:`, vehicleServicesService?.services?.length || 0)
  console.log(`📧 DEBUG vehicleServicesService.servicePrices:`, vehicleServicesService?.servicePrices?.length || 0)
  console.log(`📧 DEBUG vehicleServicesService.bodyTypes:`, vehicleServicesService?.bodyTypes?.length || 0)
  
  let servicesWithPrices = []
  if (vehicleServicesService && typeof vehicleServicesService.getServicesByBodyType === 'function') {
    console.log(`📧 DEBUG Available body types:`, vehicleServicesService.bodyTypes?.map(bt => ({key: bt.key, name: bt.name})) || [])
    console.log(`📧 DEBUG Calling getServicesByBodyType with: "${bodyTypeKey}"`)
    servicesWithPrices = vehicleServicesService.getServicesByBodyType(bodyTypeKey)
    console.log(`📧 DEBUG servicesWithPrices from getServicesByBodyType:`, servicesWithPrices.length)
    
    if (servicesWithPrices.length === 0) {
      // Try with mapped body type
      if (vehicleServicesService.mapFrontendKeyToBodyType) {
        const mappedBodyType = vehicleServicesService.mapFrontendKeyToBodyType(bodyTypeKey)
        console.log(`📧 DEBUG Mapped body type:`, mappedBodyType)
        if (mappedBodyType && mappedBodyType.key) {
          servicesWithPrices = vehicleServicesService.getServicesByBodyType(mappedBodyType.key)
          console.log(`📧 DEBUG servicesWithPrices with mapped key:`, servicesWithPrices.length)
        }
      }
    }
    
    if (servicesWithPrices.length > 0) {
      console.log(`📧 DEBUG First service with prices:`, JSON.stringify(servicesWithPrices[0], null, 2))
    }
  } else {
    console.log(`⚠️ DEBUG getServicesByBodyType method not available`)
  }
  
  // Test căutare serviciu
  const tokens = ['Premium Wash'];
  console.log(`📧 DEBUG tokens:`, tokens)
  console.log(`📧 DEBUG servicesWithPrices.length:`, servicesWithPrices.length)
  
  if (servicesWithPrices && servicesWithPrices.length > 0) {
    // Create a map for quick lookup by name
    const servicesByName = new Map()
    // Also create a map by ID for fallback
    const servicesById = new Map()
    
    servicesWithPrices.forEach(service => {
      // Map by name (lowercase)
      servicesByName.set(service.name.toLowerCase(), service)
      if (service.name_en) {
        servicesByName.set(service.name_en.toLowerCase(), service)
      }
      // Map by ID for fallback
      servicesById.set(String(service.id), service)
    })
    
    console.log(`📧 DEBUG servicesByName size:`, servicesByName.size)
    console.log(`📧 DEBUG servicesById size:`, servicesById.size)
    
    const servicesArr = tokens.map(token => {
      const trimmed = token.trim()
      console.log(`📧 DEBUG Processing token: "${trimmed}"`)
      
      // Try to find service by name first, then by ID as fallback
      let service = servicesByName.get(trimmed.toLowerCase())
      if (!service) {
        // Try by ID (in case the token is a service ID)
        service = servicesById.get(trimmed)
        console.log(`📧 DEBUG Trying by ID: "${trimmed}" - found:`, !!service)
      }
      console.log(`📧 DEBUG Service found:`, !!service)
      
      if (service) {
        console.log(`📧 DEBUG Service details: name="${service.name}", hasPrices="${!!service.prices}", pricesLength="${service.prices?.length || 0}"`)
        
        // Calculăm prețul bazat pe body type, similar cu public.js
        const resolvedBodyKey = String(bodyTypeKey || '').toLowerCase()
        const priceEntry = service.prices && Array.isArray(service.prices)
          ? service.prices.find(p => String(p.body_type_key).toLowerCase() === resolvedBodyKey && p.is_active)
          : null
        const price = priceEntry && priceEntry.price_min !== undefined ? Number(priceEntry.price_min) : 0
        
        console.log(`💰 DEBUG Service '${trimmed}' price for body '${resolvedBodyKey}':`, price)
        return { 
          name: service.name, 
          price: price 
        }
      } else {
        console.log(`⚠️ DEBUG Service not found for token: "${trimmed}"`)
        return { 
          name: trimmed, 
          price: 0 
        }
      }
    }).filter(service => service.name.length > 0)
    
    console.log(`📧 DEBUG servicesArr:`, JSON.stringify(servicesArr, null, 2))
  } else {
    console.log(`⚠️ DEBUG No servicesWithPrices available`)
  }
}

testAdminContext().catch(console.error);