// Script pentru generat token JWT nou
import jwt from 'jsonwebtoken';

const payload = {
  email: 'admin@spectraautoart.nl',
  role: 'admin',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 ore
};

const secret = 'spectra-jwt-secret-2024-safe-key-for-production';

const token = jwt.sign(payload, secret);

console.log('🔑 Token JWT nou generat:');
console.log(token);
console.log('\n📋 Payload:');
console.log(JSON.stringify(payload, null, 2));
console.log('\n✅ Token valid pentru 24 ore');