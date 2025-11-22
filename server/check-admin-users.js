import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '.env') });

import GoogleSheetsService from './src/services/googleSheetsService.js';

async function checkAdminUsers() {
  try {
    await GoogleSheetsService.initialize();
    
    const adminUsers = await GoogleSheetsService.getData('Admin_users');
    console.log('Admin users headers:', adminUsers[0]);
    console.log('Admin users data:');
    adminUsers.slice(1).forEach((row, i) => {
      console.log(`Row ${i+1}:`, row);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdminUsers();