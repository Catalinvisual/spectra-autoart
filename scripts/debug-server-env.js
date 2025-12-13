#!/usr/bin/env node

/**
 * Server Environment Debug Script
 * Verifică încărcarea fișierului .env și variabilele Google Sheets
 */

const path = require('path');
const fs = require('fs');

console.log('🔍 Server Environment Debug');
console.log('============================');
console.log('');

// Verificăm locația fișierului .env
const possibleEnvPaths = [
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), 'server', '.env'),
  path.join(__dirname, '..', '.env'),
  path.join(__dirname, '..', '..', '.env'),
];

console.log('📁 Căutăm fișierul .env în următoarele locații:');
let envFileFound = null;

possibleEnvPaths.forEach(envPath => {
  try {
    if (fs.existsSync(envPath)) {
      console.log(`✅ Găsit: ${envPath}`);
      envFileFound = envPath;
      
      // Afișăm conținutul fișierului .env (fără valori sensibile)
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      
      console.log('📄 Variabile din fișierul .env:');
      lines.forEach(line => {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');
        
        if (key.includes('KEY') || key.includes('PASSWORD') || key.includes('SECRET')) {
          console.log(`   ${key}: ${value ? '[SET - ' + value.length + ' chars]' : '[EMPTY]'}`);
        } else {
          console.log(`   ${key}: ${value || '[EMPTY]'}`);
        }
      });
    } else {
      console.log(`❌ Nu există: ${envPath}`);
    }
  } catch (error) {
    console.log(`❌ Eroare la citirea ${envPath}: ${error.message}`);
  }
});

console.log('');
console.log('🌍 Variabile de mediu încărcate în proces:');
console.log('==========================================');

// Verificăm variabilele Google Sheets
const googleVars = [
  'GOOGLE_SHEETS_SPREADSHEET_ID',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY'
];

let googleVarsFound = 0;
googleVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    googleVarsFound++;
    if (varName.includes('KEY')) {
      console.log(`✅ ${varName}: [SET - ${value.length} chars]`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('');
console.log('📊 Rezumat:');
console.log(`   Fișier .env găsit: ${envFileFound ? 'DA' : 'NU'}`);
console.log(`   Variabile Google Sheets încărcate: ${googleVarsFound}/3`);

if (googleVarsFound === 3) {
  console.log('🎉 Toate variabilele Google Sheets sunt încărcate!');
} else if (envFileFound && googleVarsFound === 0) {
  console.log('⚠️  Fișierul .env există dar variabilele nu sunt încărcate!');
  console.log('🔧 Problema: dotenv nu încarcă fișierul din locația corectă');
} else if (!envFileFound) {
  console.log('❌ Nu s-a găsit fișierul .env în nicio locație așteptată');
}

console.log('');
console.log('🔧 Informații debug:');
console.log(`   process.cwd(): ${process.cwd()}`);
console.log(`   __dirname: ${__dirname}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);
console.log(`   PORT: ${process.env.PORT || 'NOT SET'}`);

// Verificăm dacă rulează în Railway
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_SERVICE_ID;
console.log(`   Railway Environment: ${isRailway ? 'DA' : 'NU'}`);

console.log('');
console.log('💡 Soluții posibile:');
console.log('====================');

if (envFileFound && googleVarsFound === 0) {
  console.log('1. Configurare dotenv cu calea absolută:');
  console.log(`   require('dotenv').config({ path: '${envFileFound}' })`);
  console.log('');
  console.log('2. Sau mutați fișierul .env în directorul de lucru curent:');
  console.log(`   cp ${envFileFound} ${path.join(process.cwd(), '.env')}`);
} else if (!envFileFound && !isRailway) {
  console.log('1. Creați fișierul .env în directorul server:');
  console.log('   server/.env');
  console.log('');
  console.log('2. Asigurați-vă că serverul pornește din directorul server');
}

if (isRailway) {
  console.log('ℹ️  În Railway, variabilele trebuie setate în dashboard, nu în fișier .env');
  console.log('   Comandă: railway variables set NUME_VARIABILA="valoare"');
}

console.log('');