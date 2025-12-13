#!/usr/bin/env node

/**
 * Script pentru testarea conexiunii Google Sheets în producție
 * Acest script verifică dacă Google Sheets API funcționează corect
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import { GoogleAuth } from 'google-auth-library'
import { google } from 'googleapis'

// Configurare dotenv pentru test
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.join(__dirname, '..', 'server', '.env')
dotenv.config({ path: envPath })

async function testGoogleSheetsConnection() {
  console.log('🧪 Testare conexiune Google Sheets pentru producție...\n')
  
  try {
    // Verificăm variabilele de mediu
    console.log('1️⃣ Verificare variabile de mediu:')
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    
    if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
      console.log('❌ Lipsesc variabile necesare:')
      console.log(`   SPREADSHEET_ID: ${spreadsheetId ? '✅' : '❌'}`)
      console.log(`   SERVICE_EMAIL: ${serviceAccountEmail ? '✅' : '❌'}`)
      console.log(`   PRIVATE_KEY: ${privateKey ? '✅' : '❌'}`)
      return
    }
    
    console.log('✅ Toate variabilele sunt setate')
    
    // Creăm auth client
    console.log('\n2️⃣ Creare Google Auth Client:')
    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey.replace(/\\n/g, '\n') // Înlocuim \n cu newline-uri reale
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })
    
    const sheets = google.sheets({ version: 'v4', auth })
    
    // Testăm accesul la spreadsheet
    console.log('\n3️⃣ Testare acces spreadsheet:')
    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId
    })
    
    console.log(`✅ Acces la spreadsheet reușit: ${response.data.properties.title}`)
    console.log(`📊 Sheet-uri disponibile: ${response.data.sheets.length}`)
    
    // Listăm toate sheet-urile
    response.data.sheets.forEach(sheet => {
      console.log(`   - ${sheet.properties.title} (${sheet.properties.gridProperties.rowCount} rânduri)`)
    })
    
    // Testăm citirea datelor dintr-un sheet specific
    console.log('\n4️⃣ Testare citire date:')
    const testRanges = ['Vehicles!A1:A5', 'Services!A1:A5', 'Bookings!A1:A5']
    
    for (const range of testRanges) {
      try {
        const dataResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: range
        })
        
        if (dataResponse.data.values && dataResponse.data.values.length > 0) {
          console.log(`✅ ${range}: ${dataResponse.data.values.length} rânduri citite`)
        } else {
          console.log(`⚠️  ${range}: Fără date`)
        }
      } catch (error) {
        console.log(`❌ ${range}: Eroare - ${error.message}`)
      }
    }
    
    console.log('\n🎉 Testare finalizată cu succes!')
    console.log('✅ Google Sheets API funcționează corect pentru producție')
    
  } catch (error) {
    console.log('\n❌ Eroare la testare:')
    console.log(`   Tip: ${error.code || error.name}`)
    console.log(`   Mesaj: ${error.message}`)
    
    if (error.code === 403) {
      console.log('\n💡 Sugestie: Verifică permisiunile service account-ului în Google Sheets')
      console.log('   Service account-ul trebuie să aibă acces la spreadsheet')
    } else if (error.code === 404) {
      console.log('\n💡 Sugestie: Verifică dacă Spreadsheet ID este corect')
    }
  }
}

// Rulează testul
testGoogleSheetsConnection().catch(console.error)