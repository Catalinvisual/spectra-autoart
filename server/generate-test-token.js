import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const payload = {
  email: 'admin@spectra.com',
  role: 'admin',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 ore
};

const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-jwt-secret-key-for-development');
console.log('Token JWT valid pentru testare:');
console.log(token);