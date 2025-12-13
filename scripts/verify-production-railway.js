#!/usr/bin/env node

/**
 * Production Railway Environment Verification Script
 * Run this in your Railway deployment to verify Google Sheets configuration
 */

console.log('🏭 Production Railway Environment Verification');
console.log('=============================================');
console.log('');

// Force Railway environment check
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_SERVICE_ID || process.env.RAILWAY_PROJECT_ID;

if (!isRailway) {
  console.log('⚠️  WARNING: This does not appear to be a Railway environment!');
  console.log('   Railway environment variables will not be available locally.');
  console.log('');
  console.log('🔧 To test in Railway, run:');
  console.log('   railway run node scripts/verify-production-railway.js');
  console.log('');
  console.log('   Or check your Railway deployment logs at:');
  console.log('   https://railway.app/project/YOUR_PROJECT_ID/logs');
  console.log('');
  process.exit(1);
}

console.log('✅ Confirmed Railway Environment');
console.log('');

// Detailed Railway environment info
console.log('🚂 Railway Environment Details:');
console.log('===============================');
console.log(`   RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT || 'NOT SET'}`);
console.log(`   RAILWAY_SERVICE_ID: ${process.env.RAILWAY_SERVICE_ID || 'NOT SET'}`);
console.log(`   RAILWAY_PROJECT_ID: ${process.env.RAILWAY_PROJECT_ID || 'NOT SET'}`);
console.log(`   RAILWAY_ENVIRONMENT_NAME: ${process.env.RAILWAY_ENVIRONMENT_NAME || 'NOT SET'}`);
console.log(`   RAILWAY_SERVICE_NAME: ${process.env.RAILWAY_SERVICE_NAME || 'NOT SET'}`);
console.log(`   RAILWAY_PROJECT_NAME: ${process.env.RAILWAY_PROJECT_NAME || 'NOT SET'}`);
console.log(`   PORT: ${process.env.PORT || 'NOT SET'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);
console.log('');

// Google Sheets verification
console.log('📊 Google Sheets Configuration:');
console.log('===============================');

const requiredVars = [
  'GOOGLE_SHEETS_SPREADSHEET_ID',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY'
];

let allVarsPresent = true;
let configIssues = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName === 'GOOGLE_PRIVATE_KEY') {
      // Validate private key format
      const isValidFormat = value.includes('-----BEGIN PRIVATE KEY-----') && value.includes('-----END PRIVATE KEY-----');
      if (isValidFormat) {
        console.log(`✅ ${varName}: Valid format (length: ${value.length})`);
      } else {
        console.log(`❌ ${varName}: Invalid format - missing BEGIN/END markers`);
        configIssues.push(`${varName} has invalid format`);
        allVarsPresent = false;
      }
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allVarsPresent = false;
  }
});

console.log('');

if (allVarsPresent) {
  console.log('🎉 SUCCESS: All Google Sheets variables are configured!');
  console.log('');
  console.log('🔧 Next steps to verify Google Sheets connection:');
  console.log('1. Check server startup logs for Google Sheets initialization');
  console.log('2. Test the /api/vehicles endpoint to see if real data is returned');
  console.log('3. Monitor Railway logs for any Google Sheets API errors');
  console.log('');
  console.log('📋 Expected behavior:');
  console.log('- Server logs should show: "✅ Google Sheets service initialized successfully"');
  console.log('- Vehicle data should come from your Google Sheet, not demo data');
  console.log('- No "⚠️  Google Sheets not configured - using demo data" message');
} else {
  console.log('❌ ISSUE: Missing Google Sheets configuration');
  console.log('');
  console.log('🔧 To fix this issue:');
  console.log('');
  console.log('1. Set the missing variables in Railway:');
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      console.log(`   railway variables set ${varName}="your_value_here"`);
    }
  });
  console.log('');
  console.log('2. Redeploy your application:');
  console.log('   railway up');
  console.log('');
  console.log('3. Verify the fix by checking logs again');
  console.log('');
  
  if (configIssues.length > 0) {
    console.log('⚠️  Configuration issues found:');
    configIssues.forEach(issue => {
      console.log(`   - ${issue}`);
    });
    console.log('');
  }
}

// Test Google Sheets connectivity (if configured)
if (allVarsPresent) {
  console.log('');
  console.log('🧪 Testing Google Sheets Connectivity:');
  console.log('====================================');
  
  try {
    // Import and test the service
    const { GoogleSpreadsheet } = require('google-spreadsheet');
    const { JWT } = require('google-auth-library');
    
    // Clean private key
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID, serviceAccountAuth);
    
    console.log('✅ Google Sheets client created successfully');
    console.log('📊 Attempting to load spreadsheet info...');
    
    // Test loading spreadsheet info
    doc.loadInfo().then(() => {
      console.log(`🎉 SUCCESS! Spreadsheet loaded: ${doc.title}`);
      console.log(`📋 Found ${doc.sheetCount} sheets`);
      
      // List available sheets
      for (let i = 0; i < doc.sheetCount; i++) {
        const sheet = doc.sheets[i];
        console.log(`   - ${sheet.title} (${sheet.rowCount} rows)`);
      }
      
      console.log('');
      console.log('✅ Google Sheets is working correctly!');
      console.log('   Your production app should now use real data from Google Sheets.');
      
    }).catch(error => {
      console.log(`❌ Error loading spreadsheet: ${error.message}`);
      console.log('');
      console.log('🔧 Troubleshooting steps:');
      console.log('1. Verify the service account has access to the spreadsheet');
      console.log('2. Check if the spreadsheet ID is correct');
      console.log('3. Ensure the service account email is added as an editor to the sheet');
      console.log('4. Check Google Sheets API is enabled in Google Cloud Console');
    });
    
  } catch (error) {
    console.log(`❌ Error creating Google Sheets client: ${error.message}`);
    console.log('   This might be a dependency issue or invalid credentials.');
  }
}

console.log('');
console.log('🔍 For more detailed logs, check your Railway deployment:');
console.log('   railway logs');
console.log('');