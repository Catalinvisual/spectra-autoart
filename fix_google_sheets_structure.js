import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function fixTestimonialsStructure() {
  try {
    console.log('🔄 Refacere structură Google Sheets pentru testimoniale...');
    
    // Creează header-ul corect pentru testimoniale
    const testimonialHeaders = [
      'ID', 'Name', 'Rating', 'Comment_NL', 'Comment_EN', 'Comment_ES', 'Comment_PL', 'Comment_RO', 'Active', 'Created_Date'
    ];
    
    // Rescrie header-ul pe prima linie (rowIndex = 1)
    await GoogleSheetsService.updateData('Testimonials', 1, [testimonialHeaders]);
    
    console.log('✅ Structură testimoniale refăcută cu succes!');
    
    // Creează header-ul corect pentru servicii
    const serviceHeaders = [
      'ID', 'Name_NL', 'Name_EN', 'Name_ES', 'Name_PL', 'Name_RO', 
      'Description_NL', 'Description_EN', 'Description_ES', 'Description_PL', 'Description_RO',
      'Price', 'Duration', 'Active', 'Created_Date'
    ];
    
    // Rescrie header-ul pentru servicii
    await GoogleSheetsService.updateData('Services', 1, [serviceHeaders]);
    
    console.log('✅ Structură servicii refăcută cu succes!');
    
  } catch (error) {
    console.error('❌ Eroare la refacerea structurii:', error);
  }
}

fixTestimonialsStructure();