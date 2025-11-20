import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Definim toate serviciile demo care ar trebui să existe
const demoServices = [
  {
    id: 1,
    slug: 'premium-wash',
    name: 'Premium Wash',
    name_en: 'Premium Wash',
    description: 'Spălare completă exterioară cu produse de calitate superioară',
    description_en: 'Complete exterior wash with premium products',
    category: 'exterior',
    image_url: '/images/services/premium-wash.jpg',
    duration_minutes: 45,
    is_active: true
  },
  {
    id: 2,
    slug: 'interior-detail',
    name: 'Interior Detail',
    name_en: 'Interior Detail',
    description: 'Curățare profundă interior cu extracție și deodorizare',
    description_en: 'Deep interior cleaning with extraction and deodorizing',
    category: 'interior',
    image_url: '/images/services/interior-detail.jpg',
    duration_minutes: 120,
    is_active: true
  },
  {
    id: 3,
    slug: 'engine-detailing',
    name: 'Engine Detailing',
    name_en: 'Engine Detailing',
    description: 'Curățare și protejare compartiment motor',
    description_en: 'Engine compartment cleaning and protection',
    category: 'engine',
    image_url: '/images/services/engine-detailing.jpg',
    duration_minutes: 60,
    is_active: true
  },
  {
    id: 4,
    slug: 'ceramic-coating',
    name: 'Ceramic Coating',
    name_en: 'Ceramic Coating',
    description: 'Aplicare protecție ceramică pentru vopsea',
    description_en: 'Ceramic coating application for paint protection',
    category: 'protection',
    image_url: '/images/services/ceramic-coating.jpg',
    duration_minutes: 240,
    is_active: true
  },
  {
    id: 5,
    slug: 'headlight-restoration',
    name: 'Headlight Restoration',
    name_en: 'Headlight Restoration',
    description: 'Restaurare faruri oxidate',
    description_en: 'Oxidized headlight restoration',
    category: 'restoration',
    image_url: '/images/services/headlight-restoration.jpg',
    duration_minutes: 90,
    is_active: true
  }
];

// Prețuri demo pentru fiecare serviciu
const demoPrices = {
  1: { // Premium Wash
    'suv': { price_min: 35, price_max: 45, duration_minutes: 45 },
    'berlina': { price_min: 25, price_max: 35, duration_minutes: 40 },
    'break': { price_min: 30, price_max: 40, duration_minutes: 45 },
    'hatchback': { price_min: 20, price_max: 30, duration_minutes: 35 },
    'coupe': { price_min: 25, price_max: 35, duration_minutes: 40 },
    'cabrio': { price_min: 25, price_max: 35, duration_minutes: 40 },
    'van': { price_min: 40, price_max: 50, duration_minutes: 50 }
  },
  2: { // Interior Detail
    'suv': { price_min: 120, price_max: 150, duration_minutes: 150 },
    'berlina': { price_min: 100, price_max: 130, duration_minutes: 120 },
    'break': { price_min: 110, price_max: 140, duration_minutes: 135 },
    'hatchback': { price_min: 90, price_max: 120, duration_minutes: 105 },
    'coupe': { price_min: 95, price_max: 125, duration_minutes: 110 },
    'cabrio': { price_min: 85, price_max: 115, duration_minutes: 100 },
    'van': { price_min: 140, price_max: 170, duration_minutes: 165 }
  },
  3: { // Engine Detailing
    'suv': { price_min: 80, price_max: 100, duration_minutes: 70 },
    'berlina': { price_min: 60, price_max: 80, duration_minutes: 60 },
    'break': { price_min: 70, price_max: 90, duration_minutes: 65 },
    'hatchback': { price_min: 50, price_max: 70, duration_minutes: 55 },
    'coupe': { price_min: 70, price_max: 90, duration_minutes: 65 },
    'cabrio': { price_min: 55, price_max: 75, duration_minutes: 60 },
    'van': { price_min: 90, price_max: 110, duration_minutes: 75 }
  },
  4: { // Ceramic Coating
    'suv': { price_min: 500, price_max: 600, duration_minutes: 300 },
    'berlina': { price_min: 400, price_max: 500, duration_minutes: 240 },
    'break': { price_min: 450, price_max: 550, duration_minutes: 270 },
    'hatchback': { price_min: 350, price_max: 450, duration_minutes: 210 },
    'coupe': { price_min: 400, price_max: 500, duration_minutes: 240 },
    'cabrio': { price_min: 350, price_max: 450, duration_minutes: 210 },
    'van': { price_min: 550, price_max: 650, duration_minutes: 330 }
  },
  5: { // Headlight Restoration
    'suv': { price_min: 90, price_max: 110, duration_minutes: 100 },
    'berlina': { price_min: 70, price_max: 90, duration_minutes: 90 },
    'break': { price_min: 80, price_max: 100, duration_minutes: 95 },
    'hatchback': { price_min: 60, price_max: 80, duration_minutes: 85 },
    'coupe': { price_min: 70, price_max: 90, duration_minutes: 90 },
    'cabrio': { price_min: 65, price_max: 85, duration_minutes: 80 },
    'van': { price_min: 100, price_max: 120, duration_minutes: 110 }
  }
};

async function syncAllServices() {
  try {
    console.log('🔄 Sincronizăm toate serviciile demo cu Google Sheets...');
    
    // Mai întâi obținem token-ul de admin
    console.log('🔑 Obținem token de admin...');
    const authResponse = await axios.post(`${API_URL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = authResponse.data.token;
    console.log('✅ Token obținut');
    
    // Adăugăm fiecare serviciu
    for (const service of demoServices) {
      console.log(`\n➕ Adăugăm serviciul: ${service.name}`);
      
      try {
        const response = await axios.post(`${API_URL}/vehicle-services`, {
          name: service.name,
          name_en: service.name_en,
          description: service.description,
          description_en: service.description_en,
          category: service.category,
          image_url: service.image_url,
          duration_minutes: service.duration_minutes,
          prices: demoPrices[service.id]
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log(`✅ Serviciu adăugat: ${response.data.data.name} (ID: ${response.data.data.id})`);
        
      } catch (error) {
        console.log(`❌ Eroare la adăugarea serviciului ${service.name}:`, error.response?.data || error.message);
      }
    }
    
    console.log('\n🎉 Sincronizare completă!');
    
  } catch (error) {
    console.error('❌ Eroare:', error.response?.data || error.message);
  }
}

syncAllServices();