const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testServiceTranslation() {
  try {
    // Create a test JWT token
    const testToken = jwt.sign(
      { email: 'admin@spectra.com', role: 'admin' },
      process.env.JWT_SECRET || 'f08780b8c525ed3ed781bf1851c98dd0fe6f8563',
      { expiresIn: '1h' }
    );

    // Test data for a vehicle service in Romanian
    const serviceData = {
      name: "Schimb ulei și filtre",
      description: "Serviciu complet de schimb ulei și filtre pentru toate tipurile de autovehicule. Include ulei de calitate premium și filtre originale.",
      category: "Întreținere generală",
      duration_minutes: 90,
      default_prices: {
        sedan: 299,
        suv: 349,
        hatchback: 279,
        coupe: 329,
        convertible: 359,
        wagon: 339,
        van: 379
      }
    };

    console.log('Testing service creation with translation...');
    console.log('Original service data:', serviceData);

    // Send POST request to create service with translation
    const response = await axios.post(
      'http://localhost:8080/api/vehicle-services/vehicle-services',
      serviceData,
      {
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Service creation response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log('\n✅ Service created and translated successfully!');
      console.log('Service ID:', response.data.data.id);
      console.log('Slug:', response.data.data.slug);
      if (response.data.data.translations) {
        console.log('Translations saved:', response.data.data.translations);
      }
    } else {
      console.log('\n❌ Service creation failed:', response.data.message);
    }

  } catch (error) {
    console.error('Error testing service translation:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testServiceTranslation();