import { vehicleServicesService } from './src/services/vehicleServicesService.js';

// Test direct cu initializeDemoData
async function testDirectInitialize() {
  console.log('=== Test Direct Initialize ===');
  
  // Curățăm serviciile existente pentru a forța reinițializarea
  vehicleServicesService.services = []
  vehicleServicesService.servicePrices = []
  
  console.log(`📧 Before initialize: services=${vehicleServicesService.services.length}, prices=${vehicleServicesService.servicePrices.length}`)
  
  try {
    const result = await vehicleServicesService.initializeDemoData()
    console.log(`✅ initializeDemoData result:`, typeof result, result)
    
    console.log(`📧 After initialize: services=${vehicleServicesService.services.length}, prices=${vehicleServicesService.servicePrices.length}`)
    
    // Test getServicesByBodyType
    const suvServices = vehicleServicesService.getServicesByBodyType('suv')
    console.log(`📧 SUV services:`, suvServices.length)
    
    if (suvServices.length > 0) {
      console.log(`📧 First SUV service:`, JSON.stringify(suvServices[0], null, 2))
    }
    
  } catch (error) {
    console.error(`❌ Error in initializeDemoData:`, error)
  }
}

testDirectInitialize();