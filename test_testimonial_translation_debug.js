const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testTestimonialTranslation() {
  console.log('🧪 Testing testimonial translation process...\n');

  // Generate JWT token for authentication
  const testToken = jwt.sign(
    { email: 'admin@spectra.com', role: 'admin' },
    process.env.JWT_SECRET || 'f08780b8c525ed3ed781bf1851c98dd0fe6f8563',
    { expiresIn: '1h' }
  );

  // Test testimonial data in Romanian
  const testimonialData = {
    name: 'Ion Popescu',
    rating: 5,
    comment: 'Am fost foarte mulțumit de serviciile oferite. Personalul este profesionist și atent la detalii. Recomand cu încredere!'
  };

  console.log('📋 Original testimonial data:');
  console.log(`Name: ${testimonialData.name}`);
  console.log(`Rating: ${testimonialData.rating}`);
  console.log(`Comment: ${testimonialData.comment}`);
  console.log('');

  try {
    console.log('🔄 Submitting testimonial to server...');
    
    const response = await axios.post(
      'http://localhost:8080/api/testimonials',
      testimonialData,
      {
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Testimonial submitted successfully!');
    console.log('Response:', response.data);
    console.log('');

    // Wait a bit then check if it was translated correctly
    console.log('⏳ Waiting 3 seconds before checking the saved data...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🔍 Fetching testimonials to check translation...');
    const testimonialsResponse = await axios.get('http://localhost:8080/api/testimonials?lang=en');
    
    console.log('📊 Testimonials retrieved:');
    console.log('Count:', testimonialsResponse.data.data.length);
    
    if (testimonialsResponse.data.data.length > 0) {
      const latestTestimonial = testimonialsResponse.data.data[testimonialsResponse.data.data.length - 1];
      console.log('Latest testimonial:');
      console.log(`Name: ${latestTestimonial.name}`);
      console.log(`Rating: ${latestTestimonial.rating}`);
      console.log(`Comment: ${latestTestimonial.comment}`);
      console.log('');
      
      // Check if the comment is properly translated to English
      const originalRomanian = testimonialData.comment;
      const translatedEnglish = latestTestimonial.comment;
      
      console.log('🔄 Translation check:');
      console.log(`Original (RO): ${originalRomanian}`);
      console.log(`Translated (EN): ${translatedEnglish}`);
      console.log(`Is different (translated): ${originalRomanian !== translatedEnglish}`);
      
      if (originalRomanian === translatedEnglish) {
        console.log('❌ WARNING: Translation may have failed - same text in English');
      } else {
        console.log('✅ Translation appears to have worked');
      }
    }

  } catch (error) {
    console.error('❌ Error testing testimonial translation:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testTestimonialTranslation();