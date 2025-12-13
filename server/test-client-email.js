import { sendBookingConfirmation } from './src/services/emailService.js';

// Date de test pentru emailul clientului
const testBookingData = {
  locale: 'ro',
  name: 'Catalin Hapenciuc',
  user: {
    email: 'hapenciuccatalin@yahoo.com'
  },
  phone: '+40 712 345 678',
  date: '2024-12-15',
  time: '14:30',
  vehicle: 'BMW Seria 3',
  body: 'sedan'
};

const testServices = [
  {
    name: 'Spălare exterior premium',
    price: 50,
    duration: 60
  },
  {
    name: 'Curățare interior',
    price: 80,
    duration: 90
  },
  {
    name: 'Polish și protecție',
    price: 120,
    duration: 120
  }
];

async function testClientEmail() {
  try {
    console.log('Trimit email de test pentru client...');
    console.log('Date:', JSON.stringify(testBookingData, null, 2));
    
    const result = await sendBookingConfirmation(testBookingData, testServices);
    
    console.log('✅ Email trimis cu succes!');
    console.log('Rezultat:', result);
  } catch (error) {
    console.error('❌ Eroare la trimiterea emailului:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Rulează testul
testClientEmail();