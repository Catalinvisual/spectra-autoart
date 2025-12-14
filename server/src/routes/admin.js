import express from 'express'
const router = express.Router()
import GoogleSheetsService from '../services/googleSheetsService.js'
import requireAuth from '../middleware/auth.js'


// Get all bookings
router.get('/bookings', requireAuth, async (req, res) => {
  try {
    console.log('📋 Fetching bookings from Google Sheets...')
    let data = await GoogleSheetsService.getData('Bookings')
    
    if (data.length <= 1) {
      console.log('⚠️  No bookings found in Google Sheets, returning empty array')
      return res.json([])
    }

    const headers = Array.isArray(data[0]) ? data[0] : []
    console.log('📊 Headers found:', headers)
    
    const findCol = (...names) => {
      const lowered = headers.map(h => String(h || '').toLowerCase())
      for (const n of names) {
        const idx = lowered.indexOf(String(n).toLowerCase())
        if (idx !== -1) return idx
      }
      for (let i = 0; i < lowered.length; i++) {
        for (const n of names) {
          if (lowered[i].includes(String(n).toLowerCase())) return i
        }
      }
      return -1
    }

    const idIndex = findCol('ID') !== -1 ? findCol('ID') : 0
    const nameIndex = findCol('Name','Customer_Name','Client_Name') !== -1 ? findCol('Name','Customer_Name','Client_Name') : 1
    const emailIndex = findCol('Email') !== -1 ? findCol('Email') : 2
    const phoneIndex = findCol('Phone') !== -1 ? findCol('Phone') : 3
    const dateIndex = findCol('Date') !== -1 ? findCol('Date') : 4
    const timeIndex = findCol('Time') !== -1 ? findCol('Time') : 5
    const servicesIndex = findCol('Services','Service','Diensten') !== -1 ? findCol('Services','Service','Diensten') : 6
    const totalIndex = findCol('Total','Amount') !== -1 ? findCol('Total','Amount') : 7
    const statusIndex = findCol('Status') !== -1 ? findCol('Status') : 8
    const createdAtIndex = findCol('Created_At','Created At') !== -1 ? findCol('Created_At','Created At') : 9

    const bookings = data.slice(1).map((row, index) => {
      const id = row[idIndex] || ''
      
      // Skip rows with empty IDs (cleared duplicates)
      if (!id) {
        return null
      }
      const name = row[nameIndex] || ''
      const email = row[emailIndex] || ''
      const phone = row[phoneIndex] || ''
      const date = row[dateIndex] || ''
      const time = row[timeIndex] || ''
      const servicesString = row[servicesIndex] || ''
      const totalRaw = row[totalIndex] || '0'
      const status = row[statusIndex] || 'pending'
      const createdAt = row[createdAtIndex] || new Date().toISOString()
      
      let total = 0
      if (typeof totalRaw === 'number') {
        total = totalRaw
      } else if (typeof totalRaw === 'string') {
        const parsed = parseFloat(totalRaw)
        total = isNaN(parsed) ? 0 : parsed
      }

      let servicesArr = []
      if (servicesString && typeof servicesString === 'string') {
        const cleanServices = servicesString.replace(/^'/,'').replace(/'$/,'').trim()
        let tokens = []
        if (cleanServices.startsWith('[')) {
          try {
            servicesArr = JSON.parse(cleanServices)
          } catch {
            tokens = cleanServices.replace(/[\[\]']/g,'').split(',').map(s => s.trim()).filter(Boolean)
            servicesArr = tokens.map(t => ({ name: t, price: 0 }))
          }
        } else {
          tokens = cleanServices.split(',').map(s => s.trim()).filter(Boolean)
          servicesArr = tokens.map(t => {
            const parts = t.split(':')
            return { name: parts[0] || t, price: parts[1] ? parseFloat(parts[1]) : 0 }
          })
        }
      }

      return {
        id,
        date: date && date.includes('T') ? date : (date ? `${date}T${time || '00:00:00'}` : ''),
        time: time || '',
        make: '',
        model: '',
        type: '',
        body: '',
        services: servicesArr,
        total,
        user: { name, email, phone },
        newsletter: false,
        locale: '',
        status: status || 'pending',
        createdAt: createdAt || new Date().toISOString()
      }
    }).filter(Boolean) // Remove null entries (cleared duplicates)

    console.log(`✅ Successfully fetched ${bookings.length} bookings`)
    res.json(bookings)
  } catch (error) {
    console.error('Bookings error:', error)
    res.status(500).json({ error: 'Failed to load bookings' })
  }
})

// Update booking
router.patch('/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { status, date, time, make, model, body, type } = req.body
    console.log(`📝 PATCH request received for booking ${id}`)
    console.log(`📅 Request body:`, { status, date, time, make, model, body, type })
    
    await GoogleSheetsService.ensureSheetColumns('Bookings', ['Make','Model','Type','Body'])
    let data = await GoogleSheetsService.getData('Bookings')
    
    if (data.length <= 1) {
      return res.status(404).json({ error: 'Nu există programări' })
    }

    const headers = Array.isArray(data[0]) ? data[0] : []
    const findCol = (...names) => {
      const lowered = headers.map(h => String(h || '').toLowerCase())
      for (const n of names) {
        const idx = lowered.indexOf(String(n).toLowerCase())
        if (idx !== -1) return idx
      }
      for (let i = 0; i < lowered.length; i++) {
        for (const n of names) {
          if (lowered[i].includes(String(n).toLowerCase())) return i
        }
      }
      return -1
    }

    const idIndex = findCol('ID') !== -1 ? findCol('ID') : 0
    const nameIndex = findCol('Name','Customer_Name','Client_Name') !== -1 ? findCol('Name','Customer_Name','Client_Name') : 1
    const emailIndex = findCol('Email') !== -1 ? findCol('Email') : 2
    const phoneIndex = findCol('Phone') !== -1 ? findCol('Phone') : 3
    const dateIndex = findCol('Date') !== -1 ? findCol('Date') : 4
    const timeIndex = findCol('Time') !== -1 ? findCol('Time') : 5
    const servicesIndex = findCol('Services','Service','Diensten') !== -1 ? findCol('Services','Service','Diensten') : 6
    const totalIndex = findCol('Total','Amount') !== -1 ? findCol('Total','Amount') : 7
    const statusIndex = findCol('Status') !== -1 ? findCol('Status') : 8
    const createdAtIndex = findCol('Created_At','Created At') !== -1 ? findCol('Created_At','Created At') : 9
    const makeIndex = findCol('Make','Marca','Vehicle_Make')
    const modelIndex = findCol('Model','Vehicle_Model')
    const typeIndex = findCol('Type','Vehicle_Type')
    const bodyIndex = findCol('Body','Caroserie','Body_Type')

    const targetId = String(id).trim()
    
    // Find the LAST occurrence of the ID (to handle duplicates)
    const allMatchingRows = data.slice(1).map((row, index) => ({ 
      row, 
      originalIndex: index + 1 
    })).filter(item => String(item.row[idIndex] || '').trim() === targetId)
    
    if (allMatchingRows.length === 0) {
      return res.status(404).json({ error: 'Programarea nu a fost găsită' })
    }
    
    // Use the last (most recent) occurrence
    const actualRowIndex = allMatchingRows[allMatchingRows.length - 1].originalIndex
    console.log(`🔍 DEBUG: Row index in data array: ${actualRowIndex}`)

    // Update the values
    if (status !== undefined) data[actualRowIndex][statusIndex] = status
    if (date !== undefined) {
      const cleanDate = date && date.includes('T') ? date.split('T')[0] : date
      data[actualRowIndex][dateIndex] = cleanDate
    }
    if (time !== undefined) data[actualRowIndex][timeIndex] = time
    if (make !== undefined && makeIndex !== -1) data[actualRowIndex][makeIndex] = make
    if (model !== undefined && modelIndex !== -1) data[actualRowIndex][modelIndex] = model
    if (type !== undefined && typeIndex !== -1) data[actualRowIndex][typeIndex] = type
    if (body !== undefined && bodyIndex !== -1) data[actualRowIndex][bodyIndex] = body

    // Convert array data to object format for Google Sheets service
    const updateData = {
      'ID': data[actualRowIndex][idIndex] || '',
      'Name': data[actualRowIndex][nameIndex] || '',
      'Email': data[actualRowIndex][emailIndex] || '',
      'Phone': data[actualRowIndex][phoneIndex] || '',
      'Date': data[actualRowIndex][dateIndex] || '',
      'Time': data[actualRowIndex][timeIndex] || '',
      'Services': data[actualRowIndex][servicesIndex] || '',
      'Total': data[actualRowIndex][totalIndex] || '',
      'Status': data[actualRowIndex][statusIndex] || '',
      'Created At': data[actualRowIndex][createdAtIndex] || ''
    }

    await GoogleSheetsService.updateData('Bookings', actualRowIndex, updateData)
    console.log(`✅ Booking ${id} updated successfully`)
    
    // Clean up duplicate rows - clear their IDs to hide them
    if (allMatchingRows.length > 1) {
      console.log(`🧹 Cleaning up ${allMatchingRows.length - 1} duplicate rows...`)
      // Clear duplicate rows (all except the last one we just updated)
      const rowsToClear = allMatchingRows.slice(0, -1).map(item => item.originalIndex)
      
      for (const rowIndexToClear of rowsToClear) {
        try {
          // Clear the ID field to make the row effectively invisible
          const clearData = { 'ID': '' }
          await GoogleSheetsService.updateData('Bookings', rowIndexToClear, clearData)
          console.log(`🗑️  Cleared duplicate row at index ${rowIndexToClear}`)
        } catch (clearError) {
          console.log(`⚠️  Could not clear duplicate row at index ${rowIndexToClear}: ${clearError.message}`)
        }
      }
    }

    // Return updated booking data
    const updatedBooking = {
      id,
      date: data[actualRowIndex][dateIndex],
      time: data[actualRowIndex][timeIndex],
      status: data[actualRowIndex][statusIndex],
      make: makeIndex !== -1 ? data[actualRowIndex][makeIndex] : '',
      model: modelIndex !== -1 ? data[actualRowIndex][modelIndex] : '',
      type: typeIndex !== -1 ? data[actualRowIndex][typeIndex] : '',
      body: bodyIndex !== -1 ? data[actualRowIndex][bodyIndex] : ''
    }

    res.json(updatedBooking)
  } catch (error) {
    console.error('Update booking error:', error)
    res.status(500).json({ error: 'Failed to update booking', details: error.message })
  }
})

export default router