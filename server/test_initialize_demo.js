import { vehicleServicesService } from './src/services/vehicleServicesService.js';

async function testInitializeDemoData() {
  console.log('=== Test initializeDemoData ===');
  
  try {
    const result = await vehicleServicesService.initializeDemoData()
    console.log(`✅ initializeDemoData result:`, result)
    
    console.log(`📧 Services:`, vehicleServicesService.services.length)
    console.log(`📧 ServicePrices:`, vehicleServicesService.servicePrices.length)
    console.log(`📧 BodyTypes:`, vehicleServicesService.bodyTypes.length)
    
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

testInitializeDemoData();