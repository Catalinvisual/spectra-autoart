import dotenv from 'dotenv'
import { GoogleSheetsService } from './src/services/googleSheetsService.js';

// Load environment variables
dotenv.config({ path: '.env.local' })

async function checkCurrentState() {
  console.log('Starting Google Sheets check...');
  const service = new GoogleSheetsService();
  try {
    console.log('Initializing service...');
    await service.initialize();
    console.log('Getting Vehicle_Services data...');
    const data = await service.getData('Vehicle_Services');
    console.log('Current Vehicle_Services data:');
    data.forEach((row, index) => {
      console.log(`Row ${index}:`, row);
    });
    console.log('Total rows:', data.length);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

checkCurrentState().then(() => {
  console.log('Check completed');
  process.exit(0);
}).catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});