// Test testimonial cu traducere completă
import axios from 'axios';

async function testTestimonialTranslation() {
  console.log('🧪 Testare testimonial cu traducere completă...\n');
  
  const testimonialData = {
    name: 'Ion Popescu',
    email: 'ion.popescu@email.com',
    rating: 5,
    comment: 'Acesta este un testimonial excelent despre serviciile voastre. Sunt foarte mulțumit de calitatea lucrării efectuate!',
    serviceType: ' detailing complet',
    date: new Date().toISOString()
  };
  
  try {
    console.log('📤 Trimitere testimonial...');
    console.log('Text original:', testimonialData.comment);
    
    const response = await axios.post('http://localhost:8080/api/testimonials', testimonialData);
    
    console.log('✅ Testimonial trimis cu succes!');
    console.log('Răspuns:', response.data);
    
    if (response.data.translations) {
      console.log('\n🌍 Traduceri:');
      Object.entries(response.data.translations).forEach(([lang, translation]) => {
        console.log(`${lang}: "${translation}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ Eroare la trimiterea testimonialului:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Date:', error.response.data);
    }
  }
}

// Rulează testul
testTestimonialTranslation().catch(console.error);