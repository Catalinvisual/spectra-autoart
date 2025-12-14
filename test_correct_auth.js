import jwt from 'jsonwebtoken';

// Use the exact same credentials from the server .env file
const JWT_SECRET = 'f08780b8c525ed3ed781bf1851c98dd0fe6f8563';
const ADMIN_EMAIL = 'admin@spectra.com';
const ADMIN_PASSWORD = 'admin123';

// Generate a valid token
const payload = {
  email: ADMIN_EMAIL,
  role: 'admin'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

console.log('✅ Correct JWT Token generated with production credentials:');
console.log(token);
console.log('\n📋 Token details:');
console.log('- Email:', ADMIN_EMAIL);
console.log('- Role: admin');
console.log('- JWT Secret:', JWT_SECRET);
console.log('- Expires in: 24 hours');
console.log('\n🔑 Use this token in Authorization header as:');
console.log(`Bearer ${token}`);