const jwt = require('jsonwebtoken');

// JWT secret from .env
const JWT_SECRET = 'f08780b8c525ed3ed781bf1851c98dd0fe6f8563';

// Admin credentials from .env
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

// Generate a new token that expires in 24 hours
const newToken = jwt.sign(
  { 
    email: ADMIN_EMAIL, 
    role: 'admin' 
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);

console.log('🎉 New JWT Token generated:');
console.log(newToken);
console.log('\n📋 Token details:');
console.log('Email:', ADMIN_EMAIL);
console.log('Role: admin');
console.log('Expires in: 24 hours');
console.log('\n🔑 Use this token in your test scripts:');