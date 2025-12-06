async function testDirect() {
  try {
    console.log('🧪 Testing direct POST to /api/vehicle-services...');
    
    const response = await fetch('http://localhost:8080/api/vehicle-services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTAxODkxOSwiZXhwIjoxNzY1MTA1MzE5fQ.mlMBn-lObtKoPdm2O_Xm_NizB95OtnMax7SExQzTHlU'
      },
      body: JSON.stringify({
        name: 'Test Service Direct',
        description: 'Testing direct connection',
        default_prices: {
          sedan: 150,
          suv: 200
        }
      })
    });

    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('📄 Response body:', text);
    
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Success:', data);
      } catch (e) {
        console.log('⚠️  Response is not JSON');
      }
    } else {
      console.log('❌ Error response:', text);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testDirect();