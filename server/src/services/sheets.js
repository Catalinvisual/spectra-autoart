import { google } from 'googleapis'

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

let auth
let sheets

function initAuth() {
  if (!email || !privateKey || !spreadsheetId) {
    console.warn('Google Sheets neconfigurat, folosesc date demo')
    return false
  }
  
  auth = new google.auth.JWT(
    email,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  )
  
  sheets = google.sheets({ version: 'v4', auth })
  return true
}

export async function getRange(range) {
  if (!initAuth()) {
    return getDemoData(range)
  }
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    })
    return response.data.values || []
  } catch (error) {
    console.error('Eroare Google Sheets getRange:', error.message)
    return getDemoData(range)
  }
}

export async function updateRange(range, values) {
  if (!initAuth()) {
    console.log('Demo: updateRange', range, values)
    return
  }
  
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values }
    })
  } catch (error) {
    console.error('Eroare Google Sheets updateRange:', error.message)
  }
}

export async function appendRange(range, values) {
  if (!initAuth()) {
    console.log('Demo: appendRange', range, values)
    return
  }
  
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values }
    })
  } catch (error) {
    console.error('Eroare Google Sheets appendRange:', error.message)
  }
}

function getDemoData(range) {
  if (range.includes('Vehicles')) {
    return [
      ['1', 'Audi', 'Audi', 'Audi', 'Audi', 'Audi', 'A4', 'A4', 'A4', 'A4', 'A4', 'Sedan', 'Sedan', 'Sedan', 'Sedan', 'Sedan', 'Berlina', 'Berlina', 'Berlina', 'Berlina', 'Berlina'],
      ['2', 'BMW', 'BMW', 'BMW', 'BMW', 'BMW', 'Seria 3', 'Seria 3', 'Seria 3', 'Seria 3', 'Seria 3', 'Sedan', 'Sedan', 'Sedan', 'Sedan', 'Sedan', 'Berlina', 'Berlina', 'Berlina', 'Berlina', 'Berlina'],
      ['3', 'Mercedes', 'Mercedes', 'Mercedes', 'Mercedes', 'Mercedes', 'C-Class', 'C-Class', 'C-Class', 'C-Class', 'C-Class', 'Sedan', 'Sedan', 'Sedan', 'Sedan', 'Sedan', 'Berlina', 'Berlina', 'Berlina', 'Berlina', 'Berlina']
    ]
  }
  
  if (range.includes('Services')) {
    return [
      ['1', 'Detailing Auto', 'Car Detailing', 'Detallado de Coche', 'Auto Detailing', 'Detailing Auto', 'Curățenie completă interior și exterior', 'Complete interior and exterior cleaning', 'Limpieza completa interior y exterior', 'Kompletne czyszczenie wnętrza i karoserii', 'Curățenie completă interior și exterior', '150', 'true'],
      ['2', 'Chrome Delete', 'Chrome Delete', 'Chrome Delete', 'Chrome Delete', 'Chrome Delete', 'Înlocuire elemente cromate', 'Replace chrome elements', 'Reemplazar elementos cromados', 'Zastąp chromowane elementy', 'Înlocuire elemente cromate', '200', 'true'],
      ['3', 'Polish & Wax', 'Polish & Wax', 'Polish & Wax', 'Polish & Wax', 'Polish & Wax', 'Polish și wax profesional', 'Professional polish and wax', 'Pulido y encerado profesional', 'Profesjonalny polish i wosk', 'Polish și wax profesional', '180', 'true']
    ]
  }
  
  if (range.includes('Bookings')) {
    return []
  }
  
  return []
}