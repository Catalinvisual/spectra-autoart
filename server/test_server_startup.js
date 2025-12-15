import { vehicleServicesService } from './src/services/vehicleServicesService.js';

// Simulăm inițializarea din index.js
async function simulateServerStartup() {
  console.log('=== Simulate Server Startup ===');
  
  // Verificăm environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  console.log(`📧 NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`📧 Is development: ${isDevelopment}`)
  
  // Simulăm logica din index.js
  if (isDevelopment) {
    console.log('📧 Development mode: initializing demo data...')
    try {
      const demoData = await vehicleServicesService.initializeDemoData()
      console.log('✅ Vehicle services demo data initialized')
      console.log(`📋 ${demoData?.services || 0} services created`)
      console.log(`💰 ${demoData?.prices || 0} price configurations created`)
      
      // Verificăm starea după inițializare
      console.log(`📧 After init - Services:`, vehicleServicesService.services.length)
      console.log(`📧 After init - ServicePrices:`, vehicleServicesService.servicePrices.length)
      
      // Test getServicesByBodyType
      const suvServices = vehicleServicesService.getServicesByBodyType('suv')
      console.log(`📧 SUV services:`, suvServices.length)
      
    } catch (error) {
      console.error('❌ Error initializing demo data:', error)
    }
  }
}

simulateServerStartup();