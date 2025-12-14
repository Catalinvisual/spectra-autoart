const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Încercare forțată de commit și push...');

try {
  // Așteaptă 10 secunde pentru ca sistemul să elibereze lock-ul
  console.log('⏳ Aștept 10 secunde pentru eliberarea lock-ului...');
  setTimeout(() => {
    try {
      // Încearcă să adaugi fișierele
      console.log('📁 Adaug fișierele...');
      execSync('git add railway-hybrid-prod.Dockerfile railway.toml rollback_to_stable.js', { stdio: 'inherit' });
      
      // Face commit
      console.log('💾 Fac commit...');
      execSync('git commit -m "Rollback la commitul df213be2 - eliminare fișiere create post-deploy și restaurare configurație originală"', { stdio: 'inherit' });
      
      // Face push
      console.log('🚀 Fac push pe GitHub...');
      execSync('git push origin main', { stdio: 'inherit' });
      
      console.log('✅ Commit și push finalizate cu succes!');
      console.log('📋 Proiectul a revenit la starea stabilă din commitul df213be2');
      
    } catch (error) {
      console.error('❌ Eroare la operațiunea git:', error.message);
      console.log('💡 Încercare alternativă: folosește git add -f pentru a forța adăugarea');
      
      try {
        execSync('git add -f railway-hybrid-prod.Dockerfile railway.toml rollback_to_stable.js', { stdio: 'inherit' });
        execSync('git commit -m "Rollback la commitul df213be2 - forțat"', { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('✅ Commit forțat reușit!');
      } catch (forceError) {
        console.error('❌ Nici commit-ul forțat nu a reușit:', forceError.message);
        console.log('📋 Soluție manuală: Așteaptă câteva minute și încearcă din nou manual:');
        console.log('   git add railway-hybrid-prod.Dockerfile railway.toml rollback_to_stable.js');
        console.log('   git commit -m "Rollback la commitul df213be2"');
        console.log('   git push origin main');
      }
    }
  }, 10000);
  
} catch (error) {
  console.error('❌ Eroare generală:', error.message);
}