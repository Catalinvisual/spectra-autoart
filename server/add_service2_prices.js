import GoogleSheetsService from './src/services/googleSheetsService.js';
import dotenv from 'dotenv';

dotenv.config();

async function addService2Prices() {
  try {
    console.log('💰 Adding proper prices for Service 2...');
    
    await GoogleSheetsService.initialize();
    
    // Define the prices for Service 2 (Exterieur Detailpakket)
    const service2Prices = [
      { bodyType: '1', price: '15', duration: '45' },
      { bodyType: '2', price: '25', duration: '60' },
      { bodyType: '3', price: '35', duration: '75' },
      { bodyType: '4', price: '45', duration: '90' },
      { bodyType: '5', price: '55', duration: '105' },
      { bodyType: '6', price: '65', duration: '120' },
      { bodyType: '7', price: '75', duration: '135' },
      { bodyType: '8', price: '85', duration: '150' }
    ];
    
    console.log('📊 Adding prices for Service 2 (service-1765010178118-916)...');
    
    // Add each price row
    for (const priceData of service2Prices) {
      const priceRow = [
        `service_price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID
        'service-1765010178118-916', // Service_ID (correct Service 2 ID)
        priceData.bodyType, // Body_Type_Key
        priceData.price, // Price_Min
        'EUR', // Currency
        priceData.duration, // Duration_Minutes
        '0', // Promo_Percent
        'true' // Is_Active
      ];
      
      console.log(`Adding price: Body Type ${priceData.bodyType} = €${priceData.price} (${priceData.duration} min)`);
      
      await GoogleSheetsService.appendData('Vehicle_Service_Prices', priceRow);
    }
    
    console.log('\n✅ All prices added successfully for Service 2!');
    console.log('🔄 Restarting server to apply changes...');
    
  } catch (error) {
    console.error('❌ Error adding Service 2 prices:', error);
  }
}

addService2Prices();