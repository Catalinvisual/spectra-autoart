import jwt from 'jsonwebtoken'

export default function requireAuth(req, res, next) {
  console.log('🔐 Auth middleware - checking token...');
  console.log('📋 Authorization header:', req.headers.authorization);
  
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  
  if (!token) {
    console.log('❌ No token found');
    return res.status(401).json({ error: 'Token lipsă' })
  }
  
  console.log('🔑 Token found, verifying...');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('✅ Token verified successfully:', decoded);
    req.user = decoded
    next()
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return res.status(401).json({ error: 'Token invalid' })
  }
}