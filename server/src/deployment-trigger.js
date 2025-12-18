// Deployment trigger - forțează restartul serverului
// Acest fișier creează o modificare minoră pentru a forța rebuild

const DEPLOYMENT_FIX_VERSION = '1.0.1';
const DEPLOYMENT_FIX_APPLIED = new Date().toISOString();

console.log('🚀 DEPLOYMENT TRIGGER ACTIVAT');
console.log('📦 Versiune fix:', DEPLOYMENT_FIX_VERSION);
console.log('⏰ Aplicat la:', DEPLOYMENT_FIX_APPLIED);
console.log('🎯 Fix aplicat: Ordinea rutelor API (catch-all mutat la final)');
console.log('🔧 Probleme rezolvate:');
console.log('   - Rutele API returnau HTML în loc de JSON');
console.log('   - Autentificarea JWT nu funcționa (Token lipsă)');
console.log('   - Endpointurile admin returnau 404');

export { DEPLOYMENT_FIX_VERSION, DEPLOYMENT_FIX_APPLIED };