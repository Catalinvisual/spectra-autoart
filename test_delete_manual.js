// Test manual pentru ștergere imagine - să rulezi în browser console
// Deschide http://localhost:5174/admin și rulează în console:

async function testDeleteImage() {
    try {
        // Login
        console.log('🔐 Login admin...');
        const loginResponse = await fetch('http://localhost:8080/api/admin/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: "admin@example.com",
                password: "password123"
            })
        });
        
        const loginData = await loginResponse.json();
        console.log('✅ Login response:', loginData);
        
        if (!loginData.token) {
            throw new Error('Token not received');
        }
        
        const token = loginData.token;
        
        // Test delete
        console.log('🗑️ Testing delete with correct route...');
        const imageId = "samples/animals/cat";
        const encodedId = encodeURIComponent(imageId);
        
        console.log(`📤 Delete request for: ${imageId} (encoded: ${encodedId})`);
        
        const deleteResponse = await fetch(`http://localhost:8080/api/admin/gallery/${encodedId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('📊 Response status:', deleteResponse.status);
        
        if (deleteResponse.ok) {
            const result = await deleteResponse.json();
            console.log('✅ Delete successful:', result);
        } else {
            const errorText = await deleteResponse.text();
            console.log('❌ Delete failed:', errorText);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Rulează testul
testDeleteImage();