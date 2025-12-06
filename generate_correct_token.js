// Generare token JWT cu secretul corect din .env
const jwt = require('jsonwebtoken');

// JWT secret din .env
const secret = 'f08780b8c525ed3ed781bf1851c98dd0fe6f8563';
const token = jwt.sign({ email: 'admin@example.com', role: 'admin' }, secret, { expiresIn: '1h' });

console.log('🔑 Generated JWT Token with correct secret:');
console.log(token);