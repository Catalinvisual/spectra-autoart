import { vehicleServicesService } from './src/services/vehicleServicesService.js';

// Test pentru a vedea ce servicii există în server
async function testServerServices() {
  console.log('=== Test Server Services ===');
  
  // Așteptăm puțin pentru ca serverul să se inițializeze
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log(`📧 Services:`, vehicleServicesService.services.length)
  console.log(`📧 ServicePrices:`, vehicleServicesService.servicePrices.length)
  
  if (vehicleServicesService.services.length > 0) {
    console.log(`📧 First 3 services:`)
    vehicleServicesService.services.slice(0, 3).forEach((service, index) => {
      console.log(`  ${index + 1}. ID: ${service.id}, Name: "${service.name}", Active: ${service.is_active}`)
    })
  }
  
  // Test getServicesByBodyType
  const suvServices = vehicleServicesService.getServicesByBodyType('suv')
  console.log(`📧 SUV services found:`, suvServices.length)
  
  if (suvServices.length > 0) {
    console.log(`📧 First SUV service:`, JSON.stringify(suvServices[0], null, 2))
  }
  
  // Căutăm serviciul "Premium Wash"
  const premiumWash = vehicleServicesService.services.find(s => 
    s.name.toLowerCase().includes('premium') && s.name.toLowerCase().includes('wash')
  )
  console.log(`📧 Premium Wash found:`, premiumWash ? premiumWash.name : 'Not found')
  
  // Căutăm după cuvinte cheie
  const washServices = vehicleServicesService.services.filter(s => 
    s.name.toLowerCase().includes('wash') || s.name.toLowerCase().includes('spălare')
  )
  console.log(`📧 Wash services:`, washServices.length)
  washServices.forEach(service => {
    console.log(`  - "${service.name}" (ID: ${service.id})`)
  })
}

testServerServices().catch(console.error);