#!/usr/bin/env node

/**
 * Deploy and Verify Script
 * This script helps deploy to Railway and verify Google Sheets configuration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Spectra AutoArt - Deploy and Verify');
console.log('=======================================');
console.log('');

// Check if railway CLI is available
function checkRailwayCLI() {
  try {
    execSync('railway --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Get current Git status
function getGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim();
  } catch (error) {
    return null;
  }
}

// Main deployment function
async function deployAndVerify() {
  const hasRailwayCLI = checkRailwayCLI();
  
  if (!hasRailwayCLI) {
    console.log('❌ Railway CLI not found.');
    console.log('');
    console.log('🔧 To install Railway CLI:');
    console.log('   npm install -g @railway/cli');
    console.log('   # or');
    console.log('   curl -fsSL https://railway.app/install.sh | sh');
    console.log('');
    console.log('🌐 Alternatively, deploy via Railway dashboard:');
    console.log('   1. Go to https://railway.app');
    console.log('   2. Select your project');
    console.log('   3. Click "Deploy" or connect your GitHub repo');
    console.log('');
    return;
  }
  
  console.log('✅ Railway CLI found');
  console.log('');
  
  // Check Git status
  const gitStatus = getGitStatus();
  if (gitStatus) {
    console.log('📁 Uncommitted changes found:');
    console.log(gitStatus);
    console.log('');
    console.log('💡 Consider committing changes before deployment:');
    console.log('   git add .');
    console.log('   git commit -m "Fix Google Sheets configuration"');
    console.log('   git push origin main');
    console.log('');
  } else {
    console.log('✅ No uncommitted changes');
  }
  
  // Check current Railway variables
  console.log('🔍 Checking current Railway configuration...');
  console.log('');
  
  try {
    const varsOutput = execSync('railway variables', { encoding: 'utf8' });
    console.log('📊 Current Railway variables:');
    console.log(varsOutput);
  } catch (error) {
    console.log('❌ Could not fetch Railway variables');
    console.log('   Make sure you are logged in and have selected a project');
    console.log('');
    console.log('🔧 To login and select project:');
    console.log('   railway login');
    console.log('   railway init');
    console.log('   # or select existing project:');
    console.log('   railway link');
    console.log('');
  }
  
  // Deployment options
  console.log('🚀 Deployment Options:');
  console.log('====================');
  console.log('');
  console.log('1. Deploy current code to Railway:');
  console.log('   railway up');
  console.log('');
  console.log('2. Set Google Sheets variables (if not set):');
  console.log('   railway variables set GOOGLE_SHEETS_SPREADSHEET_ID="1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90"');
  console.log('   railway variables set GOOGLE_SERVICE_ACCOUNT_EMAIL="spectra-autoart@spectra-autoart.iam.gserviceaccount.com"');
  console.log('   railway variables set GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqHRdowGztApz3\\n3TbsjDZTPuXBi6YM4a9KH2EfMlmp2Ny58fGnmOIqEi9PzLbRYH5K/k+y09bzJzyz\\nbK3CR/qjhU7oNfxqCmzlanJC/n5+UwNrdbVPxnBaXgbJT6N5gOPiKB0auYzgE9AG\\n8zh7PqvGpu3oynfvnpz5I/x55CnhsAOkRsN8JGnO6XxAC9Vb2AK7dx7uiWvSU8Gc\\nbzIs+j4M1DOLQ9Kh273gmUUC26oQolxcq4nuPQXTsukH81V/HDKHZGPkQ/Qm+OZh\\nzVK9nua161mrAusq4CZMdtWhoZ3rQyPIfWaNW7MC+eTRFW65M6A/0qAYCh8uX0s1\\n7nU29bIxAgMBAAECggEAJAaLKZTuvHa8NUW01v2Ol6yPTaC8Zqf4zlK857VrBaw2\\nem6BhcO7ybsWJ+krokW0GT+oMy/nqpDZqwnN9oH102Fs54JfVTml/CPB1Ow+b5Q2\\n+i/wWNemfYzCFSn3bcjc+c0S9NDsw5uOh5pEkN0h1a0OXylZovZNOfnkAxBNykx6\\ng1Lhaim3qG7YmxNy/Z3xdwTBAuixvMOmAYmeXeIM3XJKCVuHsIir91fcIU59iqJL\\nl209OIe6FVhDj7OIAuouxlqX/eZwu4fizz5ch0k7QQNuiWq7e2/JfTylDaJ/cKRa\\n3bnD4WtAxbondEww1GF/FPzBmcs5XqF09VRhYv1TkQKBgQDlCfUf6DnX18Rp7+LM\\nKQClpPpGAVHN4wIbRD1QHvtVighTuKuk38cUsLEBZt/3BYsRLWHoFHLux0c61LDw\\nNPcBoY/i6ciwu3l5Jh4OO4KUFf6kBwQl8IhxUJocNPeSMgIX+Q9QxceQ6mAvrH8S\\n6wmpYA7PGJPLlZxAEuT3dg/8vQKBgQC+I27JgAxm3/Mx92a70e6HebftNDyHpQiE\\n4bEZ0tDpJbgqfruAE9wZUJhjUDxtGNqkVc3fNBkGHVQSitqEmeq5xOrMMEcpoleY\\n7WHD7wiYTk+L/omSaI+nBTrYL5BU93kqUSlUMc08XMGswq/nHGI7XtFmTRUi2VKz\\np9E9IiU0hQKBgDG5W7I1pHkrqsSlA8P3EuDjVEJmfvAH3Kk2w2jlkQMdGHm0me8N\\ndhcT1RnMz8q9NVfhVmQgLGOSd/BZxKAhn46HGMnWn29fBBw9HkFQwiSMMeBCdbAW\\n7EhNi2ecSDNBEBtMQvryNUVM3Nz8wgnFZS+UXyKu30dPj8CJWZQv2YCxAoGBAJuX\\nKShwxTVF25+uwP2/G373BqBv13x0exUqDp+AGP5ApIT5sftrxPdeMWVLmjb4WKqT\\noGUfH78WLt8BizFpNmAQGMdAVmtmcmItFoycRR9FLej0QKVzNOJK8E1KFsTAwgDz\\n62r/WeAkU0RJCGKJooTM4XPibgJXbkqfcCSjlWh1AoGALcA1/2bnvIwht+HQEpzB\\nRBjb4DGwnixVfJ92s1CXuCWcJk3gKuqMHFTQwpp59dMHF+EjRc9mQZtSckaZ/xVW\\ndPF8S3Zf80RoPf9cWEMR7C0g1gDqCMft81K+xuIX/XijxOKjTF5o7d2M4RMLDGqZ\\nmlsTsXu9FiWXbhS3KsX0CT4=\\n-----END PRIVATE KEY-----"');
  console.log('');
  console.log('3. Deploy and verify:');
  console.log('   railway up');
  console.log('   railway run node scripts/verify-production-railway.js');
  console.log('');
  
  // Auto-deployment (if user confirms)
  console.log('🤖 Auto-Deployment Options:');
  console.log('==========================');
  console.log('');
  console.log('Would you like to:');
  console.log('1. Deploy now (railway up)');
  console.log('2. Set variables first, then deploy');
  console.log('3. Just verify current configuration');
  console.log('4. Exit and do it manually');
  console.log('');
  
  // Note: In a real interactive script, we'd wait for user input here
  // For now, just provide the commands
  console.log('💡 To proceed manually, run these commands:');
  console.log('');
  if (missingVars.length > 0) {
    console.log('# Set missing variables:');
    missingVars.forEach(varName => {
      console.log(`railway variables set ${varName}="your_value_here"`);
    });
    console.log('');
  }
  console.log('# Deploy to Railway:');
  console.log('railway up');
  console.log('');
  console.log('# Verify deployment:');
  console.log('railway logs');
  console.log('railway run node scripts/verify-production-railway.js');
  console.log('');
}

// Run the deployment helper
deployAndVerify().catch(error => {
  console.error('❌ Error during deployment:', error.message);
  process.exit(1);
});