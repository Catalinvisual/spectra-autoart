// Test pentru a crea un booking cu serviciul Premium Wash (ID: 1) din demo data
async function testCreateBookingWithDemoService() {
  const bookingData = {
    name: "Test User",
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
    console.log('Creating booking with data:', JSON.stringify(bookingData, null, 2));
    
    const response = await fetch('http://localhost:3001/api/admin/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ADMIN_TOKEN || 'admin-token'}`,
        'X-Admin-Key': 'admin123'
      },
      body: JSON.stringify(bookingData)
    });

    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', text.substring(0, 500));
    
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Booking created:', data);
        
        if (data.booking) {
          console.log('Booking ID:', data.booking.id);
          console.log('Services:', data.booking.services);
          console.log('Price:', data.booking.price);
          console.log('Make:', data.booking.make);
          console.log('Model:', data.booking.model);
          console.log('Body:', data.booking.body);
        }
      } catch (parseError) {
        console.log('Could not parse JSON response');
      }
    } else {
      console.log('❌ Failed to create booking');
    }
    
  } catch (error) {
    console.error('Error creating booking:', error);
  }
}

testCreateBookingWithDemoService();