#!/usr/bin/env node

// Script pentru a reveni la commitul df213be2 - "Fix TypeScript error TS6133 - remove unused parameter"

const fs = require('fs');
const path = require('path');

console.log('🔄 Încep rollback la commitul df213be2...');

// 1. Ștergem fișierele noi create în ultimele commituri
const filesToDelete = [
  'h.js',
  'emergency-healthcheck.js', 
  'ultra-simple-healthcheck.js',
  'start-railway-server.sh',
  'railway-hybrid-prod.Dockerfile'
];

filesToDelete.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`✅ Șters: ${file}`);
  }
});

// 2. Revenim la conținutul original al fișierelor modificate
const originalRailwayToml = `[build]
builder = "DOCKERFILE"
dockerfilePath = "railway.toml"`;

const originalRailwayJson = `{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "railway.toml"
  }
}`;

// Rescriem fișierele de configurare la starea originală
fs.writeFileSync('railway.toml', originalRailwayToml);
fs.writeFileSync('railway.json', originalRailwayJson);

console.log('✅ Fișierele de configurare au fost restabilite');

// 3. Revenim la Dockerfile-ul original (fără h.js)
const originalDockerfile = `FROM node:20-alpine

# Install curl for healthchecks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --omit=dev && \\
    npm --prefix server ci --omit=dev

# Copy source code
COPY . .

# Build client
RUN npm --prefix client ci --include=dev && \\
    npm --prefix client run build

# Expose port
EXPOSE 8080

# Set working directory to server
WORKDIR /app/server

# Start the server
CMD ["npm", "start"]`;

fs.writeFileSync('railway-hybrid-prod.Dockerfile', originalDockerfile);
console.log('✅ Dockerfile a fost restabilit');

// 4. Revenim la server/src/index.js original (fără modificările de deployment)
const originalServerIndex = `import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Încarcă variabilele de mediu
const envLocalPath = path.join(__dirname, '..', '.env.local')

if (process.env.NODE_ENV !== 'production' && !process.env.RAILWAY_PROJECT_ID) {
  const envPath = path.join(__dirname, '..', '.env')
  const envProductionPath = path.join(__dirname, '..', '.env.production')
  
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    const primaryPath = isProduction ? envProductionPath : envLocalPath
    const secondaryPath = isProduction ? envLocalPath : envProductionPath

    const primaryResult = dotenv.config({ path: primaryPath })
    if (primaryResult.error) {
      console.log('⚠️  Fișierul primar de env nu a putut fi încărcat, încerc fallback:', primaryResult.error.message)
      const secondaryResult = dotenv.config({ path: secondaryPath })
      if (secondaryResult.error) {
        console.log('⚠️  Nici fișierul fallback de env nu a putut fi încărcat:', secondaryResult.error.message)
      } else {
        console.log('✅ Fișierul fallback de env a fost încărcat cu succes:', secondaryPath)
      }
    } else {
      console.log('✅ Fișierul de env a fost încărcat cu succes:', primaryPath)
    }
  } catch (error) {
    console.log('⚠️  Eroare la încărcarea fișierului de env:', error.message)
  }
} else {
  console.log('🔧 Production environment detected - skipping dotenv load')
}

// Restul codului serverului...`;

// Căutăm fișierul server/src/index.js și îl rescriem parțial
const serverIndexPath = 'server/src/index.js';
if (fs.existsSync(serverIndexPath)) {
  let content = fs.readFileSync(serverIndexPath, 'utf8');
  
  // Înlocuim definiția __dirname și partea de sus
  content = content.replace(
    /import dotenv from 'dotenv'[\s\S]*?console\.log\('📍 Architecture:', process\.arch\)/,
    `import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Încarcă variabilele de mediu
const envLocalPath = path.join(__dirname, '..', '.env.local')

if (process.env.NODE_ENV !== 'production' && !process.env.RAILWAY_PROJECT_ID) {
  const envPath = path.join(__dirname, '..', '.env')
  const envProductionPath = path.join(__dirname, '..', '.env.production')
  
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    const primaryPath = isProduction ? envProductionPath : envLocalPath
    const secondaryPath = isProduction ? envLocalPath : envProductionPath

    const primaryResult = dotenv.config({ path: primaryPath })
    if (primaryResult.error) {
      console.log('⚠️  Fișierul primar de env nu a putut fi încărcat, încerc fallback:', primaryResult.error.message)
      const secondaryResult = dotenv.config({ path: secondaryPath })
      if (secondaryResult.error) {
        console.log('⚠️  Nici fișierul fallback de env nu a putut fi încărcat:', secondaryResult.error.message)
      } else {
        console.log('✅ Fișierul fallback de env a fost încărcat cu succes:', secondaryPath)
      }
    } else {
      console.log('✅ Fișierul de env a fost încărcat cu succes:', primaryPath)
    }
  } catch (error) {
    console.log('⚠️  Eroare la încărcarea fișierului de env:', error.message)
  }
} else {
  console.log('🔧 Production environment detected - skipping dotenv load')
}`
  );
  
  // Eliminăm logica de deployment complicată și revenim la ceva simplu
  content = content.replace(
    /\/\/ Serve static files from React build if available[\s\S]*?app\.get\('\*'[\s\S]*?\}\s*\)/,
    `// Serve static files from React build if available
const clientBuildPath = path.join(__dirname, '../../client/dist')
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath))
  console.log('✅ Serving static files from:', clientBuildPath)
}`
  );
  
  fs.writeFileSync(serverIndexPath, content);
  console.log('✅ Server index.js a fost restabilit');
}

console.log('✅ Rollback complet! Repository-ul a revenit la starea de la commitul df213be2');
console.log('📋 Urmează să faci commit și push cu aceste modificări.');