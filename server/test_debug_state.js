import { vehicleServicesService } from './src/services/vehicleServicesService.js';

async function debugCurrentState() {
  console.log('🔍 Debugging current state...');
  
  console.log('📋 vehicleServicesService.services:', vehicleServicesService.services);
  console.log('📋 Type of services:', typeof vehicleServicesService.services);
  console.log('📋 Services is array:', Array.isArray(vehicleServicesService.services));
  console.log('📋 Services length:', vehicleServicesService.services?.length || 0);
  
  console.log('\n📋 vehicleServicesService.servicePrices:', vehicleServicesService.servicePrices);
  console.log('📋 ServicePrices length:', vehicleServicesService.servicePrices?.length || 0);
  
  console.log('\n📋 vehicleServicesService.bodyTypes:', vehicleServicesService.bodyTypes);
  console.log('📋 BodyTypes length:', vehicleServicesService.bodyTypes?.length || 0);
  
  // Test condiție
  const condition = !vehicleServicesService.services || vehicleServicesService.services.length === 0;
  console.log('\n🔍 Condition (!services || services.length === 0):', condition);
  console.log('🔍 !vehicleServicesService.services:', !vehicleServicesService.services);
  console.log('🔍 vehicleServicesService.services.length === 0:', vehicleServicesService.services.length === 0);
}

debugCurrentState();