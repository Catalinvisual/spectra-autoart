#!/usr/bin/env node

/**
 * Diagnostic script to check Google Sheets configuration
 * Run: node scripts/diagnose-google-sheets.js
 */

require('dotenv').config({ path: ['.env.production', '.env'] });

console.log('🔍 Google Sheets Configuration Diagnostic');
console.log('=======================================');

// Check environment variables
const requiredVars = [
  'GOOGLE_SHEETS_SPREADSHEET_ID',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY'
];

console.log('\n📋 Environment Variables Status:');
console.log('================================');

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName.includes('KEY')) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}... (length: ${value.length})`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

// Check if we're in demo mode
console.log('\n🔧 Service Status:');
console.log('==================');

const GoogleSheetsService = require('./server/src/services/googleSheetsService.js');
const service = new GoogleSheetsService();

console.log(`Demo Mode: ${service.isDemoMode}`);
console.log(`Initialized: ${service.isInitialized}`);

// Test initialization
async function testInitialization() {
  console.log('\n🧪 Testing Initialization...');
  try {
    await service.initialize();
    console.log('✅ Service initialized successfully');
    
    // Try to load some data
    console.log('\n📊 Testing Data Loading...');
    const makes = await service.getVehicleMakes();
    console.log(`Vehicle Makes: ${makes.length} found`);
    
    const services = await service.getServices();
    console.log(`Services: ${services.length} found`);
    
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
  }
}

testInitialization();