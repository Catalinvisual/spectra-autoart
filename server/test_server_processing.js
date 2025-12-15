// Test pentru a vedea dacă serverul procesează request-ul
async function testServerProcessing() {
  console.log('Testing server request processing...');
  
  // Vom folosi un timeout mai mare și vom verifica pas cu pas
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secunde timeout
  
  try {
    const response = await fetch('http://localhost:8081/api/bookings', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com", 
        phone: "1234567890",
        date: "2025-12-20",
        time: "10:00",
        make: "BMW",
        model: "X5", 
        body: "suv",
        services: ["Premium Wash"]
      })
    });

    clearTimeout(timeoutId);
    
    console.log('Response received:');
    console.log('- Status:', response.status);
    console.log('- Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('- Body length:', text.length);
    console.log('- Body preview:', text.substring(0, 200));
    
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('Request timed out after 30 seconds');
    } else {
      console.error('Request failed:', error.message);
    }
  }
}

testServerProcessing();