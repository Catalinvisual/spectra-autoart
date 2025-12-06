import dotenv from 'dotenv'
import { GoogleSheetsService } from './src/services/googleSheetsService.js'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env' })

process.env.GOOGLE_SHEETS_SPREADSHEET_ID = '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90'

const envPath = path.resolve('.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const privateKeyMatch = envContent.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/)
  if (privateKeyMatch) {
    process.env.GOOGLE_PRIVATE_KEY = privateKeyMatch[0].replace(/\\n/g, '\n')
  }
}
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com'

const TARGET_SERVICE_ID = '176505237'
const expectedPrices = {
  sedan: '11',
  suv: '22',
  hatchback: '33',
  cabrio: '44',
  coupe: '55',
  wagon: '66',
  van: '77',
  break: '88'
}

async function normalizePrices() {
  console.log('🔧 Normalizare prețuri pentru serviciul', TARGET_SERVICE_ID)
  const sheetsService = new GoogleSheetsService()
  const initialized = await sheetsService.initialize()
  if (!initialized) {
    console.log('❌ Nu s-a putut initializa Google Sheets')
    return
  }

  const doc = sheetsService.doc
  const pricesSheet = doc.sheetsByTitle['Vehicle_Service_Prices']
  if (!pricesSheet) throw new Error('Foaia Vehicle_Service_Prices nu există')

  await pricesSheet.loadCells()
  console.log(`📊 Rânduri: ${pricesSheet.rowCount}, Coloane: ${pricesSheet.columnCount}`)

  const headers = []
  for (let c = 0; c < Math.min(10, pricesSheet.columnCount); c++) {
    headers.push(pricesSheet.getCell(0, c).value)
  }
  const idx = {
    id: headers.indexOf('ID'),
    service_id: headers.indexOf('Service_ID'),
    body_type_key: headers.indexOf('Body_Type_Key'),
    price_min: headers.indexOf('Price_Min'),
    currency: headers.indexOf('Currency'),
    duration: headers.indexOf('Duration_Minutes'),
    is_active: headers.indexOf('Is_Active') // may be col 7
  }

  const seenBodyTypes = new Set()
  let updatedCount = 0

  for (let r = 1; r < pricesSheet.rowCount; r++) {
    const sid = pricesSheet.getCell(r, idx.service_id).value
    if (String(sid) === TARGET_SERVICE_ID) {
      const bt = String(pricesSheet.getCell(r, idx.body_type_key).value || '').trim()
      if (bt && expectedPrices[bt] !== undefined) {
        const expected = expectedPrices[bt]
        pricesSheet.getCell(r, idx.price_min).value = expected
        if (idx.currency !== -1) pricesSheet.getCell(r, idx.currency).value = 'EUR'
        if (idx.duration !== -1) pricesSheet.getCell(r, idx.duration).value = '60'
        if (idx.is_active !== -1) pricesSheet.getCell(r, idx.is_active).value = 'true'
        seenBodyTypes.add(bt)
        updatedCount++
        console.log(`✅ Actualizat ${bt} -> €${expected}`)
      }
    }
  }

  await pricesSheet.saveUpdatedCells()
  console.log(`💾 Salvate ${updatedCount} rânduri actualizate`)

  const missing = Object.keys(expectedPrices).filter(bt => !seenBodyTypes.has(bt))
  if (missing.length > 0) {
    console.log('➕ Lipsesc prețuri pentru:', missing.join(', '))
    for (const bt of missing) {
      const row = [
        `service_price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        TARGET_SERVICE_ID,
        bt,
        expectedPrices[bt],
        'EUR',
        '60',
        '0',
        'true',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ]
      await sheetsService.appendData('Vehicle_Service_Prices', row)
      console.log(`✅ Adăugat ${bt} -> €${expectedPrices[bt]}`)
    }
  }

  console.log('🎉 Normalizare completă')
}

normalizePrices().catch(err => {
  console.error('❌ Eroare:', err.message)
})

