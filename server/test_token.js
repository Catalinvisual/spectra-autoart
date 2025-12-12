import jwt from 'jsonwebtoken';

// Use the exact same secret as the server
const secret = 'fallback-jwt-secret-key-for-development';
const token = jwt.sign({ id: 1, email: 'admin@example.com', role: 'admin' }, secret, { expiresIn: '1h' });

console.log('Generated token with server secret:', token);