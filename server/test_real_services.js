// Test pentru a vedea serviciile reale din Google Sheets
import { vehicleServicesService } from './src/services/vehicleServicesService.js';

async function testRealServices() {
  console.log('=== Test Real Services ===');
  
  // Forțăm încărcarea demo data (ca în server)
  try {
    const demoResult = await vehicleServicesService.initializeDemoData()
    console.log(`✅ Demo data loaded:`, demoResult)
  } catch (error) {
    console.error(`❌ Error loading demo data:`, error)
  }
  
  console.log(`📧 Services:`, vehicleServicesService.services.length)
  console.log(`📧 ServicePrices:`, vehicleServicesService.servicePrices.length)
  
  // Afișăm toate serviciile
  console.log(`📧 All services:`)
  vehicleServicesService.services.forEach((service, index) => {
    console.log(`  ${index + 1}. ID: ${service.id}, Name: "${service.name}"`)
  })
  
  // Căutăm servicii similare cu "Premium Wash"
  const keywords = ['wash', 'premium', 'spălare', 'exterior', 'clean'];
  
  keywords.forEach(keyword => {
    const matching = vehicleServicesService.services.filter(s => 
      s.name.toLowerCase().includes(keyword)
    )
    if (matching.length > 0) {
      console.log(`📧 Services containing "${keyword}":`)
      matching.forEach(service => {
        console.log(`  - "${service.name}" (ID: ${service.id})`)
      })
    }
  })
  
  // Test getServicesByBodyType pentru SUV
  const suvServices = vehicleServicesService.getServicesByBodyType('suv')
  console.log(`📧 SUV services:`, suvServices.length)
  
  if (suvServices.length > 0) {
    console.log(`📧 First SUV service:`, {
      id: suvServices[0].id,
      name: suvServices[0].name,
      price: suvServices[0].prices?.[0]?.price_min,
      currency: suvServices[0].prices?.[0]?.currency
    })
  }
}

testRealServices();