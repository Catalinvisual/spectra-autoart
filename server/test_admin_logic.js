// Test pentru a simula request-ul din admin.js
import { vehicleServicesService } from './src/services/vehicleServicesService.js';

async function testAdminLogic() {
  console.log('=== Test Admin Logic ===');
  
  // Simulăm logica din admin.js pentru a vedea ce servicii există
  try {
    await vehicleServicesService.loadFromGoogleSheets()
    console.log(`📧 Services loaded:`, vehicleServicesService.services.length)
  } catch (error) {
    console.error(`❌ Error loading services:`, error)
    console.log(`📧 DEBUG Using demo data as fallback...`)
    try {
      const demoResult = await vehicleServicesService.initializeDemoData()
      console.log(`📧 DEBUG Demo data loaded:`, demoResult)
    } catch (demoError) {
      console.error(`❌ Error loading demo data:`, demoError)
    }
  }
  
  console.log(`📧 Final state - Services:`, vehicleServicesService.services.length)
  console.log(`📧 Final state - ServicePrices:`, vehicleServicesService.servicePrices.length)
  
  // Căutăm servicii care conțin "wash"
  const washServices = vehicleServicesService.services.filter(s => 
    s.name.toLowerCase().includes('wash') || 
    s.name.toLowerCase().includes('spălare') ||
    s.name.toLowerCase().includes('premium')
  )
  console.log(`📧 Wash/Premium services:`, washServices.length)
  washServices.forEach(service => {
    console.log(`  - ID: ${service.id}, Name: "${service.name}"`)
  })
  
  // Test getServicesByBodyType
  const suvServices = vehicleServicesService.getServicesByBodyType('suv')
  console.log(`📧 SUV services:`, suvServices.length)
  
  if (suvServices.length > 0) {
    console.log(`📧 First SUV service:`, {
      id: suvServices[0].id,
      name: suvServices[0].name,
      price: suvServices[0].prices?.[0]?.price_min
    })
  }
}

testAdminLogic();