// Script simplu pentru a verifica logurile serverului
import { execSync } from 'child_process';

console.log('🔍 Căutare procese Node.js...');

try {
  // Găsește procesele node care ascultă pe portul 8080
  const result = execSync('netstat -ano | findstr :8080', { encoding: 'utf8' });
  console.log('📊 Procese pe portul 8080:');
  console.log(result);
  
  // Extrage PID-urile
  const lines = result.split('\n').filter(line => line.trim());
  const pids = lines.map(line => {
    const parts = line.trim().split(/\s+/);
    return parts[parts.length - 1];
  }).filter(pid => pid && pid !== '0');
  
  console.log('🆔 PID-uri găsite:', [...new Set(pids)]);
  
} catch (error) {
  console.log('❌ Nu s-au găsit procese pe portul 8080 sau eroare:', error.message);
}