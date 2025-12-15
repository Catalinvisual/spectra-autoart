// Test pentru a vedea structura completă a răspunsului
async function testAdminEditResponseStructure() {
  try {
    // 1. Obținem token admin
    console.log('1. Getting admin token...');
    const loginResponse = await fetch('http://localhost:8081/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@spectra.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('Login failed:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Got admin token');

    // 2. Edităm booking-ul
    console.log('2. Editing booking...');
    const editBookingData = {
      date: "2025-12-21",
      time: "11:00",
      make: "BMW",
      model: "X5", 
      body: "suv",
      user: {
        name: "Test User Updated",
        email: "test@example.com", 
        phone: "1234567890"
      },
      services: ["Premium Wash"]
    };

    const editResponse = await fetch('http://localhost:8081/api/admin/bookings/1765827805111', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editBookingData)
    });

    console.log('Response status:', editResponse.status);
    console.log('Response headers:', Object.fromEntries(editResponse.headers.entries()));
    
    const text = await editResponse.text();
    console.log('Full response text:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('\nParsed response data:');
      console.log(JSON.stringify(data, null, 2));
      
      // Verificăm ce proprietăți există
      console.log('\nAvailable properties:');
      console.log('- booking:', !!data.booking);
      console.log('- emailSent:', !!data.emailSent);
      console.log('- message:', !!data.message);
      console.log('- success:', !!data.success);
      
      if (data.booking) {
        console.log('\nBooking properties:');
        console.log('- id:', data.booking.id);
        console.log('- services:', data.booking.services);
        console.log('- price:', data.booking.price);
        console.log('- make:', data.booking.make);
        console.log('- model:', data.booking.model);
        console.log('- body:', data.booking.body);
      }
      
    } catch (parseError) {
      console.log('Could not parse JSON:', text);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAdminEditResponseStructure();