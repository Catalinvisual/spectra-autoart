import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '.env') });

import GoogleSheetsService from './src/services/googleSheetsService.js';

async function checkServicesData() {
  try {
    await GoogleSheetsService.initialize();
    
    const services = await GoogleSheetsService.getData('Services');
    console.log('Available services (first 3):');
    services.slice(1, 4).forEach((row, i) => {
      console.log(`Row ${i+1}: ID=${row[0]}, Name=${row[1]}`);
    });
    
    const prices = await GoogleSheetsService.getData('Service_Prices');
    console.log('\nAvailable prices (first 3):');
    if (prices.length > 1) {
      prices.slice(1, 4).forEach((row, i) => {
        if (row && row.length > 3) {
          console.log(`Row ${i+1}: Service_ID=${row[1]}, Body_Type=${row[2]}, Price=${row[3]}`);
        }
      });
    } else {
      console.log('No price data found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkServicesData();