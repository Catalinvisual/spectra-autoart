#!/usr/bin/env node

/**
 * Script to help set up Railway environment variables
 * Run: node scripts/setup-railway-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚂 Railway Environment Setup Helper');
console.log('=====================================');

// Check if railway CLI is available
const { execSync } = require('child_process');

try {
  execSync('railway --version', { stdio: 'ignore' });
  console.log('✅ Railway CLI detected');
} catch (error) {
  console.log('❌ Railway CLI not found. Please install it first:');
  console.log('   npm install -g @railway/cli');
  console.log('   railway login');
  process.exit(1);
}

// Read the complete environment template
const envTemplatePath = path.join(__dirname, '..', '.env.railway.complete');
if (!fs.existsSync(envTemplatePath)) {
  console.log('❌ Template file .env.railway.complete not found');
  process.exit(1);
}

const envTemplate = fs.readFileSync(envTemplatePath, 'utf8');

console.log('\n📋 Required Environment Variables for Railway:');
console.log('==============================================');

const requiredVars = [
  'GOOGLE_SHEETS_SPREADSHEET_ID',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL', 
  'GOOGLE_PRIVATE_KEY',
  'JWT_SECRET',
  'ADMIN_DEFAULT_EMAIL',
  'ADMIN_DEFAULT_PASSWORD'
];

requiredVars.forEach(varName => {
  const line = envTemplate.split('\n').find(line => line.startsWith(varName + '='));
  if (line) {
    const currentValue = line.split('=')[1];
    if (currentValue === 'your_' + varName.toLowerCase().replace(/_/g, '_') + '_here' || 
        currentValue === 'your_' + varName.toLowerCase().replace(/_/g, '') + '_here' ||
        currentValue.includes('your_')) {
      console.log(`❌ ${varName}: NOT CONFIGURED`);
    } else {
      console.log(`✅ ${varName}: CONFIGURED`);
    }
  }
});

console.log('\n🔧 Next Steps:');
console.log('1. Get your Google Sheets credentials:');
console.log('   - Go to https://console.cloud.google.com/');
console.log('   - Create a service account');
console.log('   - Enable Google Sheets API');
console.log('   - Generate private key');
console.log('   - Share your spreadsheet with the service account email');

console.log('\n2. Set up Railway variables:');
console.log('   railway variables set GOOGLE_SHEETS_SPREADSHEET_ID="your_spreadsheet_id"');
console.log('   railway variables set GOOGLE_SERVICE_ACCOUNT_EMAIL="your_service_account@project.iam.gserviceaccount.com"');
console.log('   railway variables set GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');
console.log('   railway variables set JWT_SECRET="your_random_secret_key"');
console.log('   railway variables set ADMIN_DEFAULT_EMAIL="your_admin_email"');
console.log('   railway variables set ADMIN_DEFAULT_PASSWORD="your_secure_password"');

console.log('\n3. Redeploy your application:');
console.log('   railway up');

console.log('\n📖 For detailed instructions, see:');
console.log('   https://github.com/Catalinvisual/spectra-autoart/blob/main/docs/GOOGLE_SHEETS_SETUP.md');