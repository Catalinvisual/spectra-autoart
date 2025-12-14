const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔄 Încercare finală de commit și push după așteptare extinsă...');

// Așteaptă 30 secunde pentru ca sistemul să elibereze complet lock-ul
console.log('⏳ Aștept 30 secunde pentru eliberarea completă a lock-ului...');

setTimeout(() => {
  try {
    console.log('📁 Încerc să adaug fișierele...');
    
    // Încearcă să vezi dacă lock-ul a fost eliberat
    try {
      execSync('git status', { stdio: 'pipe' });
      console.log('✅ Lock eliberat! Continui cu operațiunile...');
    } catch (statusError) {
      console.log('❌ Lock încă activ:', statusError.message);
      throw new Error('Git lock încă prezent');
    }
    
    // Adaugă fișierele
    execSync('git add railway-hybrid-prod.Dockerfile railway.toml rollback_to_stable.js', { stdio: 'inherit' });
    
    // Face commit
    console.log('💾 Fac commit...');
    execSync('git commit -m "Rollback la commitul df213be2 - eliminare fișiere create post-deploy și restaurare configurație originală"', { stdio: 'inherit' });
    
    // Face push
    console.log('🚀 Fac push pe GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ SUCCESS! Commit și push finalizate cu succes!');
    console.log('📋 Proiectul a revenit la starea stabilă din commitul df213be2');
    console.log('🎯 Acum poți face deploy pe Railway cu configurația curată!');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    console.log('');
    console.log('🚨 SOLUȚIE ALTERNATIVĂ:');
    console.log('1. Așteaptă încă 1-2 minute și încearcă manual:');
    console.log('   git add railway-hybrid-prod.Dockerfile railway.toml rollback_to_stable.js');
    console.log('   git commit -m "Rollback la commitul df213be2"');
    console.log('   git push origin main');
    console.log('');
    console.log('2. SAU restartează terminalul și încearcă din nou');
    console.log('3. Proiectul este ORICUM în stare stabilă - doar commit-ul este blocat');
  }
}, 30000);