const cloudinary = require('cloudinary').v2;

// Test Cloudinary configuration
console.log('Testing Cloudinary configuration...');

const config = {
  cloud_name: 'dnriqujfv',
  api_key: '357219655611499',
  api_secret: 'goAe1YBzpmSxv-Ei00vnehB8pGw'
};

console.log('Configuration:', {
  cloud_name: config.cloud_name,
  api_key: config.api_key ? '***' + config.api_key.slice(-4) : 'MISSING',
  api_secret: config.api_secret ? '***' + config.api_secret.slice(-4) : 'MISSING'
});

try {
  cloudinary.config(config);
  console.log('✅ Cloudinary configured successfully');
  
  // Test a simple API call
  cloudinary.api.ping((error, result) => {
    if (error) {
      console.error('❌ Cloudinary API test failed:', error.message);
    } else {
      console.log('✅ Cloudinary API test successful:', result);
    }
  });
} catch (error) {
  console.error('❌ Cloudinary configuration failed:', error.message);
}