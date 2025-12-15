// Test pentru a verifica structura datelor în vehicleServicesService
import { vehicleServicesService } from './src/services/vehicleServicesService.js';

async function testVehicleServiceStructure() {
  try {
    console.log('Testing vehicleServicesService structure...');
    
    // Inițializăm demo data
    const result = await vehicleServicesService.initializeDemoData();
    console.log('Demo data result:', result);
    
    console.log('\n📊 Service structure:');
    console.log('- Services count:', vehicleServicesService.services.length);
    console.log('- ServicePrices count:', vehicleServicesService.servicePrices.length);
    console.log('- BodyTypes count:', vehicleServicesService.bodyTypes.length);
    
    console.log('\n🔍 First service:');
    if (vehicleServicesService.services.length > 0) {
      const firstService = vehicleServicesService.services[0];
      console.log('- ID:', firstService.id, '(type:', typeof firstService.id, ')');
      console.log('- Name:', firstService.name);
      console.log('- Is active:', firstService.is_active);
    }
    
    console.log('\n🔍 First body type:');
    if (vehicleServicesService.bodyTypes.length > 0) {
      const firstBodyType = vehicleServicesService.bodyTypes[0];
      console.log('- ID:', firstBodyType.id, '(type:', typeof firstBodyType.id, ')');
      console.log('- Key:', firstBodyType.key);
      console.log('- Name:', firstBodyType.name);
    }
    
    console.log('\n🔍 First service price:');
    if (vehicleServicesService.servicePrices.length > 0) {
      const firstPrice = vehicleServicesService.servicePrices[0];
      console.log('- ID:', firstPrice.id);
      console.log('- Service ID:', firstPrice.service_id, '(type:', typeof firstPrice.service_id, ')');
      console.log('- Body Type ID:', firstPrice.body_type_id, '(type:', typeof firstPrice.body_type_id, ')');
      console.log('- Price min:', firstPrice.price_min);
      console.log('- Is active:', firstPrice.is_active);
    }
    
    console.log('\n🔍 Test getServicesByBodyType("suv"):');
    const suvServices = vehicleServicesService.getServicesByBodyType('suv');
    console.log('- Found services:', suvServices.length);
    if (suvServices.length > 0) {
      console.log('- First service:', suvServices[0].name);
      console.log('- First service price:', suvServices[0].prices?.[0]?.price_min);
    }
    
    console.log('\n🔍 Test find service by name "Premium Wash":');
    const premiumService = vehicleServicesService.services.find(s => s.name === 'Premium Wash');
    if (premiumService) {
      console.log('- Found Premium Wash:', premiumService.id);
      console.log('- Is active:', premiumService.is_active);
      
      // Caută prețul pentru SUV
      const suvBodyType = vehicleServicesService.bodyTypes.find(bt => bt.key === 'suv');
      if (suvBodyType) {
        console.log('- SUV body type ID:', suvBodyType.id, '(type:', typeof suvBodyType.id, ')');
        const suvPrice = vehicleServicesService.servicePrices.find(
          p => p.service_id === premiumService.id && p.body_type_id === String(suvBodyType.id)
        );
        if (suvPrice) {
          console.log('- SUV price found:', suvPrice.price_min);
        } else {
          console.log('- SUV price NOT found');
          console.log('- All prices for Premium Wash:');
          vehicleServicesService.servicePrices
            .filter(p => p.service_id === premiumService.id)
            .forEach(p => {
              console.log('  - Body type ID:', p.body_type_id, '(type:', typeof p.body_type_id, ') Price:', p.price_min);
            });
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testVehicleServiceStructure();