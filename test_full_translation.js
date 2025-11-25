// Test script pentru a verifica traducerea automată în toate limbile
async function testFullTranslation() {
  const baseUrl = 'http://localhost:8080/api/public/testimonials';
  
  const testCases = [
    {
      name: 'Test Română - Traducere completă',
      data: {
        name: 'Andrei Popescu',
        rating: 5,
        comment: 'Un serviciu excelent! Sunt foarte mulțumit de calitatea lucrării.'
      },
      expectedOriginal: 'RO'
    },
    {
      name: 'Test Engleză - Traducere completă', 
      data: {
        name: 'Michael Johnson',
        rating: 4,
        comment: 'Great service and very professional team. Highly recommended!'
      },
      expectedOriginal: 'EN'
    },
    {
      name: 'Test Olandeză - Traducere completă',
      data: {
        name: 'Anna van Dijk',
        rating: 5,
        comment: 'Uitstekende service! Het team was zeer professioneel en vriendelijk.'
      },
      expectedOriginal: 'NL'
    }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`\n🧪 Testing: ${testCase.name}`);
      console.log(`📝 Original: ${testCase.data.comment}`);
      console.log(`🔍 Expected original language: ${testCase.expectedOriginal}`);
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      });
      
      const result = await response.json();
      console.log(`✅ Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      
      if (!result.success) {
        console.log(`❌ Error: ${result.error}`);
      }
      
      // Așteaptă puțin între teste pentru a nu supraîncărca serverul
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(`❌ API Error: ${error.message}`);
    }
  }
  
  console.log('\n⏳ Aștept 3 secunde pentru procesare...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Verifică rezultatele în Google Sheets
  console.log('\n🔍 Verificare rezultate în Google Sheets...');
  
  // Testăm obținerea testimonialelor în olandeză
  const checkResponse = await fetch('http://localhost:8080/api/public/testimonials?locale=nl&activeOnly=true&useArgosTranslate=true');
  const checkResult = await checkResponse.json();
  
  if (checkResult.success && checkResult.data) {
    console.log(`📊 Total testimoniale: ${checkResult.data.length}`);
    
    // Afișează ultimele 3 testimoniale (cele proaspăt adăugate)
    const recentTestimonials = checkResult.data.slice(-3);
    console.log('\n📝 Ultimele testimoniale adăugate (în olandeză):');
    
    recentTestimonials.forEach((testimonial, index) => {
      console.log(`\n${index + 1}. ${testimonial.name} (${testimonial.rating}/5)`);
      console.log(`   Text: ${testimonial.comment}`);
      console.log(`   Data: ${testimonial.created_date}`);
    });
  }
}

// Rulează testul complet
testFullTranslation();