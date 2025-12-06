// Generare token JWT cu secret hardcodat
const jwt = require('jsonwebtoken');

// Folosim un secret default (același pe care îl folosește serverul)
const secret = 'your-super-secret-jwt-key-change-this-in-production';
const token = jwt.sign({ email: 'admin@example.com', role: 'admin' }, secret, { expiresIn: '1h' });

console.log('🔑 Generated JWT Token:');
console.log(token);