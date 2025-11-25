// Test script pentru a verifica detectarea limbii și salvarea corectă
async function testTestimonialAPI() {
  const baseUrl = 'http://localhost:8080/api/public/testimonials';
  
  const testCases = [
    {
      name: 'Test Română',
      data: {
        name: 'Maria Ionescu',
        rating: 5,
        comment: 'Un serviciu extraordinar! Sunt foarte mulțumită de rezultat.'
      },
      expectedColumn: 'Comment_RO'
    },
    {
      name: 'Test Engleză', 
      data: {
        name: 'Sarah Johnson',
        rating: 4,
        comment: 'Great service! Very professional and efficient.'
      },
      expectedColumn: 'Comment_EN'
    },
    {
      name: 'Test Olandeză',
      data: {
        name: 'Pieter van der Berg',
        rating: 5,
        comment: 'Uitstekende service! Zeer professioneel en vriendelijk.'
      },
      expectedColumn: 'Comment_NL'
    }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`\n🧪 Testing: ${testCase.name}`);
      console.log(`📝 Comment: ${testCase.data.comment}`);
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      });
      
      const result = await response.json();
      console.log(`✅ Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`📍 Expected column: ${testCase.expectedColumn}`);
      
      if (!result.success) {
        console.log(`❌ Error: ${result.error}`);
      }
      
    } catch (error) {
      console.log(`❌ API Error: ${error.message}`);
    }
  }
}

// Rulează testul
testTestimonialAPI();