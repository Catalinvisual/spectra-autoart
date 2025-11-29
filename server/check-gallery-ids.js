import GoogleSheetsService from './src/services/googleSheetsService.js';

async function checkGalleryIds() {
  try {
    const data = await GoogleSheetsService.getData('Gallery');
    
    if (data.length <= 1) {
      console.log('Galerie goală');
      return;
    }
    
    const headers = data[0];
    const idColumnIndex = headers.findIndex(header => 
      header.toLowerCase().replace(/ /g, '_') === 'id'
    );
    
    if (idColumnIndex === -1) {
      console.log('Coloană ID negăsită');
      return;
    }
    
    console.log('📊 ID-uri existente în Google Sheets Gallery:');
    data.slice(1).forEach((row, index) => {
      const id = row[idColumnIndex];
      if (id) {
        console.log(`  ${index + 1}. ${id}`);
      }
    });
    
    console.log('\n🔍 Verificare pattern ID:', '1764413003189');
    const found = data.slice(1).some(row => {
      const id = String(row[idColumnIndex]);
      return id.includes('1764413003189') || id === '1764413003189';
    });
    console.log('Găsit:', found);
    
  } catch (error) {
    console.error('Eroare:', error.message);
  }
}

checkGalleryIds();