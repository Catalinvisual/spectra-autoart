import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: join(__dirname, 'server/.env') });

const API_BASE_URL = 'http://localhost:8080/api';

// JWT token for authentication (you'll need to generate this)
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWQiOjEsImlhdCI6MTc2NTA0MTA0NSwiZXhwIjoxNzY1MTI3NDQ1fQ.AyQ9YLEaLIV1eHogkgQg1yHbr9hlHf0IJVDG0JPu6Xc';

async function testCreateServiceWithTranslation() {
  try {
    console.log('🧪 Testing /create-with-translation endpoint...');
    
    const serviceData = {
      name: 'Test Service Sheets Sync',
      description: 'Testing Google Sheets sync for prices',
      category: 'Testing',
      prices: {
        sedan: 11,
        suv: 22,
        hatchback: 33,
        cabrio: 44,
        coupe: 55,
        wagon: 66,
        van: 77,
        break: 88
      }
    };

    console.log('📤 Sending request with data:', JSON.stringify(serviceData, null, 2));

    const response = await axios.post(
      `${API_BASE_URL}/admin/services/create-with-translation`,
      serviceData,
      {
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 seconds timeout
      }
    );

    console.log('✅ Response status:', response.status);
    console.log('📊 Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.serviceId) {
      console.log(`🎉 Service created successfully with ID: ${response.data.serviceId}`);
      console.log('⏳ Waiting 5 seconds before checking Google Sheets...');
      
      // Wait a bit for any async operations to complete
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Now check if the prices were synced to Google Sheets
      await checkGoogleSheetsForService(response.data.serviceId);
    }

  } catch (error) {
    console.error('❌ Error creating service:', error.message);
    if (error.response) {
      console.error('📊 Error response:', error.response.data);
      console.error('📊 Error status:', error.response.status);
    }
  }
}

async function checkGoogleSheetsForService(serviceId) {
  try {
    console.log(`🔍 Checking Google Sheets for service ID: ${serviceId}...`);
    
    // Dynamic import to avoid loading issues
    const { default: GoogleSheetsService } = await import('./server/src/services/googleSheetsService.js');
    
    if (!GoogleSheetsService.isInitialized || GoogleSheetsService.isDemoMode) {
      console.log('⚠️  Google Sheets service is not available or in demo mode');
      return;
    }

    const doc = GoogleSheetsService.doc;
    const pricesSheet = doc.sheetsByTitle['Vehicle_Service_Prices'];
    
    if (!pricesSheet) {
      console.log('❌ Vehicle_Service_Prices sheet not found');
      return;
    }

    console.log('✅ Vehicle_Service_Prices sheet found');
    
    // Get all rows for this service
    const allRows = await pricesSheet.getRows();
    const serviceRows = allRows.filter(row => {
      const rowServiceId = row.get('Service_ID');
      return rowServiceId && rowServiceId.toString() === serviceId.toString();
    });

    console.log(`📊 Found ${serviceRows.length} price entries for service ${serviceId}:`);
    serviceRows.forEach(row => {
      console.log(`  - Body Type: ${row.get('Body_Type_Key')}, Price: ${row.get('Price_Min')} ${row.get('Currency')}`);
    });

  } catch (error) {
    console.error('❌ Error checking Google Sheets:', error.message);
  }
}

// Run the test
testCreateServiceWithTranslation();