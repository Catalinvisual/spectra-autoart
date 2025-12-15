// Test pentru a vedea log-urile serverului în timp real
async function testServerLogs() {
  console.log('Testing server endpoint...');
  
  try {
    const response = await fetch('http://localhost:8081/api/bookings', {
      method: 'POST',
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

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response body:', text.substring(0, 500));
    
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

testServerLogs();