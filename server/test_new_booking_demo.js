// Test pentru creare programare nouă cu serviciu demo
const testNewBookingWithDemoService = async () => {
  try {
    const bookingData = {
    date: "2025-12-25",
    time: "14:00",
    make: "BMW",
    model: "X5",
    body: "suv",
    services: ["176505905"], // ID-ul serviciului "xd" din demo data
    user: {
      name: "Test User New",
      email: "testnew@example.com",
      phone: "1234567890"
    },
    newsletter: false
  };

    console.log('Creating new booking with data:', JSON.stringify(bookingData, null, 2));
    
    const response = await fetch('http://localhost:8081/api/public/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', responseText);

    if (response.ok) {
      console.log('✅ New booking created:', responseText);
    } else {
      console.log('❌ Failed to create booking:', responseText);
    }
  } catch (error) {
    console.error('❌ Error creating booking:', error.message);
  }
};

testNewBookingWithDemoService();