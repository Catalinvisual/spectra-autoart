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

const KEEP_SERVICE_ID = '176505237'

async function deactivateDuplicates() {
  console.log('🔧 Dezactivare servicii duplicate, păstrăm doar', KEEP_SERVICE_ID)
  const sheetsService = new GoogleSheetsService()
  const initialized = await sheetsService.initialize()
  if (!initialized) { console.log('❌ Init eșuat'); return }

  const doc = sheetsService.doc
  const servicesSheet = doc.sheetsByTitle['Vehicle_Services']
  const pricesSheet = doc.sheetsByTitle['Vehicle_Service_Prices']
  if (!servicesSheet || !pricesSheet) throw new Error('Foi lipsă')

  // Services
  await servicesSheet.loadCells()
  const sHeaders = []
  for (let c = 0; c < Math.min(25, servicesSheet.columnCount); c++) sHeaders.push(servicesSheet.getCell(0, c).value)
  const sIdx = {
    id: sHeaders.indexOf('ID'),
    is_active: sHeaders.indexOf('Is_Active')
  }

  let deactivatedServices = 0
  for (let r = 1; r < servicesSheet.rowCount; r++) {
    const sid = String(servicesSheet.getCell(r, sIdx.id).value || '').trim()
    if (sid && sid !== KEEP_SERVICE_ID && sIdx.is_active !== -1) {
      servicesSheet.getCell(r, sIdx.is_active).value = 'false'
      deactivatedServices++
    }
  }
  await servicesSheet.saveUpdatedCells()
  console.log(`✅ Dezactivate ${deactivatedServices} servicii`)

  // Prices
  await pricesSheet.loadCells()
  const pHeaders = []
  for (let c = 0; c < Math.min(10, pricesSheet.columnCount); c++) pHeaders.push(pricesSheet.getCell(0, c).value)
  const pIdx = {
    service_id: pHeaders.indexOf('Service_ID'),
    is_active: pHeaders.indexOf('Is_Active')
  }
  let deactivatedPrices = 0
  for (let r = 1; r < pricesSheet.rowCount; r++) {
    const serviceId = String(pricesSheet.getCell(r, pIdx.service_id).value || '').trim()
    if (serviceId && serviceId !== KEEP_SERVICE_ID && pIdx.is_active !== -1) {
      pricesSheet.getCell(r, pIdx.is_active).value = 'false'
      deactivatedPrices++
    }
  }
  await pricesSheet.saveUpdatedCells()
  console.log(`✅ Dezactivate ${deactivatedPrices} prețuri`)

  console.log('🎉 Finalizat')
}

deactivateDuplicates().catch(err => {
  console.error('❌ Eroare:', err.message)
})

