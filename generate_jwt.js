import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: join(__dirname, 'server/.env') });

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_DEFAULT_EMAIL;

if (!JWT_SECRET || !ADMIN_EMAIL) {
  console.error('❌ Missing JWT_SECRET or ADMIN_DEFAULT_EMAIL in environment variables');
  process.exit(1);
}

// Generate a new JWT token
const payload = {
  email: ADMIN_EMAIL,
  role: 'admin',
  id: 1, // Assuming admin user ID is 1
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
};

const token = jwt.sign(payload, JWT_SECRET);

console.log('✅ New JWT token generated:');
console.log(token);
console.log('\n📊 Token details:');
console.log('- Email:', ADMIN_EMAIL);
console.log('- Role: admin');
console.log('- User ID: 1');
console.log('- Expires in: 24 hours');
console.log('\n🔑 Use this token in your Authorization header as:');
console.log(`Bearer ${token}`);