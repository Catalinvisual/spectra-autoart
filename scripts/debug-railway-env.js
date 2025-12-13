#!/usr/bin/env node

/**
 * Railway Environment Variables Debug Script
 * This script helps debug why Railway env vars aren't being loaded
 */

console.log('🚂 Railway Environment Debug');
console.log('============================');

// Check all environment variables
console.log('\n📋 ALL Environment Variables:');
console.log('==============================');
const envVars = Object.keys(process.env).sort();
envVars.forEach(key => {
  if (key.includes('GOOGLE') || key.includes('RAILWAY') || key.includes('NODE')) {
    let value = process.env[key];
    if (key.includes('KEY') || key.includes('SECRET')) {
      value = value ? `${value.substring(0, 10)}... (${value.length} chars)` : 'NOT SET';
    }
    console.log(`${key}: ${value}`);
  }
});

// Check specifically for Google Sheets vars
console.log('\n🔍 Google Sheets Variables:');
console.log('============================');
const googleVars = ['GOOGLE_SHEETS_SPREADSHEET_ID', 'GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY'];
googleVars.forEach(varName => {
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

// Check Railway-specific variables
console.log('\n🚂 Railway Variables:');
console.log('====================');
const railwayVars = ['RAILWAY_ENVIRONMENT', 'RAILWAY_SERVICE_ID', 'RAILWAY_PROJECT_ID'];
railwayVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value || 'NOT SET'}`);
});

console.log('\n💡 DIAGNOSTIC RESULTS:');
console.log('======================');

const hasGoogleSheetsVars = googleVars.every(varName => process.env[varName]);

if (hasGoogleSheetsVars) {
  console.log('✅ All Google Sheets variables are present!');
  console.log('🔧 The issue might be in the initialization logic.');
} else {
  console.log('❌ Missing Google Sheets environment variables.');
  console.log('🔧 Make sure to set them in Railway dashboard or CLI.');
}

console.log('\n📝 NEXT STEPS:');
console.log('===============');
if (!hasGoogleSheetsVars) {
  console.log('1. Set variables in Railway:');
  console.log('   railway variables set GOOGLE_SHEETS_SPREADSHEET_ID="your_id"');
  console.log('   railway variables set GOOGLE_SERVICE_ACCOUNT_EMAIL="your_email"');
  console.log('   railway variables set GOOGLE_PRIVATE_KEY="your_key"');
  console.log('');
  console.log('2. Redeploy:');
  console.log('   railway up');
} else {
  console.log('1. Check if Railway is properly linked to your project');
  console.log('2. Verify variables are set in the correct Railway environment');
  console.log('3. Check if the app needs to be restarted after setting variables');
}