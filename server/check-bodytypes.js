import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '.env') });

import GoogleSheetsService from './src/services/googleSheetsService.js';

async function checkBodyTypes() {
  try {
    await GoogleSheetsService.initialize();
    
    const bodyTypes = await GoogleSheetsService.getData('Body_Types');
    console.log('Body types (first 5):');
    bodyTypes.slice(1, 6).forEach((row, i) => {
      if (row && row[0]) console.log(`Row ${i+1}: ID=${row[0]}, Name=${row[1]}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBodyTypes();