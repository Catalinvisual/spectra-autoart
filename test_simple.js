// Simple test to check deletion process step by step
import axios from 'axios'

async function testDeletionSimple() {
  try {
    console.log('🧪 Testing image deletion workflow (simple version)...')
    
    // Get gallery
    console.log('📸 Fetching gallery...')
    const galleryResponse = await axios.get('http://localhost:8080/api/public/gallery')
    const images = galleryResponse.data.data || []
    
    console.log(`📊 Found ${images.length} images`)
    
    if (images.length === 0) {
      console.log('⚠️ No images to test')
      return
    }
    
    const testImage = images[0]
    console.log('🎯 Testing with image:', testImage.id)
    
    // Login
    console.log('🔑 Logging in...')
    const loginResponse = await axios.post('http://localhost:8080/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    })
    
    const token = loginResponse.data.token
    console.log('✅ Got token')
    
    // Delete
    console.log('🗑️ Deleting image...')
    const deleteResponse = await axios.delete(`http://localhost:8080/api/admin/gallery/${testImage.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    console.log('✅ Delete response:', deleteResponse.data)
    
    // Wait and check
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('🔍 Checking gallery again...')
    const checkResponse = await axios.get('http://localhost:8080/api/public/gallery')
    const remainingImages = checkResponse.data.data || []
    
    const stillExists = remainingImages.some(img => img.id === testImage.id)
    console.log(stillExists ? '❌ Image still exists' : '✅ Image deleted')
    console.log(`📊 Before: ${images.length}, After: ${remainingImages.length}`)
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message)
  }
}

testDeletionSimple()