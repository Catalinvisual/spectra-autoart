// Test pentru a edita un booking existent cu serviciul Premium Wash
async function testEditBookingWithDemoService() {
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

  try {
    console.log('Editing booking with data:', JSON.stringify(bookingData, null, 2));
    
    // Vom edita booking-ul cu ID-ul 176505237 pe care l-am testat mai devreme
    const response = await fetch('http://localhost:8081/api/admin/bookings/176505237', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ADMIN_TOKEN || 'admin-token'}`,
        'X-Admin-Key': 'admin123'
      },
      body: JSON.stringify(bookingData)
    });

    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', text.substring(0, 1000));
    
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Booking edited:', data);
        
        if (data.booking) {
          console.log('Booking ID:', data.booking.id);
          console.log('Services:', data.booking.services);
          console.log('Price:', data.booking.price);
          console.log('Make:', data.booking.make);
          console.log('Model:', data.booking.model);
          console.log('Body:', data.booking.body);
          console.log('Email sent:', data.emailSent);
        }
      } catch (parseError) {
        console.log('Could not parse JSON response');
      }
    } else {
      console.log('❌ Failed to edit booking');
    }
    
  } catch (error) {
    console.error('Error editing booking:', error);
  }
}

testEditBookingWithDemoService();