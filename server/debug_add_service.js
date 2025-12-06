import { vehicleServicesService } from './src/services/vehicleServicesService.js';
import GoogleSheetsService from './src/services/googleSheetsService.js';

// Set up environment variables
process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90';
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com';
process.env.GOOGLE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD3oGm8uOGNRK6Q\nWDXuq88Z0TaPak47tFy/NjdG5oVlWlnKjwdKLrUw5zZr5OrOyO2lRuaU+tpojg9Y\nojLdZm2oUJaBLrJNMN7QaTdvOQ1Whvufqo9ftFijgaw9LNgv2E5t44klDjfvon1n\nuuz3YJagGk8/1kDOdQJ9S2rYFdQuacEqPYz0vhZhZFybChZ4FYlCRP/080fDjBcX\nyTN76ZbZYh+3JlXOyOD4xKCEvJORjhabvNxxXIbwgk160KRp13hSBfcrI1Qifgld\nXDLByykJM8rI3Y5hQicL23/NesbC3HfdlL6giD3/AryoYQXACwQn/OjKIDh5cX4A\nIauW0/9/AgMBAAECggEAZ797zaggSBHYmX17yy2MraJsG5ZMhNNCcJKEgl4e0aIT\nMLzQLxJ2s7CLqpTUlCK2/qJABXc8fsXWRCpg6UX696QcCq/H4HNzRxpuMVlT70bK\nsdDCFTT4VjkEMvVQ9mrIIV5NnYrhgLMxm35Dvjlnolijj3ly2Y1Ip7orX7F1nqO5\nYkTE85ACAmGVXK0modJ38QEnuF9vZTVewdNpzTjYuyBndae3MaqNS0oR/iPqRWkA\n/Xd5v6i8N1KeSZl6ukdRz2ZCWZlzBpmuwOO0MZ4pLhy3ZYjve/o/cE1uL6LjPmET\novWzk16MvUF8GB7souPQVwN994GPp0Z+f7cfcrC9oQKBgQD8Fj9ft3Dkb70xqBDs\nlkzmzcWzPLaImPHAHrLprgb14JV50pnbFDIyUEsGYpkakaXdwgVzBjPcOyoILTMa\nHuVQl81RQNHURagGXB+yPwZbo0/Sxcv78q6TC6vYtNkDB07/zZKLyGjmw5xEyqKb\nmy6WWTVXxK0uzSi5gDVK7apj9wKBgQD7eHDl8z8ofImA2hNBuNNNfLXQ1e4/GFv8\nUgexAfDRwHUPJxGu6HFvmLl5PRo9HOQKnvmiJlkhcyQxuN+HFnlJZYcKfyhqQC3E\n2aUsm29bHC5kZxYTMn/a+8I/ipcb8CumAe/Ah7xJ5seWCkf7jWifKGDZ/rjqJv8d\niRndVYfOuQKBgCwSr63KYqBtsMQ3wA29EWDg5Qm7OaaUJuAR/fHBDVJ7m2abHW8i\nDsyhIRzSrDXq9Pbabx13HiYI6gZX8LFGaY03nRvxmz3jl8bU4G3HexMWcGRHVKyN\n91uaFMdkhvRymKs8g7yQo1aFKJMWYmuWLAT5P8xChIzELbSQ58Bb4QhtAoGBAMF6\nFirl7ycAQm8P2hcL1A9fLyghILAM1uEYX/CRVK6dC7N/1Lwk/PnmoHUmTOTOMKn3\nTIu0Q4lX5HYZDmoKIYEWC0NJOFgfTteQuOPMJ24LDaqUIcjdZr+eSgLHZ6HINF0C\nSmtwQ678T30iJeXmE6O41mOC9tS48jnQPUUsxFOJAoGAXdnfv0AdOamAl/p7A+ne\nc6Pe0AJYDfMybJ0FFcnIadidfMjZErszAFEaF0zwqa+P0K98OVIOLC+6AJT6DGui\nd4L8iZQXs0+akvYdqQXoKOxvhZX9mdRheai+eLswIMgj4sHOIZb4kt4YNTBl9TMY\npd3aF5MKOkPQ2ZBYvro8c60=\n-----END PRIVATE KEY-----`;

async function debugAddService() {
  try {
    console.log('🔄 Initializing Google Sheets service...');
    await GoogleSheetsService.initialize();
    
    console.log('🔄 Loading data from Google Sheets...');
    await vehicleServicesService.loadFromGoogleSheets();
    
    const testServiceData = {
      name: 'Test Service Debug',
      description: 'Test service for debugging price sync',
      category: 'testing',
      duration_minutes: 90,
      is_active: true,
      prices: {
        sedan: { price_min: 75, price_max: 95, duration_minutes: 90 },
        suv: { price_min: 85, price_max: 105, duration_minutes: 100 }
      }
    };
    
    console.log('📝 Creating service with prices:', JSON.stringify(testServiceData, null, 2));
    
    const result = await vehicleServicesService.addServiceWithPrices(testServiceData, testServiceData.prices);
    
    console.log('✅ Service created:', {
      service: result.service,
      pricesCount: result.prices.length,
      prices: result.prices
    });
    
    console.log('🔍 Checking Google Sheets for the new service prices...');
    
    // Wait a bit for Google Sheets to sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sheet = GoogleSheetsService.doc.sheetsByTitle['Vehicle_Service_Prices'];
    const rows = await sheet.getRows();
    
    const newServicePrices = rows.filter(row => {
      const serviceId = row.get('Service_ID');
      return serviceId === result.service.id;
    });
    
    console.log(`📊 Found ${newServicePrices.length} prices for service ${result.service.id}:`);
    newServicePrices.forEach(row => {
      console.log(`  - Body Type: ${row.get('Body_Type_Key')}, Price: ${row.get('Price_Min')} ${row.get('Currency')}`);
    });
    
    if (newServicePrices.length === 0) {
      console.log('❌ No prices found in Google Sheets for the new service!');
      console.log('🔍 All service prices in memory:', vehicleServicesService.servicePrices.filter(p => p.service_id === result.service.id));
    }
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
  }
}

debugAddService();