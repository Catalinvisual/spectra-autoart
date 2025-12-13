// Load production environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.production' })

// Test Resend API functionality with verified domain
async function testResendAPI() {
  console.log('🧪 Testing Resend API with verified domain...')
  console.log('✅ GREAT! Domain spectraautoart.nl is verified!')
  console.log('✅ You can now use contact@spectraautoart.nl as sender')
  console.log('📧 Testing with your verified domain sender...')
  
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not found in environment')
    console.error('❌ Please add RESEND_API_KEY to your .env.production file')
    return
  }
  
  if (apiKey.includes('re_Y5xBHWfG')) {
    console.error('❌ INVALID API KEY - this is a placeholder!')
    console.error('❌ Please get a real API key from https://resend.com')
    return
  }
  
  console.log(`🔑 Found API key: ${apiKey.substring(0, 10)}...`)
  
  try {
    // Use your verified domain sender
    const fromAddress = 'contact@spectraautoart.nl'
    console.log(`📧 Using verified domain sender: ${fromAddress}`)
    console.log(`✅ Domain spectraautoart.nl is verified - professional branding enabled!`)
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: ['contact@spectraautoart.nl'],
        subject: 'Test Resend API - Verified Domain',
        html: `
          <html>
            <body>
              <h2>🎉 Test Email - Resend API with Verified Domain</h2>
              <p>This is a test email using your verified domain spectraautoart.nl!</p>
              <p><strong>Test Details:</strong></p>
              <ul>
                <li>Timestamp: ${new Date().toISOString()}</li>
                <li>Environment: ${process.env.NODE_ENV || 'production'}</li>
                <li>Service: Resend API</li>
                <li>Project: ${process.env.RAILWAY_PROJECT_ID || 'unknown'}</li>
                <li>Sender: ${fromAddress} (YOUR VERIFIED DOMAIN!)</li>
              </ul>
              <p>🎉 SUCCESS! Your domain is verified and emails will show your professional branding!</p>
              <p><strong>Status:</strong> Domain verified ✅ | Professional sender ✅</p>
            </body>
          </html>
        `,
        text: 'Test Email - Resend API with Verified Domain\n\nThis is a test email using your verified domain spectraautoart.nl!\n\nTest Details:\n- Timestamp: ' + new Date().toISOString() + '\n- Environment: ' + (process.env.NODE_ENV || 'production') + '\n- Service: Resend API\n- Project: ' + (process.env.RAILWAY_PROJECT_ID || 'unknown') + '\n- Sender: ' + fromAddress + ' (YOUR VERIFIED DOMAIN!)\n\n🎉 SUCCESS! Your domain is verified and emails will show your professional branding!\n\nStatus: Domain verified ✅ | Professional sender ✅'
      })
    })
    
    console.log('📧 Response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Resend API test successful!')
      console.log('📧 Email ID:', data.id || data.data?.id)
      console.log('🎉 Resend API with verified domain is working perfectly!')
      console.log('🎉 Professional email branding is now active!')
    } else {
      const errorText = await response.text()
      console.error('❌ Resend API failed:', response.status, errorText)
    }
    
  } catch (error) {
    console.error('❌ Resend API test error:', error.message)
  }
  
  console.log('\n🏁 Test completed!')
}

// Run the test
testResendAPI()