// Test cu structura corectă pentru booking
async function testCorrectBookingStructure() {
  try {
    console.log('Testing booking with correct structure...');
    
    const bookingData = {
      date: "2025-12-20",
      time: "10:00",
      make: "BMW",
      model: "X5", 
      body: "suv",
      user: {
        name: "Test User",
        email: "test@example.com", 
        phone: "1234567890"
      },
      services: ["Premium Wash"]
    };

    console.log('Sending data:', JSON.stringify(bookingData, null, 2));
    
    const response = await fetch('http://localhost:8081/api/public/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response body:', text.substring(0, 1000));
    
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Booking created successfully');
        console.log('Booking ID:', data.booking?.id);
        console.log('Services:', data.booking?.services);
        console.log('Price:', data.booking?.price);
        console.log('Make:', data.booking?.make);
        console.log('Model:', data.booking?.model);
        console.log('Body:', data.booking?.body);
        console.log('Email sent:', data.emailSent);
        
        return data.booking?.id;
      } catch (parseError) {
        console.log('Could not parse JSON response');
      }
    } else {
      console.log('❌ Failed to create booking');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCorrectBookingStructure();