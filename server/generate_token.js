import jwt from 'jsonwebtoken';

const secret = 'your-secret-key-change-in-production';
const token = jwt.sign({ id: 1, email: 'admin@example.com', role: 'admin' }, secret, { expiresIn: '1h' });

console.log('Generated token:', token);