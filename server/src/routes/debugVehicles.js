import { Router } from 'express'
import GoogleSheetsService from '../services/googleSheetsService.js'

const router = Router()

// Debug endpoint to check Google Sheets Vehicles data
router.get('/debug/vehicles', async (req, res) => {
  try {
    console.log('🔍 Debug: Checking Google Sheets Vehicles data...')
    
    const data = await GoogleSheetsService.getData('Vehicles')
    console.log(`📊 Total rows: ${data.length}`)
    
    if (data.length === 0) {
      return res.json({ 
        success: true, 
        message: 'No data in Vehicles sheet',
        data: []
      })
    }
    
    const headers = data[0]
    console.log('📋 Headers:', headers)
    
    // Check column indices
    const idIndex = headers.indexOf('ID')
    const makeIndex = headers.indexOf('Make')
    const modelIndex = headers.indexOf('Model')
    const typeIndex = headers.indexOf('Type')
    const bodyIndex = headers.indexOf('Body')
    
    console.log(`🔍 Column indices - ID:${idIndex}, Make:${makeIndex}, Model:${modelIndex}, Type:${typeIndex}, Body:${bodyIndex}`)
    
    // Check first 5 data rows
    const sampleData = data.slice(1, 6).map((row, index) => ({
      rowNumber: index + 2,
      id: row[idIndex],
      make: row[makeIndex],
      model: row[modelIndex],
      type: row[typeIndex],
      body: row[bodyIndex]
    }))
    
    console.log('📋 Sample data:', sampleData)
    
    // Count valid vehicles
    let validVehicles = 0
    let invalidRows = []
    
    data.slice(1).forEach((row, index) => {
      const make = row[makeIndex]
      const model = row[modelIndex]
      if (make && model && make.trim() && model.trim()) {
        validVehicles++
      } else {
        invalidRows.push(index + 2)
      }
    })
    
    console.log(`✅ Found ${validVehicles} valid vehicles out of ${data.length - 1} total rows`)
    if (invalidRows.length > 0) {
      console.log(`⚠️  Invalid rows: ${invalidRows.slice(0, 10).join(', ')}${invalidRows.length > 10 ? '...' : ''}`)
    }
    
    return res.json({ 
      success: true, 
      totalRows: data.length,
      headers: headers,
      columnIndices: {
        id: idIndex,
        make: makeIndex,
        model: modelIndex,
        type: typeIndex,
        body: bodyIndex
      },
      validVehicles: validVehicles,
      sampleData: sampleData
    })
    
  } catch (error) {
    console.error('❌ Debug error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router