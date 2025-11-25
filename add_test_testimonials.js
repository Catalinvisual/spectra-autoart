import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function addTestTestimonials() {
  try {
    console.log('🔄 Adăugare testimoniale de test cu structura corectă...');
    
    // Așteaptă inițializarea Google Sheets
    await GoogleSheetsService.initialize();
    
    // Testimonial în română
    const testimonialRO = [
      `test-ro-${Date.now()}`,    // ID
      'Ion Popescu',              // Name
      '5',                        // Rating
      '',                         // Comment_NL (gol)
      '',                         // Comment_EN (gol)
      '',                         // Comment_ES (gol)
      '',                         // Comment_PL (gol)
      'Un serviciu excelent! Echipa a fost foarte profesionistă.', // Comment_RO
      'true',                     // Active
      new Date().toISOString().split('T')[0] // Created_Date
    ];
    
    // Testimonial în engleză
    const testimonialEN = [
      `test-en-${Date.now()}`,    // ID
      'John Smith',               // Name
      '5',                        // Rating
      '',                         // Comment_NL (gol)
      'This is an amazing service! The team was very professional.', // Comment_EN
      '',                         // Comment_ES (gol)
      '',                         // Comment_PL (gol)
      '',                         // Comment_RO (gol)
      'true',                     // Active
      new Date().toISOString().split('T')[0] // Created_Date
    ];
    
    // Testimonial în olandeză
    const testimonialNL = [
      `test-nl-${Date.now()}`,    // ID
      'Jan Jansen',               // Name
      '5',                        // Rating
      'Een uitstekende service! Het team was zeer professioneel.', // Comment_NL
      '',                         // Comment_EN (gol)
      '',                         // Comment_ES (gol)
      '',                         // Comment_PL (gol)
      '',                         // Comment_RO (gol)
      'true',                     // Active
      new Date().toISOString().split('T')[0] // Created_Date
    ];
    
    console.log('📤 Adăugare testimonial română...');
    await GoogleSheetsService.appendData('Testimonials', testimonialRO);
    
    console.log('📤 Adăugare testimonial engleză...');
    await GoogleSheetsService.appendData('Testimonials', testimonialEN);
    
    console.log('📤 Adăugare testimonial olandeză...');
    await GoogleSheetsService.appendData('Testimonials', testimonialNL);
    
    console.log('✅ Toate testimonialele de test au fost adăugate cu succes!');
    console.log('📋 Verifică Google Sheets pentru a confirma structura.');
    
  } catch (error) {
    console.error('❌ Eroare la adăugarea testimonialelor:', error);
  }
}

addTestTestimonials();