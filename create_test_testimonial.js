import GoogleSheetsService from './server/src/services/googleSheetsService.js'

async function createTestTestimonial() {
  try {
    // Initialize Google Sheets service first
    console.log('Initializing Google Sheets service...')
    await GoogleSheetsService.initialize()
    
    // Test testimonial data matching the expected structure
    const testTestimonial = [
      'test-001',                    // id
      'Test Client',                 // name
      '5',                           // rating
      'Excelent serviciu! Mașina mea arată ca nouă după detalierea premium. Personal profesionist și rezultate deosebite.', // text
      '2025-11-20',                  // date
      'Premium Auto Detailing'       // service
    ]

    console.log('Creating test testimonial in Google Sheets...')
    
    // Append the test testimonial to the Testimonials sheet
    const result = await GoogleSheetsService.appendData('Testimonials', testTestimonial)
    
    console.log('✅ Test testimonial created successfully!')
    console.log('Testimonial data:', {
      id: testTestimonial[0],
      name: testTestimonial[1],
      rating: testTestimonial[2],
      text: testTestimonial[3],
      date: testTestimonial[4],
      service: testTestimonial[5]
    })
    console.log('Google Sheets API response:', result)
    
  } catch (error) {
    console.error('❌ Error creating test testimonial:', error)
    console.error('Error details:', error.message)
    if (error.response) {
      console.error('API Response:', error.response.data)
    }
  }
}

// Run the function
createTestTestimonial()