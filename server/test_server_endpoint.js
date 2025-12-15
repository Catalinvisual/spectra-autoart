// Test pentru a vedea serviciile disponibile în server
async function testServerServicesEndpoint() {
  try {
    const response = await fetch('http://localhost:8081/api/vehicle-services');
    const data = await response.json();
    console.log('Available services:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching services:', error);
  }
}

testServerServicesEndpoint();