// Test script to verify the deletion fix - with proper auth
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/admin/gallery'

async function testDeletion() {
  try {
    console.log('🧪 Testing image deletion workflow...')
    
    // First, let's get the current gallery to see what images are available
    console.log('📸 Fetching current gallery...')
    const galleryResponse = await axios.get('http://localhost:8080/api/public/gallery')
    const images = galleryResponse.data.data || []
    
    console.log(`📊 Found ${images.length} images in gallery`)
    
    if (images.length === 0) {
      console.log('⚠️ No images found in gallery to test deletion')
      return
    }
    
    // Get the first image to test deletion
    const testImage = images[0]
    console.log('🎯 Testing deletion with image:', {
      id: testImage.id,
      title: testImage.title,
      image_url: testImage.image_url
    })
    
    // First, let's try to login to get a valid token
    console.log('🔑 Attempting to get admin token...')
    try {
      const loginResponse = await axios.post('http://localhost:8080/api/admin/login', {
        username: 'admin',
        password: 'admin123'
      })
      
      const token = loginResponse.data.token
      console.log('✅ Got admin token')
      
      // Attempt deletion with proper token
      console.log('🗑️ Attempting to delete image...')
      const deleteResponse = await axios.delete(`${API_URL}/${testImage.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('✅ Deletion response:', deleteResponse.data)
      
      // Wait a moment for the deletion to process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verify the image is actually deleted by checking gallery again
      console.log('🔍 Verifying deletion...')
      const verifyResponse = await axios.get('http://localhost:8080/api/public/gallery')
      const remainingImages = verifyResponse.data.data || []
      
      const imageStillExists = remainingImages.some(img => img.id === testImage.id)
      
      if (imageStillExists) {
        console.log('❌ Image still exists in gallery after deletion')
      } else {
        console.log('✅ Image successfully removed from gallery')
      }
      
      console.log(`📊 Gallery now has ${remainingImages.length} images (was ${images.length})`)
      
    } catch (authError) {
      console.error('❌ Authentication failed:', authError.response?.data || authError.message)
      console.log('🔄 Trying deletion without authentication to test the route...')
      
      // Try deletion without auth (will fail but we can see the error)
      try {
        await axios.delete(`${API_URL}/${testImage.id}`)
      } catch (deleteError) {
        console.log('🗑️ Deletion route response (expected auth error):', deleteError.response?.data)
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message)
  }
}

testDeletion()