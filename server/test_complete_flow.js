// Test complet: creare booking public + editare admin cu Premium Wash
async function testCompleteFlow() {
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

    // 2. Creăm booking prin API public
    console.log('2. Creating public booking...');
    const publicBookingData = {
      name: "Test User",
      email: "test@example.com", 
      phone: "1234567890",
      date: "2025-12-20",
      time: "10:00",
      make: "BMW",
      model: "X5", 
      body: "suv",
      services: ["Premium Wash"]
    };

    const createResponse = await fetch('http://localhost:8081/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(publicBookingData)
    });

    if (!createResponse.ok) {
      console.log('Create booking failed:', createResponse.status);
      const errorText = await createResponse.text();
      console.log('Error:', errorText.substring(0, 300));
      return;
    }

    const createData = await createResponse.json();
    const bookingId = createData.booking?.id;
    console.log('✅ Created booking with ID:', bookingId);
    console.log('Initial booking price:', createData.booking?.price);
    console.log('Initial services:', createData.booking?.services);

    // 3. Edităm booking-ul cu admin
    console.log('3. Editing booking with admin...');
    const editBookingData = {
      name: "Test User Updated",
      email: "test@example.com", 
      phone: "1234567890",
      date: "2025-12-21",
      time: "11:00",
      make: "BMW",
      model: "X5", 
      body: "suv",
      services: ["Premium Wash"]
    };

    const editResponse = await fetch(`http://localhost:8081/api/admin/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editBookingData)
    });

    if (!editResponse.ok) {
      console.log('Edit booking failed:', editResponse.status);
      const errorText = await editResponse.text();
      console.log('Error:', errorText.substring(0, 300));
      return;
    }

    const editData = await editResponse.json();
    console.log('✅ Edited booking successfully');
    console.log('Final booking data:');
    console.log('- ID:', editData.booking?.id);
    console.log('- Services:', editData.booking?.services);
    console.log('- Price:', editData.booking?.price);
    console.log('- Make:', editData.booking?.make);
    console.log('- Model:', editData.booking?.model);
    console.log('- Body:', editData.booking?.body);
    console.log('- Email sent:', editData.emailSent);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testCompleteFlow();