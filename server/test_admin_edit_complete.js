// Test complet: editare booking cu admin și verificare preț/date
async function testAdminEditWithCorrectData() {
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

    // 2. Edităm booking-ul creat (1765827805111)
    console.log('2. Editing booking with Premium Wash...');
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

    const text = await editResponse.text();
    console.log('Edit response status:', editResponse.status);
    
    if (editResponse.ok) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Booking edited successfully');
        console.log('📧 Booking data:');
        console.log('- ID:', data.booking?.id);
        console.log('- Services:', data.booking?.services);
        console.log('- Price:', data.booking?.price, 'EUR');
        console.log('- Make:', data.booking?.make);
        console.log('- Model:', data.booking?.model);
        console.log('- Body:', data.booking?.body);
        console.log('- Email sent:', data.emailSent);
        
        // Verificăm dacă prețul este 35 EUR (prețul pentru SUV Premium Wash)
        if (data.booking?.price === 35) {
          console.log('✅ Price is correct (35 EUR for SUV Premium Wash)');
        } else {
          console.log('❌ Price is incorrect. Expected 35 EUR, got:', data.booking?.price);
        }
        
        // Verificăm dacă toate datele mașinii sunt prezente
        const hasAllData = data.booking?.make && data.booking?.model && data.booking?.body;
        if (hasAllData) {
          console.log('✅ All vehicle data is present');
        } else {
          console.log('❌ Missing vehicle data');
        }
        
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

testAdminEditWithCorrectData();