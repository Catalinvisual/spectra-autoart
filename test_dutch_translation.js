// Test script pentru a verifica traducerea automată în olandeză
async function testDutchTranslation() {
  const baseUrl = 'http://localhost:8080/api/public/testimonials?locale=nl&activeOnly=true&useArgosTranslate=true';
  
  try {
    console.log('🔍 Testare obținere testimoniale în olandeză cu traducere Argos...');
    
    const response = await fetch(baseUrl);
    const result = await response.json();
    
    console.log(`✅ Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`📊 Număr testimoniale: ${result.data ? result.data.length : 0}`);
    
    if (result.success && result.data && result.data.length > 0) {
      console.log('\n📝 Primele 3 testimoniale în olandeză:');
      result.data.slice(0, 3).forEach((testimonial, index) => {
        console.log(`\n${index + 1}. ${testimonial.name} (${testimonial.rating}/5)`);
        console.log(`   Text: ${testimonial.comment}`);
        console.log(`   Limbă originală: ${testimonial.originalLanguage || 'necunoscută'}`);
        console.log(`   Tradus: ${testimonial.wasTranslated ? 'DA' : 'NU'}`);
      });
    } else {
      console.log('ℹ️  Nu există testimoniale disponibile sau a apărut o eroare.');
      if (result.error) {
        console.log(`❌ Eroare: ${result.error}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ API Error: ${error.message}`);
  }
}

// Rulează testul
testDutchTranslation();