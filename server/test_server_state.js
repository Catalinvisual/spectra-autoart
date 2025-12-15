import { vehicleServicesService } from './src/services/vehicleServicesService.js';

// Test direct pentru a verifica ce conține vehicleServicesService
async function testServerState() {
  console.log('=== Test Server State ===');
  
  // Verificăm starea actuală
  console.log(`📧 Services:`, vehicleServicesService.services.length)
  console.log(`📧 ServicePrices:`, vehicleServicesService.servicePrices.length)
  console.log(`📧 BodyTypes:`, vehicleServicesService.bodyTypes.length)
  
  // Verificăm dacă există servicii active
  const activeServices = vehicleServicesService.services.filter(s => s.is_active)
  console.log(`📧 Active services:`, activeServices.length)
  
  // Verificăm dacă există prețuri active
  const activePrices = vehicleServicesService.servicePrices.filter(p => p.is_active)
  console.log(`📧 Active prices:`, activePrices.length)
  
  // Verificăm pentru SUV
  const suvBodyType = vehicleServicesService.bodyTypes.find(bt => bt.key === 'suv')
  console.log(`📧 SUV body type:`, suvBodyType)
  
  if (suvBodyType) {
    const suvPrices = vehicleServicesService.servicePrices.filter(p => 
      p.body_type_id === suvBodyType.id && p.is_active
    )
    console.log(`📧 SUV prices:`, suvPrices.length)
    
    if (suvPrices.length > 0) {
      console.log(`📧 First SUV price:`, suvPrices[0])
    }
  }
  
  // Test getServicesByBodyType
  const result = vehicleServicesService.getServicesByBodyType('suv')
  console.log(`📧 getServicesByBodyType result:`, result.length)
  
  if (result.length > 0) {
    console.log(`📧 First result:`, JSON.stringify(result[0], null, 2))
  }
}

testServerState();