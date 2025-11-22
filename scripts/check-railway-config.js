#!/usr/bin/env node

/**
 * Script pentru verificarea configurației Railway
 * Acest script verifică dacă toate variabilele necesare sunt setate în Railway
 */

const requiredEnvVars = [
  'GOOGLE_SHEETS_SPREADSHEET_ID',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL', 
  'GOOGLE_PRIVATE_KEY',
  'RAILWAY_PROJECT_ID',
  'RAILWAY_ENVIRONMENT_ID'
];

const optionalEnvVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'CLIENT_ORIGIN'
];

console.log('🔍 Verificare configurație Railway...\n');

// Verificăm variabilele necesare
console.log('📋 Variabile necesare:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const displayValue = varName.includes('KEY') ? (value ? '🔑 [SET]' : '🔑 [MISSING]') : (value || '[MISSING]');
  console.log(`${status} ${varName}: ${displayValue}`);
});

console.log('\n📋 Variabile opționale:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '⚠️';
  const displayValue = varName.includes('PASSWORD') || varName.includes('TOKEN') || varName.includes('KEY') 
    ? (value ? '🔑 [SET]' : '🔑 [MISSING]') 
    : (value || '[MISSING]');
  console.log(`${status} ${varName}: ${displayValue}`);
});

// Verificăm formatul cheii private Google
const privateKey = process.env.GOOGLE_PRIVATE_KEY;
if (privateKey) {
  console.log('\n🔑 Verificare format cheie privată:');
  console.log(`Lungime cheie: ${privateKey.length} caractere`);
  
  if (privateKey.includes('-----BEGIN PRIVATE KEY-----') && privateKey.includes('-----END PRIVATE KEY-----')) {
    console.log('✅ Format cheie privată Google corect');
  } else if (privateKey.includes('BEGIN') && privateKey.includes('END')) {
    console.log('⚠️  Format cheie detectat dar poate fi incorect');
  } else {
    console.log('❌ Format cheie privată Google incorect');
    console.log('💡 Cheia trebuie să conțină "-----BEGIN PRIVATE KEY-----" și "-----END PRIVATE KEY-----"');
  }
  
  // Verificăm dacă conține caractere newline escaped
  if (privateKey.includes('\\n')) {
    console.log('⚠️  Cheia conține \\n - ar trebui să fie newline-uri reale în Railway');
  }
}

// Verificăm formatul email-ului de serviciu
const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
if (serviceEmail) {
  console.log('\n📧 Verificare email serviciu:');
  if (serviceEmail.endsWith('@spectra-autoart.iam.gserviceaccount.com')) {
    console.log('✅ Email serviciu Google corect');
  } else {
    console.log('⚠️  Email serviciu Google diferit de cel așteptat');
  }
}

// Verificăm formatul spreadsheet ID
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
if (spreadsheetId) {
  console.log('\n📊 Verificare Spreadsheet ID:');
  if (spreadsheetId.length === 44) {
    console.log('✅ Lungime Spreadsheet ID corectă');
  } else {
    console.log('⚠️  Lungime Spreadsheet ID diferită de cea standard');
  }
}

console.log('\n🎯 Recomandări pentru Railway:');
console.log('1. Adaugă toate variabilele necesare în Railway Dashboard');
console.log('2. Asigură-te că GOOGLE_PRIVATE_KEY conține newline-uri reale, nu \\n');
console.log('3. Verifică că toate variabilele sunt setate pentru environment-ul de producție');
console.log('4. Redeployează aplicația după adăugarea variabilelor');