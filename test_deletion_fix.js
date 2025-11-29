// Test script to verify the deletion fix
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/admin/gallery'

async function testDeletion() {
  try {
    console.log('🧪 Testing image deletion workflow...')
    
    // First, let's get the current gallery to see what images are available
    console.log('📸 Fetching current gallery...')
    const galleryResponse = await axios.get('http://localhost:8080/api/public/gallery')
    const images = galleryResponse.data
    
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
    
    // Attempt deletion
    console.log('🗑️ Attempting to delete image...')
    const deleteResponse = await axios.delete(`${API_URL}/${testImage.id}`, {
      headers: {
        'Authorization': 'Bearer test-token' // This might need to be a real token
      }
    })
    
    console.log('✅ Deletion response:', deleteResponse.data)
    
    // Verify the image is actually deleted by checking gallery again
    console.log('🔍 Verifying deletion...')
    const verifyResponse = await axios.get('http://localhost:8080/api/public/gallery')
    const remainingImages = verifyResponse.data
    
    const imageStillExists = remainingImages.some(img => img.id === testImage.id)
    
    if (imageStillExists) {
      console.log('❌ Image still exists in gallery after deletion')
    } else {
      console.log('✅ Image successfully removed from gallery')
    }
    
    console.log(`📊 Gallery now has ${remainingImages.length} images (was ${images.length})`)
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message)
  }
}

testDeletion()