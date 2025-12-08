import http from 'http';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/public/testimonials?lang=nl',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('✅ Testimonials response:', {
        status: res.statusCode,
        testimonialCount: response.data.length,
        firstTestimonial: response.data[0] || 'No testimonials'
      });
      
      if (response.data.length === 0) {
        console.log('⚠️  No testimonials found in Google Sheets');
      } else {
        console.log('✅ Found', response.data.length, 'testimonials');
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.error('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error connecting to server:', error.message);
  console.log('💡 Make sure the server is running on port 5000');
});

req.end();