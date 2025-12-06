import GoogleSheetsService from './src/services/googleSheetsService.js';

// Set production environment variables directly
process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90';
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com';
process.env.GOOGLE_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD3oGm8uOGNRK6Q
WDXuq88Z0TaPak47tFy/NjdG5oVlWlnKjwdKLrUw5zZr5OrOyO2lRuaU+tpojg9Y
ojLdZm2oUJaBLrJNMN7QaTdvOQ1Whvufqo9ftFijgaw9LNgv2E5t44klDjfvon1n
uuz3YJagGk8/1kDOdQJ9S2rYFdQuacEqPYz0vhZhZFybChZ4FYlCRP/080fDjBcX
yTN76ZbZYh+3JlXOyOD4xKCEvJORjhabvNxxXIbwgk160KRp13hSBfcrI1Qifgld
XDLByykJM8rI3Y5hQicL23/NesbC3HfdlL6giD3/AryoYQXACwQn/OjKIDh5cX4A
IauW0/9/AgMBAAECggEAZ797zaggSBHYmX17yy2MraJsG5ZMhNNCcJKEgl4e0aIT
MLzQLxJ2s7CLqpTUlCK2/qJABXc8fsXWRCpg6UX696QcCq/H4HNzRxpuMVlT70bK
sdDCFTT4VjkEMvVQ9mrIIV5NnYrhgLMxm35Dvjlnolijj3ly2Y1Ip7orX7F1nqO5
YkTE85ACAmGVXK0modJ38QEnuF9vZTVewdNpzTjYuyBndae3MaqNS0oR/iPqRWkA
/Xd5v6i8N1KeSZl6ukdRz2ZCWZlzBpmuwOO0MZ4pLhy3ZYjve/o/cE1uL6LjPmET
ovWzk16MvUF8GB7souPQVwN994GPp0Z+f7cfcrC9oQKBgQD8Fj9ft3Dkb70xqBDs
lkzmzcWzPLaImPHAHrLprgb14JV50pnbFDIyUEsGYpkakaXdwgVzBjPcOyoILTMa
HuVQl81RQNHURagGXB+yPwZbo0/Sxcv78q6TC6vYtNkDB07/zZKLyGjmw5xEyqKb
my6WWTVXxK0uzSi5gDVK7apj9wKBgQD7eHDl8z8ofImA2hNBuNNNfLXQ1e4/GFv8
UgexAfDRwHUPJxGu6HFvmLl5PRo9HOQKnvmiJlkhcyQxuN+HFnlJZYcKfyhqQC3E
2aUsm29bHC5kZxYTMn/a+8I/ipcb8CumAe/Ah7xJ5seWCkf7jWifKGDZ/rjqJv8d
iRndVYfOuQKBgCwSr63KYqBtsMQ3wA29EWDg5Qm7OaaUJuAR/fHBDVJ7m2abHW8i
DsyhIRzSrDXq9Pbabx13HiYI6gZX8LFGaY03nRvxmz3jl8bU4G3HexMWcGRHVKyN
91uaFMdkhvRymKs8g7yQo1aFKJMWYmuWLAT5P8xChIzELbSQ58Bb4QhtAoGBAMF6
Firl7ycAQm8P2hcL1A9fLyghILAM1uEYX/CRVK6dC7N/1Lwk/PnmoHUmTOTOMKn3
TIu0Q4lX5HYZDmoKIYEWC0NJOFgfTteQuOPMJ24LDaqUIcjdZr+eSgLHZ6HINF0C
SmtwQ678T30iJeXmE6O41mOC9tS48jnQPUUsxFOJAoGAXdnfv0AdOamAl/p7A+ne
c6Pe0AJYDfMybJ0FFcnIadidfMjZErszAFEaF0zwqa+P0K98OVIOLC+6AJT6DGui
d4L8iZQXs0+akvYdqQXoKOxvhZX9mdRheai+eLswIMgj4sHOIZb4kt4YNTBl9TMY
pd3aF5MKOkPQ2ZBYvro8c60=
-----END PRIVATE KEY-----`;

async function checkCurrentState() {
  try {
    console.log('🔍 Checking current Google Sheets state...');
    console.log('📊 SPREADSHEET_ID:', process.env.GOOGLE_SHEETS_SPREADSHEET_ID ? '✅ Configured' : '❌ Missing');
    console.log('📧 SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Configured' : '❌ Missing');
    console.log('🔑 PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✅ Configured' : '❌ Missing');
    
    // Initialize Google Sheets
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets initialized');
    
    // Check current Vehicle_Service_Prices data
    console.log('\n📊 Current Vehicle_Service_Prices data:');
    const currentPrices = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    console.log(`Found ${currentPrices.length - 1} price entries`);
    
    if (currentPrices.length > 1) {
      console.log('Headers:', currentPrices[0]);
      console.log('Last 5 price entries:', currentPrices.slice(-5));
    }
    
    // Check current Vehicle_Services data
    console.log('\n📋 Current Vehicle_Services data:');
    const currentServices = await GoogleSheetsService.getData('Vehicle_Services');
    console.log(`Found ${currentServices.length - 1} services`);
    
    if (currentServices.length > 1) {
      console.log('Headers:', currentServices[0]);
      console.log('Last 3 services:', currentServices.slice(-3));
    }
    
    // Find the most recent service
    const lastService = currentServices[currentServices.length - 1];
    if (lastService) {
      console.log('\n🔍 Checking prices for most recent service:', lastService[0]);
      const servicePrices = currentPrices.filter(row => row[1] === lastService[0]);
      console.log(`Found ${servicePrices.length} prices for this service`);
      if (servicePrices.length > 0) {
        console.log('Service prices:', servicePrices);
      } else {
        console.log('❌ No prices found for this service in Google Sheets!');
      }
    }
    
    console.log('\n✅ Check completed!');
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

checkCurrentState();