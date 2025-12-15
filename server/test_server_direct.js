// Test direct în server pentru a verifica serviciile
async function testServerServicesDirect() {
  try {
    const response = await fetch('http://localhost:8081/debug');
    const data = await response.json();
    console.log('Server debug data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching debug data:', error);
  }
}

testServerServicesDirect();