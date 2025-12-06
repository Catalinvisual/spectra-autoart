import dotenv from 'dotenv';
import GoogleSheetsService from './src/services/googleSheetsService.js';

// Încarcă variabilele de mediu
dotenv.config({ path: './.env' });

async function debugServiceIds() {
  try {
    console.log('🔍 Debug Service IDs...');
    
    // Inițializare
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets inițializat');
    
    // Obținem toate serviciile
    const servicesData = await GoogleSheetsService.getData('Vehicle_Services');
    console.log('📊 Total servicii:', servicesData.length);
    
    if (servicesData.length > 1) {
      console.log('\n📋 Primele 5 servicii existente:');
      for (let i = 1; i <= Math.min(5, servicesData.length - 1); i++) {
        const row = servicesData[i];
        console.log(`Serviciu ${i}:`);
        console.log('  row[0]:', row[0]);
        console.log('  row[1]:', row[1]);
        console.log('  row[2]:', row[2]);
        console.log('  row[19]:', row[19]); // Duration_Minutes
        console.log('  row[20]:', row[20]); // Is_Active
        console.log('  row[21]:', row[21]); // Created_At
      }
      
      // Extragem ID-urile existente
      console.log('\n🔍 Extragere ID-uri existente:');
      const existingIds = servicesData.slice(1).map(row => {
        console.log(`Procesare rând: ${row[0]} | ${row[1]} | ${row[2]}`);
        const id = row[0]; // Prima coloană
        if (typeof id === 'string') {
          const numericMatch = id.match(/\d+$/);
          const extracted = numericMatch ? parseInt(numericMatch[0]) : 0;
          console.log(`  ID: ${id} -> Numeric: ${extracted}`);
          return extracted;
        }
        const parsed = parseInt(id) || 0;
        console.log(`  ID: ${id} -> Parsed: ${parsed}`);
        return parsed;
      }).filter(id => id > 0);
      
      console.log('\n📊 ID-uri valide găsite:', existingIds);
      
      const nextServiceId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
      console.log('🆕 Următorul ID disponibil:', nextServiceId);
    }
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugServiceIds();