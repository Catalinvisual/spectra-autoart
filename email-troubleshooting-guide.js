import https from 'https';

// Ghid pentru rezolvarea problemei Gmail SMTP
console.log('📧 GHID REZOLVARE PROBLEMĂ GMAIL SMTP\n');
console.log('🚨 Problemă identificată: Gmail blochează conexiunile din Railway');
console.log('🔍 Eroare: ETIMEDOUT - Connection timeout\n');

console.log('✅ SOLUȚII IMAGEDIATE:\n');

console.log('📋 OPȚIUNEA 1: Parolă pentru aplicații Gmail (RECOMANDAT)');
console.log('1. Loghează-te în contul Gmail: spectraautoart@gmail.com');
console.log('2. Activează autentificarea cu 2 factori:');
console.log('   → https://myaccount.google.com/security/2sv');
console.log('3. Generează o parolă pentru aplicații:');
console.log('   → https://myaccount.google.com/apppasswords');
console.log('4. Selectează: "Mail" și "Altele (custom)"');
console.log('5. Nume: "Spectra AutoArt Railway"');
console.log('6. Copiează parola generată (16 caractere)');
console.log('7. În Railway, înlocuiește EMAIL_PASS cu noua parolă\n');

console.log('📋 OPȚIUNEA 2: Permite aplicații "mai puțin sigure"');
console.log('1. Loghează-te în contul Gmail: spectraautoart@gmail.com');
console.log('2. Accesează: https://myaccount.google.com/lesssecureapps');
console.log('3. Activează: "Allow less secure apps"');
console.log('4. Verifică și: https://accounts.google.com/DisplayUnlockCaptcha\n');

console.log('📋 OPȚIUNEA 3: Folosește SendGrid (alternativ gratuit)');
console.log('1. Creează cont gratuit pe: https://sendgrid.com');
console.log('2. Generează API Key în SendGrid');
console.log('3. Înlocuiește configurația SMTP cu SendGrid\n');

console.log('⚠️  IMPORTANT: După oricare modificare, redeploy pe Railway!');

// Testează configurația curentă
async function testCurrentConfig() {
  console.log('\n🔍 Testare configurație curentă în producție...');
  
  try {
    const configResponse = await fetch('https://spectra-autoart-production.up.railway.app/api/admin/email/config', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA1MDg4NDAwLCJleHAiOjE3MDUxNzQ4MDB9.dummy_token_for_testing'
      }
    });
    
    if (configResponse.ok) {
      const config = await configResponse.json();
      console.log('✅ Configurație curentă:', JSON.stringify(config, null, 2));
    } else {
      console.log('❌ Nu pot obține configurația (endpoint-ul nu există încă)');
    }
  } catch (error) {
    console.log('❌ Eroare la testare:', error.message);
  }
}

// Rulează testul
testCurrentConfig();