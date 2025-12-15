import { vehicleServicesService } from './src/services/vehicleServicesService.js';

vehicleServicesService.initializeDemoData().then(() => {
  console.log('Body types:', vehicleServicesService.bodyTypes.length);
  console.log('Service prices:', vehicleServicesService.servicePrices.length);
  console.log('Services:', vehicleServicesService.services.length);
  
  // Test getServicesByBodyType
  const result = vehicleServicesService.getServicesByBodyType('suv');
  console.log('getServicesByBodyType suv:', result.length);
  
  // Verificăm bodyTypes
  console.log('Body types:', vehicleServicesService.bodyTypes.map(bt => ({id: bt.id, key: bt.key, name: bt.name})));
  
  // Verificăm servicePrices pentru Premium Wash și SUV
  const premiumWashSUV = vehicleServicesService.servicePrices.find(sp => 
    sp.service_id === 1 && 
    vehicleServicesService.bodyTypes.find(bt => bt.id === sp.body_type_id)?.key === 'suv'
  );
  console.log('Premium Wash SUV price:', premiumWashSUV);
  
  // Verificăm de ce getServicesByBodyType returnează gol
  const bodyType = vehicleServicesService.bodyTypes.find(bt => bt.key === 'suv');
  console.log('SUV bodyType:', bodyType);
  
  if (bodyType) {
    const pricesForSUV = vehicleServicesService.servicePrices.filter(sp => 
      sp.body_type_id === bodyType.id && sp.is_active
    );
    console.log('Prices for SUV:', pricesForSUV.length);
    
    const activeServices = vehicleServicesService.services.filter(s => s.is_active);
    console.log('Active services:', activeServices.length);
  }
});