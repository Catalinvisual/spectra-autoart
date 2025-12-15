// Test pentru a vedea serviciile reale din server
async function testRealServerServices() {
  try {
    // Testăm endpoint-ul de servicii
    const response = await fetch('http://localhost:8081/api/vehicle-services');
    const text = await response.text();
    console.log('Raw response:', text.substring(0, 500));
    
    // Dacă este JSON, parsăm
    try {
      const data = JSON.parse(text);
      console.log('Available services:', data.services?.length || 0);
      
      if (data.services && data.services.length > 0) {
        console.log('First 3 services:');
        data.services.slice(0, 3).forEach((service, index) => {
          console.log(`  ${index + 1}. ID: ${service.id}, Name: "${service.name}"`);
        });
        
        // Căutăm servicii care conțin "wash" sau "premium"
        const washServices = data.services.filter(s => 
          s.name.toLowerCase().includes('wash') || 
          s.name.toLowerCase().includes('premium') ||
          s.name.toLowerCase().includes('spălare')
        );
        console.log(`Services with wash/premium:`, washServices.length);
        washServices.forEach(service => {
          console.log(`  - "${service.name}" (ID: ${service.id})`);
        });
      }
    } catch (parseError) {
      console.log('Not valid JSON, might be HTML error page');
    }
    
  } catch (error) {
    console.error('Error fetching services:', error);
  }
}

testRealServerServices();