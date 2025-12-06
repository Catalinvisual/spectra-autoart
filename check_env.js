// Test pentru a verifica variabilele de mediu
console.log('🔍 Checking environment variables...');
console.log('📧 ADMIN_DEFAULT_EMAIL:', process.env.ADMIN_DEFAULT_EMAIL || 'NOT SET');
console.log('🔑 ADMIN_DEFAULT_PASSWORD:', process.env.ADMIN_DEFAULT_PASSWORD || 'NOT SET');
console.log('🍃 NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('📁 Current directory:', process.cwd());