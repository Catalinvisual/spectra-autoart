#!/usr/bin/env node

/**
 * Railway Production Environment Debug Script
 * This script helps diagnose environment variable loading issues in Railway production
 */

console.log('🚂 Railway Production Environment Debug');
console.log('=====================================');
console.log('');

// Check if we're in a Railway environment
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_SERVICE_ID || process.env.RAILWAY_PROJECT_ID;
console.log('🌍 Environment Detection:');
console.log(`   RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT || 'NOT SET'}`);
console.log(`   RAILWAY_SERVICE_ID: ${process.env.RAILWAY_SERVICE_ID || 'NOT SET'}`);
console.log(`   RAILWAY_PROJECT_ID: ${process.env.RAILWAY_PROJECT_ID || 'NOT SET'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);
console.log(`   Is Railway Environment: ${!!isRailway}`);
console.log('');

// Check Google Sheets variables
console.log('📊 Google Sheets Variables:');
console.log('============================');

const googleVars = [
  'GOOGLE_SHEETS_SPREADSHEET_ID',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL', 
  'GOOGLE_PRIVATE_KEY'
];

let missingVars = [];
let presentVars = [];

googleVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    presentVars.push(varName);
    if (varName.includes('KEY')) {
      console.log(`✅ ${varName}: ${value.substring(0, 30)}... (length: ${value.length})`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    missingVars.push(varName);
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('');
console.log('📋 Summary:');
console.log(`   Present: ${presentVars.length} (${presentVars.join(', ') || 'none'})`);
console.log(`   Missing: ${missingVars.length} (${missingVars.join(', ') || 'none'})`);

// Simulate the Google Sheets service initialization logic
console.log('');
console.log('🔍 Simulating GoogleSheetsService.initialize() logic:');
console.log('=====================================================');

const hasSpreadsheetId = !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const hasServiceAccount = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY;

console.log(`   Has SPREADSHEET_ID: ${hasSpreadsheetId}`);
console.log(`   Has SERVICE_ACCOUNT_EMAIL: ${hasServiceAccount}`);
console.log(`   Has PRIVATE_KEY: ${hasPrivateKey}`);

const wouldInitialize = hasSpreadsheetId && hasServiceAccount && hasPrivateKey;
console.log(`   Would initialize Google Sheets: ${wouldInitialize}`);
console.log(`   Would use demo mode: ${!wouldInitialize}`);

// Check for common Railway issues
console.log('');
console.log('⚠️  Common Railway Issues Check:');
console.log('===============================');

// Check if dotenv is being used (it shouldn't be needed in Railway)
const dotenvFiles = ['.env', '.env.local', '.env.production'];
const fs = require('fs');
const path = require('path');

dotenvFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  try {
    if (fs.existsSync(filePath)) {
      console.log(`⚠️  Found ${file} - this might interfere with Railway vars`);
    } else {
      console.log(`✅ No ${file} file found`);
    }
  } catch (err) {
    console.log(`❌ Error checking for ${file}: ${err.message}`);
  }
});

// Check Railway-specific environment
console.log('');
console.log('🚂 Railway-Specific Checks:');
console.log('===========================');

const railwayVars = [
  'RAILWAY_STATIC_URL',
  'RAILWAY_ENVIRONMENT_NAME',
  'RAILWAY_SERVICE_NAME',
  'RAILWAY_PROJECT_NAME',
  'PORT'
];

railwayVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

// Recommendations
console.log('');
console.log('💡 Recommendations:');
console.log('====================');

if (missingVars.length > 0) {
  console.log('1. Set missing environment variables in Railway:');
  missingVars.forEach(varName => {
    console.log(`   railway variables set ${varName}="your_value_here"`);
  });
  console.log('');
  console.log('2. Redeploy your application:');
  console.log('   railway up');
} else {
  console.log('✅ All Google Sheets variables are set!');
}

if (!isRailway) {
  console.log('');
  console.log('⚠️  This does not appear to be a Railway environment.');
  console.log('   If running locally, Railway env vars will not be available.');
  console.log('   Test in Railway deployment or use Railway CLI:');
  console.log('   railway run node scripts/railway-production-debug.js');
}

console.log('');
console.log('🔧 For more detailed logs, check your Railway deployment logs:');
console.log('   railway logs');
console.log('');