import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve('./server/.env.local');
dotenv.config({ path: envPath });

import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function testInitialization() {
  console.log('Testing Google Sheets service initialization...');
  
  try {
    const result = await GoogleSheetsService.initialize();
    console.log('Initialization result:', result);
    console.log('Service initialized:', GoogleSheetsService.isInitialized);
    
    if (GoogleSheetsService.isInitialized) {
      console.log('✅ Service initialized successfully');
    } else {
      console.log('❌ Service failed to initialize');
    }
  } catch (error) {
    console.error('❌ Error during initialization:', error.message);
    console.error('Stack:', error.stack);
  }
}

testInitialization();