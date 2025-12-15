// Test pentru a obține token admin și apoi a edita booking
async function testGetTokenAndEditBooking() {
  try {
    // 1. Obținem token admin
    console.log('Getting admin token...');
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
    console.log('✅ Got token:', token.substring(0, 20) + '...');

    // 2. Edităm booking cu serviciul Premium Wash
    const bookingData = {
      name: "Test User Updated",
      email: "test@example.com", 
      phone: "1234567890",
      date: "2025-12-20",
      time: "10:00",
      make: "BMW",
      model: "X5", 
      body: "suv",
      services: ["Premium Wash"] // Acesta există în demo data
    };

    console.log('Editing booking with Premium Wash...');
    const editResponse = await fetch('http://localhost:8081/api/admin/bookings/176505237', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });

    const text = await editResponse.text();
    console.log('Edit response status:', editResponse.status);
    
    if (editResponse.ok) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Booking edited successfully');
        console.log('Booking data:', {
          id: data.booking?.id,
          services: data.booking?.services,
          price: data.booking?.price,
          make: data.booking?.make,
          model: data.booking?.model,
          body: data.booking?.body,
          emailSent: data.emailSent
        });
      } catch (parseError) {
        console.log('Response text:', text.substring(0, 500));
      }
    } else {
      console.log('❌ Failed to edit booking');
      console.log('Error response:', text.substring(0, 500));
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testGetTokenAndEditBooking();