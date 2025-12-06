import { GoogleSheetsService } from './src/services/googleSheetsService.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env.production') });

async function checkService176504249() {
  console.log('🔍 Checking prices for service 176504249...');
  
  const googleSheetsService = new GoogleSheetsService();
  await googleSheetsService.initialize();
  
  const sheet = googleSheetsService.doc.sheetsByTitle['Vehicle_Service_Prices'];
  const rows = await sheet.getRows();
  
  console.log(`📊 Total rows in Vehicle_Service_Prices: ${rows.length}`);
  
  const servicePrices = rows.filter(row => {
    const serviceId = row.get('Service_ID');
    return serviceId === '176504249';
  });
  
  console.log(`🔍 Found ${servicePrices.length} prices for service 176504249:`);
  servicePrices.forEach((row, index) => {
    console.log(`  ${index + 1}. ${row.get('Body_Type_Key')}: ${row.get('Price_Min')} ${row.get('Currency')} (${row.get('Duration_Minutes')} min) - ID: ${row.get('ID')}`);
  });
  
  if (servicePrices.length === 0) {
    console.log('❌ No prices found for service 176504249 in Google Sheets!');
  }
}

checkService176504249().catch(console.error);