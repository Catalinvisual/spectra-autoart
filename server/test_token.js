import jwt from 'jsonwebtoken';

// Use the exact same secret as the server from .env.local
const secret = 'f08780b8c525ed3ed781bf1851c98dd0fe6f8563';
const token = jwt.sign({ id: 1, email: 'admin@example.com', role: 'admin' }, secret, { expiresIn: '1h' });

console.log('Generated token with server secret:', token);