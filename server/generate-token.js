import jwt from 'jsonwebtoken';

// Generate a valid admin token
const payload = {
  userId: 'admin',
  role: 'admin',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
};

const token = jwt.sign(payload, 'f08780b8c525ed3ed781bf1851c98dd0fe6f8563');

console.log('Generated Admin JWT Token:');
console.log(token);
console.log('\nCopy this token for testing:');
console.log(`Bearer ${token}`);