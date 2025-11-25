import GoogleSheetsService from '../src/services/googleSheetsService.js'

async function migrateGalleryStructure() {
  try {
    console.log('🔄 Începerea migrării structurii Gallery...')
    
    // Obține datele existente
    const existingData = await GoogleSheetsService.getData('Gallery')
    
    if (existingData.length <= 1) {
      console.log('⚠️ Nu există date de migrat')
      return
    }
    
    console.log(`📊 Găsite ${existingData.length - 1} înregistrări de migrat`)
    
    // Creează structura nouă cu anteturi corecte
    const newData = [
      ['ID', 'Title', 'Description', 'Image_URL', 'Category', 'Active', 'Upload_Date']
    ]
    
    // Mapează datele existente la noua structură
    const headers = existingData[0]
    const oldRows = existingData.slice(1)
    
    oldRows.forEach((row, index) => {
      const oldItem = {}
      headers.forEach((header, i) => {
        oldItem[header.toLowerCase().replace(/ /g, '_')] = row[i] || ''
      })
      
      // Convertește la noua structură
      const newRow = [
        oldItem.id || Date.now().toString() + index,  // ID
        oldItem.title || oldItem.alt_text || '',     // Title
        oldItem.description || oldItem.alt_text || '', // Description
        oldItem.image_url || oldItem.url || '',      // Image_URL
        oldItem.category || 'general',               // Category
        oldItem.active || 'true',                     // Active
        oldItem.upload_date || oldItem.created_date || new Date().toISOString() // Upload_Date
      ]
      
      newData.push(newRow)
    })
    
    // Șterge datele vechi și adaugă cele noi
    console.log('🗑️  Ștergerea datelor vechi...')
    await GoogleSheetsService.clearData('Gallery')
    
    console.log('✅ Adăugarea datelor migrate...')
    for (const row of newData) {
      await GoogleSheetsService.appendData('Gallery', row)
    }
    
    console.log('🎉 Migrare completă! Structura a fost actualizată.')
    console.log('📋 Noua structură conține coloanele: ID, Title, Description, Image_URL, Category, Active, Upload_Date')
    
  } catch (error) {
    console.error('❌ Eroare la migrare:', error.message)
  }
}

// Rulează migrarea
migrateGalleryStructure()