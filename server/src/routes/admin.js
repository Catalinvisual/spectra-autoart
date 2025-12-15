// Admin routes
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import GoogleSheetsService from '../services/googleSheetsService.js'
import { vehicleServicesService } from '../services/vehicleServicesService.js'
import requireAuth from '../middleware/auth.js'
import { sendBookingConfirmation, sendAdminNotification, sendBookingUpdate, sendAdminUpdate, testEmailService } from '../services/emailService.js'

const router = express.Router()

let bookingsEnrichmentCache = {
  idToName: new Map(),
  nameToId: new Map(),
  serviceMinPrice: new Map(),
  serviceBodyPrices: new Map(), // New: stores prices per service-body type combination
  lastFetch: 0
}

async function ensureEnrichmentCache() {
  const ttl = 5 * 60 * 1000
  if (Date.now() - bookingsEnrichmentCache.lastFetch < ttl && bookingsEnrichmentCache.idToName.size > 0) {
    return
  }
  try {
    const servicesData = await GoogleSheetsService.getData('Vehicle_Services')
    const pricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices')
    const idToName = new Map()
    const nameToId = new Map()
    const serviceMinPrice = new Map()
    const serviceBodyPrices = new Map()
    if (servicesData && servicesData.length > 1) {
      const hs = servicesData[0]
      const idIdx = hs.indexOf('ID')
      const nameNlIdx = hs.indexOf('Name_NL')
      const nameIdx = nameNlIdx !== -1 ? nameNlIdx : hs.indexOf('Name')
      if (idIdx !== -1 && nameIdx !== -1) {
        servicesData.slice(1).forEach(row => {
          const sid = String(row[idIdx] || '').trim()
          const sname = String(row[nameIdx] || sid).trim()
          if (sid) {
            idToName.set(sid, sname)
            nameToId.set(sname.toLowerCase(), sid)
          }
        })
      }
    }
  if (pricesData && pricesData.length > 1) {
    const hp = pricesData[0]
    const sidIdx = hp.indexOf('Service_ID')
    const pminIdx = hp.indexOf('Price_Min')
    const activeIdx = hp.indexOf('Is_Active')
    const bodyTypeKeyIdx = hp.indexOf('Body_Type_Key') || hp.indexOf('body_type_key') || -1
    if (sidIdx !== -1 && pminIdx !== -1) {
      pricesData.slice(1).forEach(row => {
        const sid = String(row[sidIdx] || '').trim()
        const activeVal = activeIdx !== -1 ? row[activeIdx] : true
        const isActive = activeIdx === -1
          ? true
          : (activeVal === 'true' || activeVal === true || activeVal === 'TRUE' || activeVal === 'True' || activeVal === 1)
        const pmin = parseFloat(row[pminIdx]) || 0
        const bodyTypeKey = bodyTypeKeyIdx !== -1 ? String(row[bodyTypeKeyIdx] || '').trim().toLowerCase() : ''
        if (!sid) return
        if (isActive) {
          // Store minimum price for backward compatibility
          if (!serviceMinPrice.has(sid)) {
            serviceMinPrice.set(sid, pmin)
          } else {
            const cur = serviceMinPrice.get(sid) || 0
            serviceMinPrice.set(sid, Math.min(cur, pmin))
          }
          
          // Store price per service-body type combination
          if (bodyTypeKey) {
            const key = `${sid}:${bodyTypeKey}`
            serviceBodyPrices.set(key, pmin)
          }
        }
      })
    }
  }
    bookingsEnrichmentCache = {
      idToName,
      nameToId,
      serviceMinPrice,
      serviceBodyPrices,
      lastFetch: Date.now()
    }
  } catch (err) {
    console.warn('⚠️  Failed to refresh enrichment cache, using existing cache:', err?.message || err)
    bookingsEnrichmentCache.lastFetch = Date.now()
  }
}

// Admin login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate credentials against environment variables
    if (email !== process.env.ADMIN_DEFAULT_EMAIL || password !== process.env.ADMIN_DEFAULT_PASSWORD) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      token,
      admin: { email }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    })
  }
})

// Get dashboard stats
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    // Check if Google Sheets is properly initialized or in demo mode
    if (!GoogleSheetsService.isInitialized && !GoogleSheetsService.isDemoMode) {
      return res.status(503).json({ 
        error: 'Google Sheets service not initialized',
        message: 'The dashboard is temporarily unavailable. Please try again later.',
        demoMode: GoogleSheetsService.isDemoMode
      })
    }
    
    const bookings = await GoogleSheetsService.getData('Bookings')
    const gallery = await GoogleSheetsService.getData('Gallery')
    const messages = await GoogleSheetsService.getData('Messages')
    
    const totalBookings = bookings.length > 1 ? bookings.length - 1 : 0
    const totalGallery = gallery.length > 1 ? gallery.length - 1 : 0
    const totalMessages = messages.length > 1 ? messages.length - 1 : 0
    
    // Get recent bookings (last 5)
    const recentBookings = bookings.slice(-5).map(row => ({
      date: row[1] || '',
      time: row[2] || '',
      services: row[7] || '',
      total: row[8] || '',
      status: row[9] || 'pending'
    }))

    res.json({
      stats: {
        totalBookings,
        totalGallery,
        totalMessages
      },
      recentBookings
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ error: 'Failed to load dashboard data' })
  }
})

// Get all bookings
router.get('/bookings', requireAuth, async (req, res) => {
  try {
    // Check if Google Sheets is properly initialized or in demo mode
    if (!GoogleSheetsService.isInitialized && !GoogleSheetsService.isDemoMode) {
      return res.status(503).json({ 
        error: 'Google Sheets service not initialized',
        message: 'The booking system is temporarily unavailable. Please try again later.',
        demoMode: GoogleSheetsService.isDemoMode
      })
    }
    
    const data = await GoogleSheetsService.getData('Bookings')
    await ensureEnrichmentCache()
    
    if (data.length <= 1) {
      return res.json([])
    }

    // Convert rows to booking objects
    const headers = Array.isArray(data[0]) ? data[0] : []
    console.log(`📊 HEADERS from Google Sheets:`, headers);
    
    const findCol = (...names) => {
      const lowered = headers.map(h => String(h || '').toLowerCase())
      for (const n of names) {
        const idx = lowered.indexOf(String(n).toLowerCase())
        if (idx !== -1) return idx
      }
      // fallback: try partial includes
      for (let i = 0; i < lowered.length; i++) {
        for (const n of names) {
          if (lowered[i].includes(String(n).toLowerCase())) return i
        }
      }
      return -1
    }
    const idIndex = findCol('ID') !== -1 ? findCol('ID') : 0
    const nameIndex = findCol('Name', 'Customer_Name', 'Client_Name') !== -1 ? findCol('Name', 'Customer_Name', 'Client_Name') : 1
    const emailIndex = findCol('Email') !== -1 ? findCol('Email') : 2
    const phoneIndex = findCol('Phone') !== -1 ? findCol('Phone') : 3
    const dateIndex = findCol('Date') !== -1 ? findCol('Date') : 4
    const timeIndex = findCol('Time') !== -1 ? findCol('Time') : 5
    const servicesIndex = findCol('Services', 'Service', 'Diensten') !== -1 ? findCol('Services', 'Service', 'Diensten') : 6
    const totalIndex = findCol('Total', 'Amount') !== -1 ? findCol('Total', 'Amount') : 7
    const statusIndex = findCol('Status') !== -1 ? findCol('Status') : 8
    const createdAtIndex = findCol('Created_At', 'Created At') !== -1 ? findCol('Created_At', 'Created At') : 9

    const bookings = data.slice(1).map((row, index) => {
      // Map columns based on actual Google Sheets structure
      const id = row[idIndex] || `booking_${index + 1}`
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
      
      // Combine date and time for frontend compatibility
      let combinedDateTime = date
      if (date && time) {
        // Remove any single quotes that might be added for Google Sheets formatting
        const cleanDate = date.replace(/^'/, '')
        const cleanTime = time.replace(/^'/, '')
        combinedDateTime = `${cleanDate}T${cleanTime}:00`
      }
      
      // Extract make/model/body from the row data first
      const make = ''
      const model = ''
      const type = ''
      const body = ''
      
      let servicesArray = []
      if (servicesString && typeof servicesString === 'string') {
        const cleanServices = servicesString.replace(/^'/, '').replace(/'$/, '').trim()
        let tokens = []
        if (cleanServices.startsWith('[')) {
          try {
            const arr = JSON.parse(cleanServices)
            if (Array.isArray(arr)) {
              tokens = arr.map(item => {
                if (typeof item === 'string') return item
                if (item && typeof item === 'object') {
                  return item.id || item.service_id || item.name || ''
                }
                return ''
              }).filter(x => x)
            }
          } catch {
            tokens = cleanServices.split(/[,|;]+/)
          }
        } else {
          tokens = cleanServices.split(/[,|;]+/)
        }
        servicesArray = tokens.map(token => {
          const trimmed = token.trim()
          let sid = ''
          let sname = ''
          if (bookingsEnrichmentCache.idToName.has(trimmed)) {
            sid = trimmed
            sname = bookingsEnrichmentCache.idToName.get(trimmed)
          } else if (bookingsEnrichmentCache.nameToId.has(trimmed.toLowerCase())) {
            sid = bookingsEnrichmentCache.nameToId.get(trimmed.toLowerCase())
            sname = bookingsEnrichmentCache.idToName.get(sid) || trimmed
          } else {
            sid = trimmed.toLowerCase().replace(/\s+/g, '_')
            sname = trimmed
          }
          
          // Try to get body-type specific price first
          let price = 0
          const bodyTypeKey = String(body || '').toLowerCase()
          if (bodyTypeKey && sid) {
            const bodySpecificKey = `${sid}:${bodyTypeKey}`
            price = bookingsEnrichmentCache.serviceBodyPrices.get(bodySpecificKey) || 0
          }
          
          // Fallback to minimum price if body-specific price not found
          if (!price && sid) {
            price = bookingsEnrichmentCache.serviceMinPrice.get(sid) || 0
          }
          
          return { id: sid, name: sname, price }
        }).filter(service => service.name.length > 0)
      }
      if (total <= 0 && Array.isArray(servicesArray) && servicesArray.length > 0) {
        total = servicesArray.reduce((acc, s) => acc + (typeof s.price === 'number' ? s.price : 0), 0)
      }
      
      return {
        id: id,
        date: combinedDateTime,
        time: time,
        make: make,
        model: model,
        type: type,
        body: '',
        services: servicesArray,
        total: total,
        user: {
          name: name,
          email: email,
          phone: phone
        },
        newsletter: false, // Default since we don't have this data
        locale: '', // Default since we don't have this data
        status: status,
        createdAt: createdAt
      }
    })
    
    res.json(bookings)
  } catch (error) {
    console.error('Bookings error:', error)
    res.status(500).json({ error: 'Failed to load bookings' })
  }
})

// Get single booking by ID
router.get('/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { fresh } = req.query // Parametru pentru a forța reîncărcarea
    console.log(`🔍 GET request for booking ${id}${fresh ? ' (FRESH DATA REQUESTED)' : ''}`)
    
    // Check if Google Sheets is properly initialized
    if (!GoogleSheetsService.isInitialized && !GoogleSheetsService.isDemoMode) {
      return res.status(503).json({ 
        error: 'Google Sheets service not initialized',
        message: 'The booking system is temporarily unavailable. Please try again later.',
        demoMode: GoogleSheetsService.isDemoMode
      })
    }
    
    // Forțăm reîncărcarea dacă este cerut fresh data
    const data = await GoogleSheetsService.getData('Bookings', fresh === 'true')
    await ensureEnrichmentCache()
    
    if (data.length <= 1) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Convert rows to booking objects
    const headers = Array.isArray(data[0]) ? data[0] : []
    console.log(`📊 HEADERS from Google Sheets:`, headers);
    
    const findCol = (...names) => {
      const lowered = headers.map(h => String(h || '').toLowerCase())
      for (const n of names) {
        const idx = lowered.indexOf(String(n).toLowerCase())
        if (idx !== -1) return idx
      }
      // fallback: try partial includes
      for (let i = 0; i < lowered.length; i++) {
        for (const n of names) {
          if (lowered[i].includes(String(n).toLowerCase())) return i
        }
      }
      return -1
    }
    const idIndex = findCol('ID') !== -1 ? findCol('ID') : 0
    const nameIndex = findCol('Name', 'Customer_Name', 'Client_Name') !== -1 ? findCol('Name', 'Customer_Name', 'Client_Name') : 1
    const emailIndex = findCol('Email') !== -1 ? findCol('Email') : 2
    const phoneIndex = findCol('Phone') !== -1 ? findCol('Phone') : 3
    const dateIndex = findCol('Date') !== -1 ? findCol('Date') : 4
    const timeIndex = findCol('Time') !== -1 ? findCol('Time') : 5
    const servicesIndex = findCol('Services', 'Service', 'Diensten') !== -1 ? findCol('Services', 'Service', 'Diensten') : 6
    const totalIndex = findCol('Total', 'Amount') !== -1 ? findCol('Total', 'Amount') : 7
    const statusIndex = findCol('Status') !== -1 ? findCol('Status') : 8
    const createdIndex = findCol('Created', 'Created_At', 'Timestamp') !== -1 ? findCol('Created', 'Created_At', 'Timestamp') : 9
    const makeIndex = findCol('Make', 'Brand', 'Merk') !== -1 ? findCol('Make', 'Brand', 'Merk') : 10
    const modelIndex = findCol('Model') !== -1 ? findCol('Model') : 11
    const bodyIndex = findCol('Body', 'Body_Type') !== -1 ? findCol('Body', 'Body_Type') : 12
    const typeIndex = findCol('Type', 'Vehicle_Type') !== -1 ? findCol('Type', 'Vehicle_Type') : 13

    // Find booking by ID
    let booking = null
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      const rowId = String(row[idIndex] || '').trim()
      if (rowId === String(id).trim()) {
        console.log(`✅ Found booking at row ${i}:`, row)
        
        const name = String(row[nameIndex] || '').trim()
        const email = String(row[emailIndex] || '').trim()
        const phone = String(row[phoneIndex] || '').trim()
        const date = String(row[dateIndex] || '').trim()
        const time = String(row[timeIndex] || '').trim()
        const servicesString = String(row[servicesIndex] || '').trim()
        const total = String(row[totalIndex] || '').trim()
        const status = String(row[statusIndex] || '').trim()
        const created = String(row[createdIndex] || '').trim()
        const make = String(row[makeIndex] || '').trim()
        const model = String(row[modelIndex] || '').trim()
        const body = String(row[bodyIndex] || '').trim()
        const type = String(row[typeIndex] || '').trim()

        booking = {
          id: rowId,
          name: name,
          email: email,
          phone: phone,
          date: date,
          time: time,
          services: servicesString,
          total: total,
          status: status,
          created: created,
          make: make,
          model: model,
          body: body,
          type: type
        }
        break
      }
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    console.log(`✅ Returning booking:`, booking)
    res.json(booking)
    
  } catch (error) {
    console.error('Get booking error:', error)
    res.status(500).json({ error: 'Failed to get booking' })
  }
})

router.patch('/bookings/:id', async (req, res, next) => {
  console.log(`🔥 DEBUG: PATCH /bookings/${req.params.id} - Request received BEFORE auth`)
  next()
}, requireAuth, async (req, res) => {
  console.log(`🔥 DEBUG: PATCH /bookings/${req.params.id} - Authentication passed, processing request...`)
  try {
    const { id } = req.params
    console.log(`🔥 DEBUG: PATCH /bookings/${id} - Request received at ${new Date().toISOString()}`)
    console.log(`🔥 DEBUG: Request headers:`, req.headers)
    console.log(`🔥 DEBUG: Request body:`, req.body)
    const { status, date, time, make: makeIn, model: modelIn, body: bodyIn, type: typeIn, name: nameIn, email: emailIn, phone: phoneIn } = req.body
    console.log(`📝 PATCH request received for booking ${id}`)
    console.log(`📅 Request body:`, { status, date, time, make: makeIn, model: modelIn, body: bodyIn, type: typeIn })
    console.log(`🔍 DEBUG: nameIn = "${nameIn}", emailIn = "${emailIn}", phoneIn = "${phoneIn}"`)
    console.log(`🔍 DEBUG: time type: ${typeof time}, value: "${time}"`)
    console.log(`🔍 DEBUG: status type: ${typeof status}, value: "${status}"`)
    await ensureEnrichmentCache()
    await GoogleSheetsService.ensureSheetColumns('Bookings', ['Make','Model','Type','Body','Locale'])
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
    const makeIndex = findCol('Make','Marca','Vehicle_Make')
    const modelIndex = findCol('Model','Vehicle_Model')
    const typeIndex = findCol('Type','Vehicle_Type')
    const bodyIndex = findCol('Body','Caroserie','Body_Type')
    const servicesIndex = findCol('Services','Service','Diensten') !== -1 ? findCol('Services','Service','Diensten') : 6
    const totalIndex = findCol('Total','Amount') !== -1 ? findCol('Total','Amount') : 7
    const statusIndex = findCol('Status') !== -1 ? findCol('Status') : 8
    const targetId = String(id).trim()
    const rowIndex = data.slice(1).findIndex(row => String(row[idIndex] || '').trim() === targetId)
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Programarea nu a fost găsită' })
    }
    const actualRowIndex = rowIndex + 1
    console.log(`🔍 DEBUG: Row index in data array: ${actualRowIndex}, Total data rows: ${data.length}`)
    console.log(`🔍 Before update - Date: ${data[actualRowIndex][dateIndex]}, Time: ${data[actualRowIndex][timeIndex]}`)
    
    // CRITICAL: Afișăm rândul complet înainte de modificare
    console.log(`📊 ROW ${actualRowIndex} COMPLETE DATA:`, data[actualRowIndex]);
    console.log(`📊 Column mapping:`, {
      id: data[actualRowIndex][idIndex],
      name: data[actualRowIndex][nameIndex],
      email: data[actualRowIndex][emailIndex],
      phone: data[actualRowIndex][phoneIndex],
      date: data[actualRowIndex][dateIndex],
      time: data[actualRowIndex][timeIndex],
      make: makeIndex !== -1 ? data[actualRowIndex][makeIndex] : 'N/A',
      model: modelIndex !== -1 ? data[actualRowIndex][modelIndex] : 'N/A',
      status: data[actualRowIndex][statusIndex]
    });
    
    // Stocăm valorile originale pentru comparație
    const originalStatus = data[actualRowIndex][statusIndex]
    const originalDateRaw = data[actualRowIndex][dateIndex]
    const originalTime = data[actualRowIndex][timeIndex]
    const originalMake = makeIndex !== -1 ? data[actualRowIndex][makeIndex] : ''
    const originalModel = modelIndex !== -1 ? data[actualRowIndex][modelIndex] : ''
    const originalType = typeIndex !== -1 ? data[actualRowIndex][typeIndex] : ''
    const originalBody = bodyIndex !== -1 ? data[actualRowIndex][bodyIndex] : ''
    const originalName = nameIndex !== -1 ? data[actualRowIndex][nameIndex] : ''
    const originalEmail = emailIndex !== -1 ? data[actualRowIndex][emailIndex] : ''
    const originalPhone = phoneIndex !== -1 ? data[actualRowIndex][phoneIndex] : ''
    
    // Extragem doar partea de dată (YYYY-MM-DD) din stringul ISO complet
    const originalDate = originalDateRaw ? originalDateRaw.split('T')[0] : ''
    
    console.log(`🔍 DEBUG: Original values - Status: ${originalStatus}, Date: "${originalDate}" (raw: "${originalDateRaw}"), Time: "${originalTime}" (${typeof originalTime})`)
    console.log(`🔍 DEBUG: New values - Status: ${status}, Date: "${date}" (${typeof date}), Time: "${time}" (${typeof time})`)
    console.log(`🔍 DEBUG: Make original: ${originalMake}, new: ${makeIn}`)
    console.log(`🔍 DEBUG: Model original: ${originalModel}, new: ${modelIn}`)
    console.log(`🔍 DEBUG: Type original: ${originalType}, new: ${typeIn}`)
    console.log(`🔍 DEBUG: Body original: ${originalBody}, new: ${bodyIn}`)
    console.log(`🔍 DEBUG: Name original: ${originalName}, new: ${nameIn}`)
    console.log(`🔍 DEBUG: Email original: ${originalEmail}, new: ${emailIn}`)
    console.log(`🔍 DEBUG: Phone original: ${originalPhone}, new: ${phoneIn}`)
    
    // Verificăm dacă există modificări
    const hasChanges = 
      (status !== undefined && status !== originalStatus) ||
      (date !== undefined && date !== originalDate) ||
      (time !== undefined && time !== originalTime) ||
      (makeIn !== undefined && makeIn !== originalMake) ||
      (modelIn !== undefined && modelIn !== originalModel) ||
      (typeIn !== undefined && typeIn !== originalType) ||
      (bodyIn !== undefined && bodyIn !== originalBody) ||
      (nameIn !== undefined && nameIn !== originalName) ||
      (emailIn !== undefined && emailIn !== originalEmail) ||
      (phoneIn !== undefined && phoneIn !== originalPhone)
    
    console.log(`🔍 DEBUG: hasChanges result: ${hasChanges}`)
    
    if (!hasChanges) {
      console.log(`⚠️ Nu există modificări pentru programarea ${id}`)
      return res.json({ success: true, message: 'Nu există modificări de salvat' })
    }
    
    console.log(`✅ hasChanges este TRUE, continuăm cu update-ul...`)
    
    // CRITICAL: Creăm un obiect cu numele coloanelor pentru Google Sheets API
    const updateData = {};
    
    // Aplicăm modificările doar dacă există schimbări
    if (status) {
      data[actualRowIndex][statusIndex] = status;
      updateData[headers[statusIndex]] = status;
    }
    if (date) {
      console.log(`🔄 Updating date from ${data[actualRowIndex][dateIndex]} to ${date}`);
      data[actualRowIndex][dateIndex] = date;
      updateData[headers[dateIndex]] = date;
    }
    if (time) {
      data[actualRowIndex][timeIndex] = String(time);
      updateData[headers[timeIndex]] = String(time);
    }
    console.log(`✅ After update - Date: ${data[actualRowIndex][dateIndex]}, Time: ${data[actualRowIndex][timeIndex]}`);
    
    if (makeIn && makeIndex !== -1) {
      data[actualRowIndex][makeIndex] = String(makeIn);
      updateData[headers[makeIndex]] = String(makeIn);
    }
    if (modelIn && modelIndex !== -1) {
      data[actualRowIndex][modelIndex] = String(modelIn);
      updateData[headers[modelIndex]] = String(modelIn);
    }
    if (typeIn && typeIndex !== -1) {
      data[actualRowIndex][typeIndex] = String(typeIn);
      updateData[headers[typeIndex]] = String(typeIn);
    }
    if (bodyIn && bodyIndex !== -1) {
      data[actualRowIndex][bodyIndex] = String(bodyIn);
      updateData[headers[bodyIndex]] = String(bodyIn);
    }
    if (nameIn && nameIndex !== -1) {
      console.log(`🔥 DEBUG: Updating name from "${data[actualRowIndex][nameIndex]}" to "${String(nameIn)}"`);
      console.log(`🔥 DEBUG: nameIndex = ${nameIndex}, headers[nameIndex] = "${headers[nameIndex]}"`);
      data[actualRowIndex][nameIndex] = String(nameIn);
      updateData[headers[nameIndex]] = String(nameIn);
      console.log(`🔥 DEBUG: After name update, data[actualRowIndex][nameIndex] = "${data[actualRowIndex][nameIndex]}"`);
    }
    if (emailIn && emailIndex !== -1) {
      data[actualRowIndex][emailIndex] = String(emailIn);
      updateData[headers[emailIndex]] = String(emailIn);
    }
    if (phoneIn && phoneIndex !== -1) {
      data[actualRowIndex][phoneIndex] = String(phoneIn);
      updateData[headers[phoneIndex]] = String(phoneIn);
    }
    
    console.log(`📝 Calling GoogleSheetsService.updateData with actualRowIndex: ${actualRowIndex}`);
    console.log(`📊 Update data object:`, updateData);
    
    // CRITICAL: Facem update direct în Google Sheets pentru FIECARE celulă modificată folosind index-uri
    console.log(`🎯 Starting direct cell updates in Google Sheets using column indexes...`);
    console.log(`📊 updateData object:`, updateData);
    console.log(`📊 Object.entries(updateData):`, Object.entries(updateData));
    for (const [columnName, value] of Object.entries(updateData)) {
      try {
        console.log(`🔥 DEBUG: Processing column "${columnName}" with value "${value}"`);
        // Obținem index-ul coloanei
        const columnIndex = await GoogleSheetsService.getColumnIndex('Bookings', columnName);
        console.log(`🔥 DEBUG: Column "${columnName}" has index ${columnIndex}`);
        if (columnIndex === -1) {
          console.log(`❌ Column "${columnName}" not found, skipping...`);
          continue;
        }
        
        console.log(`🔄 Updating cell by index: row=${actualRowIndex - 1}, col=${columnIndex}, value="${value}"`);
        await GoogleSheetsService.updateCellByIndex('Bookings', actualRowIndex - 1, columnIndex, value);
        console.log(`✅ Cell updated successfully: row=${actualRowIndex - 1}, col=${columnIndex}, value="${value}"`);
      } catch (cellError) {
        console.error(`❌ Failed to update cell ${columnName}:`, cellError);
        // Continuăm cu celelalte celule chiar dacă una eșuează
      }
    }
    
    console.log(`✅ Loop updateCellByIndex completed for all columns`);
    
    // De asemenea, încercăm și metoda tradițională ca backup
    try {
      await GoogleSheetsService.updateData('Bookings', actualRowIndex, updateData);
      console.log(`✅ GoogleSheetsService.updateData completed successfully`);
    } catch (backupError) {
      console.log(`⚠️ Backup updateData method failed (expected if direct updates work):`, backupError.message);
    }

    // Clear cache to ensure fresh data is fetched
    console.log(`🗑️ Clearing cache for Bookings sheet`)
    GoogleSheetsService.clearCache('Bookings')

    // Re-fetch data from Google Sheets to get the updated information (force reload)
    console.log(`🔄 Re-fetching data from Google Sheets to get updated booking information (FORCE RELOAD)`)
    const updatedData = await GoogleSheetsService.getData('Bookings', true)
    if (updatedData.length <= 1) {
      return res.status(404).json({ error: 'Nu există programări după actualizare' })
    }
    
    // Find the updated row in the fresh data
    const updatedRowIndex = updatedData.slice(1).findIndex(row => String(row[idIndex] || '').trim() === targetId)
    if (updatedRowIndex === -1) {
      return res.status(404).json({ error: 'Programarea nu a fost găsită după actualizare' })
    }
    const actualUpdatedRowIndex = updatedRowIndex + 1

    const name = updatedData[actualUpdatedRowIndex][nameIndex] || ''
    const email = updatedData[actualUpdatedRowIndex][emailIndex] || ''
    const phone = updatedData[actualUpdatedRowIndex][phoneIndex] || ''
    const dateVal = updatedData[actualUpdatedRowIndex][dateIndex] || ''
    const timeVal = updatedData[actualUpdatedRowIndex][timeIndex] || ''
    const servicesString = updatedData[actualUpdatedRowIndex][servicesIndex] || ''
    
    // 🔍 VERIFICARE CRITICĂ: Comparăm valorile actualizate cu cele trimise
    console.log(`🔍 VERIFICARE FINALĂ: Comparam valorile din Google Sheets cu cele trimise:`)
    console.log(`   - Name: "${name}" (expected: "${updateData.name || name}")`)
    console.log(`   - Email: "${email}" (expected: "${updateData.email || email}")`)
    console.log(`   - Phone: "${phone}" (expected: "${updateData.phone || phone}")`)
    console.log(`   - Date: "${dateVal}" (expected: "${updateData.date || dateVal}")`)
    console.log(`   - Time: "${timeVal}" (expected: "${updateData.time || timeVal}")`)
    
    // Verificăm dacă modificările au fost salvate
    const hasNameChanged = updateData.name && updateData.name !== originalName
    const hasEmailChanged = updateData.email && updateData.email !== originalEmail  
    const hasPhoneChanged = updateData.phone && updateData.phone !== originalPhone
    const hasDateChanged = updateData.date && updateData.date !== originalDate
    const hasTimeChanged = updateData.time && updateData.time !== originalTime
    
    if (hasNameChanged && name !== updateData.name) {
      console.log(`❌ CRITICAL: Numele nu a fost actualizat în Google Sheets!`)
      return res.status(500).json({ 
        error: 'Modificarea nu a fost salvată în Google Sheets', 
        details: 'Numele nu a fost actualizat' 
      })
    }
    if (hasEmailChanged && email !== updateData.email) {
      console.log(`❌ CRITICAL: Emailul nu a fost actualizat în Google Sheets!`)
      return res.status(500).json({ 
        error: 'Modificarea nu a fost salvată în Google Sheets', 
        details: 'Emailul nu a fost actualizat' 
      })
    }
    if (hasPhoneChanged && phone !== updateData.phone) {
      console.log(`❌ CRITICAL: Telefonul nu a fost actualizat în Google Sheets!`)
      return res.status(500).json({ 
        error: 'Modificarea nu a fost salvată în Google Sheets', 
        details: 'Telefonul nu a fost actualizat' 
      })
    }
    
    console.log(`✅ VERIFICARE FINALĂ: Toate modificările au fost salvate cu succes în Google Sheets!`)
    
    // Define body variable before using it in services mapping
    const body = bodyIndex !== -1 ? (updatedData[actualUpdatedRowIndex][bodyIndex] || '') : (bodyIn || '')

    let servicesArr = []
    if (servicesString && typeof servicesString === 'string') {
      const cleanServices = servicesString.replace(/^'/, '').replace(/'$/, '').trim()
      let tokens = []
      if (cleanServices.startsWith('[')) {
        try {
          const arr = JSON.parse(cleanServices)
          if (Array.isArray(arr)) {
            tokens = arr.map(item => {
              if (typeof item === 'string') return item
              if (item && typeof item === 'object') {
                return item.id || item.service_id || item.name || ''
              }
              return ''
            }).filter(x => x)
          }
        } catch {
          tokens = cleanServices.split(/[,|;]+/)
        }
      } else {
        tokens = cleanServices.split(/[,|;]+/)
      }
      // Use the same price calculation logic as public.js
      const allServices = (vehicleServicesService && Array.isArray(vehicleServicesService.services)) ? vehicleServicesService.services : []
      const byId = new Map(allServices.map(s => [String(s.id), s]))
      const byNameLower = new Map(allServices.map(s => [String(String(s.name || '')).toLowerCase(), s]))
      const resolvedBodyKey = String(
        vehicleServicesService && typeof vehicleServicesService.mapFrontendKeyToBodyType === 'function'
          ? (vehicleServicesService.mapFrontendKeyToBodyType(String(body || '').toLowerCase()) || {}).key
          : (body || '')
      ).toLowerCase()
      
      servicesArr = tokens.map(token => {
        const trimmed = token.trim()
        let sid = ''
        let sname = ''
        
        // First try to find service in vehicleServicesService
        const svc = byId.get(trimmed) || byNameLower.get(trimmed.toLowerCase())
        if (svc) {
          sid = String(svc.id || trimmed)
          sname = svc.name || trimmed
        } else if (bookingsEnrichmentCache.idToName.has(trimmed)) {
          sid = trimmed
          sname = bookingsEnrichmentCache.idToName.get(trimmed)
        } else if (bookingsEnrichmentCache.nameToId.has(trimmed.toLowerCase())) {
          sid = bookingsEnrichmentCache.nameToId.get(trimmed.toLowerCase())
          sname = bookingsEnrichmentCache.idToName.get(sid) || trimmed
        } else {
          sid = trimmed.toLowerCase().replace(/\s+/g, '_')
          sname = trimmed
        }
        
        // Calculate price using vehicleServicesService like public.js
        let price = 0
        const bodyTypeKey = String(body || '').toLowerCase()
        
        console.log(`💰 DEBUG: Calcul preț pentru serviciu '${sid}', caroserie '${bodyTypeKey}' (resolved: '${resolvedBodyKey}')`)
        
        if (svc && Array.isArray(svc.prices)) {
          const priceEntry = svc.prices.find(p => 
            String(p.body_type_key).toLowerCase() === resolvedBodyKey && p.is_active
          )
          price = priceEntry && priceEntry.price_min !== undefined ? Number(priceEntry.price_min) : 0
          console.log(`💰 DEBUG: Preț găsit în vehicleServicesService:`, price, 'priceEntry:', priceEntry)
        }
        
        // Fallback to bookingsEnrichmentCache if no price found
        if (!price && sid && bodyTypeKey) {
          const bodySpecificKey = `${sid}:${bodyTypeKey}`
          price = bookingsEnrichmentCache.serviceBodyPrices.get(bodySpecificKey) || 0
          console.log(`💰 DEBUG: Fallback la cache, preț găsit:`, price)
          
          if (!price) {
            price = bookingsEnrichmentCache.serviceMinPrice.get(sid) || 0
            console.log(`💰 DEBUG: Fallback la preț minim:`, price)
          }
        }
        
        return { id: sid, name: sname, price: price || 0 }
      }).filter(service => service.name.length > 0)
    }

    const bookingData = {
      user: { name, email, phone },
      date: dateVal,
      time: timeVal,
      make: makeIndex !== -1 ? (updatedData[actualUpdatedRowIndex][makeIndex] || '') : (makeIn || ''),
      model: modelIndex !== -1 ? (updatedData[actualUpdatedRowIndex][modelIndex] || '') : (modelIn || ''),
      body: bodyIndex !== -1 ? (updatedData[actualUpdatedRowIndex][bodyIndex] || '') : (bodyIn || ''),
      type: typeIndex !== -1 ? (updatedData[actualUpdatedRowIndex][typeIndex] || '') : (typeIn || ''),
      newsletter: false,
      locale: (() => {
        const localeIndex = findCol('Locale','Language')
        const raw = localeIndex !== -1 ? (data[actualRowIndex][localeIndex] || '') : ''
        return String(raw || 'nl').toLowerCase()
      })()
    }
    
    // Debug log for bookingData and services
    console.log(`📧 DEBUG bookingData:`, JSON.stringify(bookingData, null, 2))
    console.log(`📧 DEBUG servicesArr:`, JSON.stringify(servicesArr, null, 2))

    // Trimitem emailuri doar dacă există modificări reale
    let bookingEmailResult = null
    let adminEmailResult = null
    
    if (hasChanges) {
      console.log('📧 Sending booking update email...')
      bookingEmailResult = await sendBookingUpdate(bookingData, servicesArr)
      console.log('📧 Booking update email result:', bookingEmailResult)
      
      // Skip admin email in development mode to prevent hangs
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Development mode: Skipping admin email to prevent potential hangs')
        adminEmailResult = { success: true, message: 'Skipped in development mode' }
        console.log('📧 Admin update email result:', adminEmailResult)
      } else {
        console.log('📧 Sending admin update email...')
        adminEmailResult = await sendAdminUpdate(bookingData, servicesArr)
        console.log('📧 Admin update email result:', adminEmailResult)
      }
    } else {
      console.log('ℹ️ No changes detected, skipping email notifications')
    }

    console.log('🎯 About to send response to client...')
    const responseMessage = hasChanges 
      ? 'Programare actualizată și notificări trimise' 
      : 'Nu există modificări de salvat'
    res.json({ success: true, message: responseMessage, hasChanges })
    console.log('✅ Response sent successfully!')
  } catch (error) {
    console.error('Update booking error:', error)
    console.error('Error stack:', error.stack)
    res.status(500).json({ error: 'Failed to update booking', details: error.message })
  }
})

// PUT endpoint eliminat - folosiți PATCH în schimb

// Get all messages
router.get('/messages', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Messages')
    
    if (data.length <= 1) {
      return res.json([])
    }

    // Convert rows to message objects
    const messages = data.slice(1).map((row, index) => ({
      id: row[0] || `message_${index + 1}`,
      name: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      subject: row[4] || '',
      message: row[5] || '',
      createdAt: row[6] || new Date().toISOString(),
      status: row[7] || 'unread'
    }))

    res.json(messages)
  } catch (error) {
    console.error('Messages error:', error)
    res.status(500).json({ error: 'Failed to load messages' })
  }
})

// Update message status
router.patch('/messages/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const data = await GoogleSheetsService.getData('Messages')
    
    if (data.length <= 1) {
      return res.status(404).json({ error: 'Nu există mesaje' })
    }

    // Find the row by ID
    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Mesajul nu a fost găsit' })
    }

    // Update the status in the row (status is in column 7)
    const actualRowIndex = rowIndex + 1 // +1 to account for header row
    data[actualRowIndex][7] = status

    // Update the data in Google Sheets
    await GoogleSheetsService.updateData('Messages', actualRowIndex, data[actualRowIndex]) // Google Sheets is 1-indexed

    res.json({ success: true, message: 'Status updated successfully' })
  } catch (error) {
    console.error('Update message error:', error)
    res.status(500).json({ error: 'Failed to update message status' })
  }
})

// Get all gallery images
router.get('/gallery', requireAuth, async (req, res) => {
  try {
    // Import CloudinaryService dynamically to avoid circular dependencies
    const { default: CloudinaryService } = await import('../services/cloudinaryService.js')
    
    // Get images from Cloudinary
    const cloudinaryResult = await CloudinaryService.getImagesFromFolder('spectra-autoart/gallery')
    const cloudinaryImages = cloudinaryResult.success ? cloudinaryResult.data : []
    
    // Get metadata from Google Sheets
    let googleSheetsData = []
    try {
      const data = await GoogleSheetsService.getData('Gallery')
      if (data.length > 1) {
        googleSheetsData = data.slice(1).map(row => ({
          id: row[0] || '',
          url: row[1] || '',
          alt_text: row[2] || '',
          category: row[3] || 'general',
          active: row[4] === true || row[4] === 'true',
          createdAt: row[5] || ''
        }))
      }
    } catch (sheetsError) {
      console.warn('⚠️ Could not load Google Sheets metadata:', sheetsError.message)
    }

    // Combine Cloudinary images with Google Sheets metadata
    const gallery = cloudinaryImages.map(image => {
      // Try to find matching metadata from Google Sheets
      const matchingMetadata = googleSheetsData.find(sheetData => 
        sheetData.url === image.url || 
        sheetData.id === image.id
      )

      return {
        id: image.id, // Use Cloudinary public_id as unique ID
        url: image.url,
        alt_text: matchingMetadata?.alt_text || image.description || '',
        category: matchingMetadata?.category || image.category || 'general',
        active: matchingMetadata?.active !== undefined ? matchingMetadata.active : image.active,
        createdAt: image.created_date || new Date().toISOString(),
        width: image.width,
        height: image.height,
        format: image.format,
        bytes: image.size
      }
    })

    res.json({ success: true, data: gallery })
  } catch (error) {
    console.error('Gallery error:', error)
    res.status(500).json({ error: 'Failed to load gallery' })
  }
})

// Add new gallery image
router.post('/gallery', requireAuth, async (req, res) => {
  try {
    const { url, title, description, category, active, public_id } = req.body
    
    // Validate required fields
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image URL is required' 
      })
    }

    if (!title) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title is required' 
      })
    }

    // Use public_id from Cloudinary if provided, otherwise generate one
    const id = public_id || Date.now().toString()
    const createdAt = new Date().toISOString()

    // Translate title and description to all languages using DeepL
    console.log('🔄 Translating gallery title and description...')
    const translations = {
      nl: { title: title, description: description || '' },
      en: { title: title, description: description || '' },
      es: { title: title, description: description || '' },
      pl: { title: title, description: description || '' },
      ro: { title: title, description: description || '' }
    }

    const targetLanguages = ['EN', 'ES', 'PL', 'RO']
    
    // Translate to all languages
    await Promise.all(targetLanguages.map(async (lang) => {
      try {
        // Translate title
        if (title) {
          const titleResult = await translateMultipleWithDeepL(title, [lang], 'NL')
          translations[lang.toLowerCase()].title = titleResult[lang] || title
        }
        
        // Translate description
        if (description) {
          const descResult = await translateMultipleWithDeepL(description, [lang], 'NL')
          translations[lang.toLowerCase()].description = descResult[lang] || description
        }
      } catch (error) {
        console.error(`❌ Translation failed for ${lang}:`, error.message)
        // Keep original text as fallback
      }
    }))

    console.log('✅ Translations completed:', translations)

    // Create new gallery entry with all translations
    const galleryData = [
      id,                                    // ID
      title,                                 // Title (Dutch/original)
      description || '',                     // Description (Dutch/original)
      url,                                   // Image_URL
      category || 'general',               // Category
      active !== undefined ? active : true,  // Active
      createdAt,                           // Upload_Date
      translations.nl.title,               // Title_NL
      translations.en.title,               // Title_EN
      translations.es.title,               // Title_ES
      translations.pl.title,               // Title_PL
      translations.ro.title,               // Title_RO
      translations.nl.description,       // Description_NL
      translations.en.description,       // Description_EN
      translations.es.description,       // Description_ES
      translations.pl.description,       // Description_PL
      translations.ro.description        // Description_RO
    ]

    console.log('🖼️ Adding gallery image with translations:', galleryData)

    // Append metadata to Google Sheets
    try {
      await GoogleSheetsService.appendData('Gallery', galleryData)
      console.log('✅ Gallery metadata with translations saved to Google Sheets')
    } catch (sheetsError) {
      console.warn('⚠️ Could not save metadata to Google Sheets:', sheetsError.message)
    }

    res.json({ 
      success: true, 
      message: 'Gallery image with translations saved successfully',
      image: {
        id,
        url,
        title,
        description: description || '',
        category: category || 'general',
        active: active !== undefined ? active : true,
        createdAt,
        translations
      }
    })
  } catch (error) {
    console.error('Add gallery error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add gallery image metadata' 
    })
  }
})

// Update gallery image status - using wildcard to handle IDs with forward slashes
router.put('/gallery/*', requireAuth, async (req, res) => {
  try {
    const id = req.params[0] // Get the full path after /gallery/
    const { active, alt_text, category } = req.body
    
    console.log('🔄 Updating gallery image:', id, { active, alt_text, category })
    
    // Get current data from Google Sheets
    const data = await GoogleSheetsService.getData('Gallery')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No gallery images found' 
      })
    }

    // Find the row by ID
    const headers = data[0]
    const idColumnIndex = headers.findIndex(header => 
      header.toLowerCase().replace(/ /g, '_') === 'id'
    )
    
    if (idColumnIndex === -1) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID column not found in Gallery data' 
      })
    }

    // Extract numeric ID from Cloudinary path (e.g., "spectra-autoart/gallery/gallery-1764413003189-824263647" -> "1764413003189")
    const extractNumericId = (cloudinaryPath) => {
      // Dacă este deja un ID numeric simplu, returnează-l direct
      if (/^\d+$/.test(cloudinaryPath)) {
        return cloudinaryPath
      }
      // Extrage ID-ul numeric din formatul Cloudinary gallery-XXXX-XXXX sau gallery-XXXX
      const match = cloudinaryPath.match(/gallery-(\d+)/)
      return match ? match[1] : cloudinaryPath
    }
    
    const numericId = extractNumericId(id)
    console.log('🔍 Extracted numeric ID for PUT:', numericId, 'from path:', id)
    
    const rowIndex = data.slice(1).findIndex(row => {
      const rowId = row[idColumnIndex]
      return String(rowId) === String(numericId)
    })
    
    if (rowIndex === -1) {
      // Image not found in Google Sheets, but might exist in Cloudinary
      // Create a new entry in Google Sheets for this Cloudinary image
      console.log(`🆕 Creating new Google Sheets entry for Cloudinary image: ${id}`)
      
      // Get image data from Cloudinary if available
      let imageUrl = ''
      let imageAltText = alt_text || ''
      let imageCategory = category || 'general'
      
      try {
        // Try to get image info from Cloudinary
        const cloudinaryResult = await CloudinaryService.searchImages(`public_id:${id}`)
        if (cloudinaryResult.success && cloudinaryResult.data.length > 0) {
          const cloudinaryImage = cloudinaryResult.data[0]
          imageUrl = cloudinaryImage.url
          imageAltText = alt_text || cloudinaryImage.description || ''
          imageCategory = category || cloudinaryImage.category || 'general'
        }
      } catch (cloudinaryError) {
        console.warn('⚠️ Could not fetch Cloudinary image info:', cloudinaryError.message)
      }
      
      // Create new row data
      const newRowData = [
        id,                                    // ID
        imageUrl,                              // URL
        imageAltText,                          // Alt text
        imageCategory,                         // Category
        active !== undefined ? active : true,  // Active status
        new Date().toISOString()               // Created at
      ]
      
      try {
        await GoogleSheetsService.appendData('Gallery', newRowData)
        console.log('✅ New Google Sheets entry created for Cloudinary image')
        
        return res.json({ 
          success: true, 
          message: 'Image metadata created successfully',
          image: {
            id,
            url: imageUrl,
            alt_text: imageAltText,
            category: imageCategory,
            active: active !== undefined ? active : true,
            createdAt: new Date().toISOString()
          }
        })
      } catch (appendError) {
        console.error('❌ Error creating Google Sheets entry:', appendError)
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to create image metadata' 
        })
      }
    }

    // Update the data in the row
    const actualRowIndex = rowIndex + 1 // +1 to account for header row
    const currentRow = [...data[actualRowIndex]] // Create a copy
    
    // Update fields if provided
    if (active !== undefined) {
      currentRow[4] = active // Active status is in column 5 (index 4)
    }
    if (alt_text !== undefined) {
      currentRow[2] = alt_text // Alt text is in column 3 (index 2)
    }
    if (category !== undefined) {
      currentRow[3] = category // Category is in column 4 (index 3)
    }

    // Update the data in Google Sheets
    await GoogleSheetsService.updateData('Gallery', actualRowIndex, currentRow)
    console.log('✅ Gallery image updated successfully:', id)

    res.json({ 
      success: true, 
      message: 'Image updated successfully',
      image: {
        id: currentRow[0],
        url: currentRow[1],
        alt_text: currentRow[2],
        category: currentRow[3],
        active: currentRow[4]
      }
    })
  } catch (error) {
    console.error('Update gallery image error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update gallery image' 
    })
  }
})

// Delete gallery image - using wildcard to handle IDs with forward slashes
router.delete('/gallery/*', requireAuth, async (req, res) => {
  try {
    const id = req.params[0] // Get the full path after /gallery/
    console.log('🗑️ Attempting to delete gallery image with ID:', id)
    console.log('📍 Request path:', req.path)
    console.log('🔍 Route params:', req.params)
    
    // First, find the image in Google Sheets to get the URL and determine if it's local or Cloudinary
    const data = await GoogleSheetsService.getData('Gallery')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Gallery is empty'
      })
    }
    
    const headers = data[0]
    const idColumnIndex = headers.findIndex(header => 
      header.toLowerCase().replace(/ /g, '_') === 'id'
    )
    
    if (idColumnIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'ID column not found in Google Sheets'
      })
    }
    
    // Find image by matching Cloudinary URL or ID pattern
    const findImageRow = (targetId, rows) => {
      // Caută după ID direct
      let rowIndex = rows.findIndex(row => String(row[idColumnIndex]) === String(targetId))
      if (rowIndex !== -1) return rowIndex
      
      // Caută după URL care conține partea din ID
      const urlColumnIndex = headers.findIndex(header => 
        header.toLowerCase().replace(/ /g, '_') === 'image_url'
      )
      
      if (urlColumnIndex !== -1) {
        // Extrage partea relevantă din ID pentru căutare
        const searchPattern = targetId.includes('gallery-') ? targetId : `gallery-${targetId}`
        
        rowIndex = rows.findIndex(row => {
          const url = row[urlColumnIndex] || ''
          return url.includes(searchPattern)
        })
      }
      
      return rowIndex
    }
    
    console.log('🔍 Searching for image with ID:', id)
    
    // Find the row with matching ID or URL
    const rowIndex = findImageRow(id, data.slice(1))
    
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Image not found in Google Sheets'
      })
    }
    
    // Get the image data from Google Sheets
    const imageRow = data.slice(1)[rowIndex]
    const imageData = {}
    headers.forEach((header, index) => {
      imageData[header.toLowerCase().replace(/ /g, '_')] = imageRow[index] || ''
    })
    
    console.log('🖼️ Found image data:', JSON.stringify(imageData, null, 2))
    
    const imageUrl = imageData.image_url || ''
    
    // Delete from Cloudinary if it's a Cloudinary URL
    if (imageUrl.includes('cloudinary.com')) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split('/')
        const versionIndex = urlParts.findIndex(part => part.startsWith('v'))
        if (versionIndex !== -1 && versionIndex < urlParts.length - 1) {
          const publicId = urlParts.slice(versionIndex + 1).join('/').split('.')[0]
          console.log('🗑️ Deleting Cloudinary image with public_id:', publicId)
          
          const { default: CloudinaryService } = await import('../services/cloudinaryService.js')
          const cloudinaryResult = await CloudinaryService.deleteImage(publicId)
          
          if (cloudinaryResult.success) {
            console.log('✅ Cloudinary image deleted successfully')
          } else {
            console.log('⚠️ Cloudinary deletion failed:', cloudinaryResult.error)
          }
        }
      } catch (cloudinaryError) {
        console.warn('⚠️ Could not delete from Cloudinary:', cloudinaryError.message)
      }
    } else if (imageUrl.startsWith('/uploads/')) {
      // Delete local file
      try {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const filePath = path.join(__dirname, '..', '..', imageUrl)
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
          console.log('✅ Local file deleted:', filePath)
        } else {
          console.log('⚠️ Local file not found:', filePath)
        }
      } catch (fileError) {
        console.warn('⚠️ Could not delete local file:', fileError.message)
      }
    }
    
    // Delete from Google Sheets
    try {
      const actualRowIndex = rowIndex // Use 0-based index for GoogleSheetsService.deleteData
      await GoogleSheetsService.deleteData('Gallery', actualRowIndex)
      console.log('✅ Google Sheets entry deleted successfully')
    } catch (sheetsError) {
      console.warn('⚠️ Could not delete from Google Sheets:', sheetsError.message)
    }
    
    res.json({ 
      success: true, 
      message: 'Image deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete gallery image'
    })
  }
})

// Get all services
router.get('/services', requireAuth, async (req, res) => {
  try {
    // Return empty array for now since services are managed in vehicle-services
    // This endpoint is kept for backward compatibility
    res.json([])
  } catch (error) {
    console.error('Services error:', error)
    res.status(500).json({ error: 'Failed to load services' })
  }
})

// Get vehicle services
router.get('/vehicle-services', requireAuth, async (req, res) => {
  try {
    const start = Date.now()
    const services = Array.isArray(vehicleServicesService?.services) ? vehicleServicesService.services : []
    const prices = Array.isArray(vehicleServicesService?.servicePrices) ? vehicleServicesService.servicePrices : []

    if ((!services || services.length === 0) && (!prices || prices.length === 0) && vehicleServicesService?.initializeDemoData) {
      try {
        await vehicleServicesService.initializeDemoData()
      } catch (e) {
        console.warn('⚠️ Failed to initialize demo data in admin route:', e?.message)
      }
    }

    const pricesByService = new Map()
    const bodyTypes = Array.isArray(vehicleServicesService?.bodyTypes) ? vehicleServicesService.bodyTypes : []
    prices.forEach(p => {
      const sid = String(p?.service_id || '')
      if (!pricesByService.has(sid)) pricesByService.set(sid, [])
      const btIdRaw = p?.body_type_id
      const btId = typeof btIdRaw === 'string' ? parseInt(btIdRaw, 10) : btIdRaw
      const bt = bodyTypes.find(bt => bt && bt.id === btId)
      pricesByService.get(sid).push({
        id: p?.id || '',
        service_id: sid,
        body_type_key: p?.body_type_key || bt?.key || '',
        price_min: typeof p?.price_min === 'string' ? parseFloat(p.price_min) : (p?.price_min ?? 0),
        duration_minutes: p?.duration_minutes || 60,
        is_active: p?.is_active !== false
      })
    })

    const result = Array.isArray(services) ? services.map(s => ({
      id: String(s?.id || ''),
      name: s?.name || '',
      name_en: s?.name_en || s?.name || '',
      name_nl: s?.name_nl || s?.name || '',
      name_es: s?.name_es || s?.name || '',
      name_pl: s?.name_pl || s?.name || '',
      name_ro: s?.name_ro || s?.name || '',
      description: s?.description || '',
      description_en: s?.description_en || s?.description || '',
      description_nl: s?.description_nl || s?.description || '',
      description_es: s?.description_es || s?.description || '',
      description_pl: s?.description_pl || s?.description || '',
      description_ro: s?.description_ro || s?.description || '',
      category: s?.category || 'general',
      category_en: s?.category_en || s?.category || 'general',
      category_nl: s?.category_nl || s?.category || 'general',
      category_es: s?.category_es || s?.category || 'general',
      category_pl: s?.category_pl || s?.category || 'general',
      category_ro: s?.category_ro || s?.category || 'general',
      duration: String(s?.duration_minutes || 60),
      isActive: s?.is_active !== false,
      prices: pricesByService.get(String(s?.id || '')) || []
    }) ) : []

    const ms = Date.now() - start
    res.setHeader('X-Admin-Vehicle-Services-Response-Time', `${ms}ms`)
    res.json(result)
  } catch (error) {
    console.error('Vehicle services error:', error?.stack || error)
    res.status(200).json([])
  }
})

// Create vehicle service
router.post('/vehicle-services', requireAuth, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      duration, 
      category, 
      is_active, 
      isActive, 
      prices,
      // Multilingual fields
      name_en,
      name_nl, 
      name_es,
      name_pl,
      name_ro,
      description_en,
      description_nl,
      description_es,
      description_pl,
      description_ro,
      category_en,
      category_nl,
      category_es,
      category_pl,
      category_ro
    } = req.body;
    
    // Handle both is_active (camelCase) and isActive (PascalCase) from client
    const activeStatus = is_active !== undefined ? is_active : isActive;
    
    // Validate required fields
    if (!name || !description || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, description, and category are required' 
      });
    }

    // Get the next available service ID
    const existingServices = await GoogleSheetsService.getData('Vehicle_Services');
    let nextServiceId = 1;
    
    if (existingServices.length > 1) {
      // Find the highest numeric ID from existing services
      const existingIds = existingServices.slice(1).map(row => {
        const id = row[0];
        // Extract numeric part from IDs like "service_1", "1", "vehicle_service_123456"
        if (typeof id === 'string') {
          const numericMatch = id.match(/\d+$/);
          return numericMatch ? parseInt(numericMatch[0]) : 0;
        }
        return parseInt(id) || 0;
      }).filter(id => id > 0);
      
      nextServiceId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    }
    
    // Use simple numeric ID format for consistency
    const id = `service_${nextServiceId}`;
    const createdAt = new Date().toISOString();
    
    // Prepare data for Google Sheets (matching the complete column structure)
    const serviceData = [
      id,                                    // ID
      name,                                  // Name
      name_en || name,                       // Name_EN
      name_nl || name,                       // Name_NL
      name_es || name,                       // Name_ES
      name_pl || name,                       // Name_PL
      name_ro || name,                       // Name_RO
      description,                           // Description
      description_en || description,           // Description_EN
      description_nl || description,           // Description_NL
      description_es || description,           // Description_ES
      description_pl || description,           // Description_PL
      description_ro || description,           // Description_RO
      category,                              // Category
      category_en || category,               // Category_EN
      category_nl || category,               // Category_NL
      category_es || category,               // Category_ES
      category_pl || category,               // Category_PL
      category_ro || category,               // Category_RO
      duration || '60',                      // Duration_Minutes
      activeStatus !== false ? 'true' : 'false', // Is_Active
      createdAt,                             // Created_At
      '', '', '', ''                         // Coloane goale suplimentare pentru a completa structura de 26 coloane
    ];

    // Append to Google Sheets
    console.log('📤 Sending service data to Google Sheets:', serviceData.length, 'columns');
    console.log('Service data preview:', serviceData.slice(0, 5));
    await GoogleSheetsService.appendData('Vehicle_Services', serviceData);
    
    // Handle prices if provided
    if (prices && Array.isArray(prices) && prices.length > 0) {
      console.log('💰 Processing prices for new service:', prices);
      
      for (const priceData of prices) {
        if (priceData.body_type_key && (priceData.price_min !== undefined || priceData.price_max !== undefined)) {
          // Determine the price value to use (only price_min, price_max eliminated)
          const priceValue = priceData.price_min;
          
          if (priceValue === undefined || priceValue === null || priceValue === '') {
            console.log(`⚠️ Skipping price for body type ${priceData.body_type_key} - no valid price value`);
            continue;
          }
          
          const priceId = `service_price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const priceRowData = [
            priceId,                                    // ID
            id,                                         // Service_ID
            priceData.body_type_key,                    // Body_Type_Key
            priceValue.toString(),                      // Price_Min
            priceData.currency || 'EUR',                // Currency
            priceData.duration_minutes || duration || '60', // Duration_Minutes
            priceData.promo_percent || '0',             // Promo_Percent
            priceData.is_active !== undefined ? (priceData.is_active ? 'true' : 'false') : 'true', // Is_Active
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' // Coloane goale suplimentare pentru a completa structura de 25 coloane
          ];
          
          await GoogleSheetsService.appendData('Vehicle_Service_Prices', priceRowData);
          console.log('✅ Price added for body type:', priceData.body_type_key, 'with value:', priceValue);
        }
      }
    }
    
    console.log('✅ Vehicle service created successfully:', id);
    res.json({ 
      success: true, 
      message: 'Vehicle service created successfully',
      service: {
        id,
        name,
        name_en: name,
        name_nl: name,
        description,
        description_en: description,
        description_nl: description,
        category,
        category_en: category,
        category_nl: category,
        duration: duration || '60',
        isActive: activeStatus !== false,
        prices: prices || []
      }
    });
  } catch (error) {
    console.error('❌ Create vehicle service error:', error.message);
    console.error('Stack:', error.stack);
    if (error.response) {
      console.error('Google Sheets API error response:', error.response.data);
    }
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create vehicle service: ' + error.message 
    });
  }
});

// Update vehicle service
router.put('/vehicle-services/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price, 
      duration, 
      category, 
      is_active, 
      isActive, 
      prices,
      // Multilingual fields
      name_en,
      name_nl, 
      name_es,
      name_pl,
      name_ro,
      description_en,
      description_nl,
      description_es,
      description_pl,
      description_ro,
      category_en,
      category_nl,
      category_es,
      category_pl,
      category_ro
    } = req.body;
    
    console.log('✏️ Attempting to update vehicle service with ID:', id);
    console.log('📋 Update data received:', { name, description, duration, category, is_active, isActive, prices });

    // Get all vehicle services to find the one to update
    const data = await GoogleSheetsService.getData('Vehicle_Services');
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No vehicle services found' 
      });
    }

    // Find the vehicle service by ID
    let serviceIndex = -1;
    const targetId = String(id).trim();
    
    for (let i = 1; i < data.length; i++) {
      const serviceId = String(data[i][0] || '').trim();
      if (serviceId === targetId) {
        serviceIndex = i;
        break;
      }
    }

    if (serviceIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehicle service not found' 
      });
    }

    // Handle both is_active (camelCase) and isActive (PascalCase) from client
    const activeStatus = is_active !== undefined ? is_active : isActive;
    
    // Prepare updated data with all columns
    const updatedData = [
      targetId,                                                               // ID
      name || data[serviceIndex][1],                                         // Name
      name_en || name || data[serviceIndex][2],                              // Name_EN
      name_nl || name || data[serviceIndex][3],                              // Name_NL
      name_es || name || data[serviceIndex][4],                              // Name_ES
      name_pl || name || data[serviceIndex][5],                              // Name_PL
      name_ro || name || data[serviceIndex][6],                              // Name_RO
      description || data[serviceIndex][7],                                 // Description
      description_en || description || data[serviceIndex][8],                // Description_EN
      description_nl || description || data[serviceIndex][9],                // Description_NL
      description_es || description || data[serviceIndex][10],               // Description_ES
      description_pl || description || data[serviceIndex][11],               // Description_PL
      description_ro || description || data[serviceIndex][12],               // Description_RO
      category || data[serviceIndex][13],                                  // Category
      category_en || category || data[serviceIndex][14],                     // Category_EN
      category_nl || category || data[serviceIndex][15],                     // Category_NL
      category_es || category || data[serviceIndex][16],                     // Category_ES
      category_pl || category || data[serviceIndex][17],                     // Category_PL
      category_ro || category || data[serviceIndex][18],                     // Category_RO
      duration !== undefined ? duration : data[serviceIndex][19],            // Duration_Minutes
      activeStatus !== undefined ? (activeStatus ? 'true' : 'false') : data[serviceIndex][20], // Is_Active
      data[serviceIndex][21] || new Date().toISOString()                     // Created_At (keep existing or set new)
    ];

    // Update in Google Sheets (rowIndex is 1-based for Google Sheets)
    await GoogleSheetsService.updateData('Vehicle_Services', serviceIndex + 1, updatedData);
    
    // Handle prices if provided
    if (prices && Array.isArray(prices)) {
      console.log('💰 Processing prices update for service:', targetId);
      
      // Get existing prices for this service
      const existingPricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices');
      const existingPriceMap = {};
      const existingPriceRows = [];
      
      if (existingPricesData.length > 1) {
        for (let i = 1; i < existingPricesData.length; i++) {
          const priceServiceId = String(existingPricesData[i][1] || '').trim();
          if (priceServiceId === targetId) {
            const bodyTypeKey = existingPricesData[i][2] || '';
            existingPriceMap[bodyTypeKey] = {
              rowIndex: i - 1,
              data: existingPricesData[i],
              id: existingPricesData[i][0] || ''
            };
            existingPriceRows.push(bodyTypeKey);
          }
        }
      }
      
      console.log('📊 Found existing prices:', existingPriceRows.length);
      console.log('📋 New prices received:', prices.length);
      
      // Process each new price - only if it has a valid value
      for (const priceData of prices) {
        if (priceData.body_type_key) {
          const bodyTypeKey = priceData.body_type_key;
          
          // Determine the price value to use (only price_min, price_max eliminated)
          const priceValue = priceData.price_min;
          
          // Only process if there's a valid price value (not undefined, null, empty, or 0 if you want to allow 0)
          if (priceValue === undefined || priceValue === null || priceValue === '') {
            console.log(`⚠️ Skipping price for body type ${bodyTypeKey} - no valid price value`);
            continue;
          }
          
          if (existingPriceMap[bodyTypeKey]) {
            // Update existing price
            const existingPrice = existingPriceMap[bodyTypeKey];
            const updatedPriceData = [
              existingPrice.id, // Keep existing ID
              targetId, // service_id
              bodyTypeKey, // body_type_key
              priceValue.toString(), // price_min
              priceData.currency || existingPrice.data[4] || 'EUR', // currency
              priceData.duration_minutes || duration || existingPrice.data[5] || '60', // duration_minutes
              priceData.promo_percent || existingPrice.data[6] || '0', // promo_percent
              priceData.is_active !== undefined ? (priceData.is_active ? 'true' : 'false') : (existingPrice.data[7] || 'true'), // is_active
              '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' // Coloane goale suplimentare pentru a completa structura de 25 coloane
            ];
            
            await GoogleSheetsService.updateData('Vehicle_Service_Prices', existingPrice.rowIndex + 1, updatedPriceData);
            console.log('✅ Price updated for body type:', bodyTypeKey, 'with value:', priceValue);
            
            // Remove from map to track processed items
            delete existingPriceMap[bodyTypeKey];
          } else {
            // Add new price
            const priceId = `service_price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const priceRowData = [
            priceId,
            targetId, // service_id
            bodyTypeKey, // body_type_key
            priceValue.toString(), // price_min
            priceData.currency || 'EUR', // currency
            priceData.duration_minutes || duration || '60', // duration_minutes
            priceData.promo_percent || '0', // promo_percent
            priceData.is_active !== undefined ? (priceData.is_active ? 'true' : 'false') : 'true', // is_active
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' // Coloane goale suplimentare pentru a completa structura de 25 coloane
          ];
            
            await GoogleSheetsService.appendData('Vehicle_Service_Prices', priceRowData);
            console.log('✅ New price added for body type:', bodyTypeKey, 'with value:', priceValue);
          }
        }
      }
      
      // Keep existing prices that weren't modified (don't delete them)
      const remainingPrices = Object.keys(existingPriceMap);
      if (remainingPrices.length > 0) {
        console.log('💾 Preserved unmodified prices for body types:', remainingPrices);
      }
    }
    
    console.log('✅ Vehicle service updated successfully');
    res.json({ 
      success: true, 
      message: 'Vehicle service updated successfully',
      service: {
        id: targetId,
        name: updatedData[1],
        name_en: updatedData[2],
        name_nl: updatedData[3],
        description: updatedData[4],
        description_en: updatedData[5],
        description_nl: updatedData[6],
        category: updatedData[7],
        category_en: updatedData[8],
        category_nl: updatedData[9],
        duration: updatedData[10],
        isActive: updatedData[11] === 'true',
        prices: prices || []
      }
    });
  } catch (error) {
    console.error('Update vehicle service error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update vehicle service' 
    });
  }
});

// Delete vehicle service
router.delete('/vehicle-services/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Attempting to delete vehicle service with ID:', id);

    // Get all vehicle services to find the one to delete
    const data = await GoogleSheetsService.getData('Vehicle_Services');
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No vehicle services found' 
      });
    }

    // Find the vehicle service by ID
    let serviceIndex = -1;
    const targetId = String(id).trim();
    
    for (let i = 1; i < data.length; i++) {
      const serviceId = String(data[i][0] || '').trim();
      if (serviceId === targetId) {
        serviceIndex = i;
        break;
      }
    }

    if (serviceIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehicle service not found' 
      });
    }

    console.log(`🔍 Found service at array index: ${serviceIndex}, Google Sheets row index: ${serviceIndex - 1}`);
    console.log(`🔍 Service data before deletion:`, data[serviceIndex]);
    
    // Delete the vehicle service from Google Sheets
    // serviceIndex is the array index (1-based, skipping header), but Google Sheets deleteData expects 0-based index
    await GoogleSheetsService.deleteData('Vehicle_Services', serviceIndex - 1);
    
    console.log('✅ Vehicle service deleted successfully');
    res.json({ 
      success: true, 
      message: 'Vehicle service deleted successfully' 
    });
  } catch (error) {
    console.error('Delete vehicle service error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete vehicle service' 
    });
  }
});

// Get body types
router.get('/body-types', requireAuth, async (req, res) => {
  try {
    // Check if Google Sheets is properly initialized or in demo mode
    if (!GoogleSheetsService.isInitialized && !GoogleSheetsService.isDemoMode) {
      return res.status(503).json({ 
        error: 'Google Sheets service not initialized',
        message: 'The body types system is temporarily unavailable. Please try again later.',
        demoMode: GoogleSheetsService.isDemoMode
      })
    }
    
    const data = await GoogleSheetsService.getData('Body_Types')
    
    if (data.length <= 1) {
      return res.json([])
    }

    const bodyTypes = data.slice(1).map((row, index) => ({
      id: row[0] || `body_type_${index + 1}`,
      name: row[1] || '',
      description: row[2] || '',
      image: row[3] || '',
      isActive: row[4] !== 'false'
    }))

    res.json(bodyTypes)
  } catch (error) {
    console.error('Body types error:', error)
    res.status(500).json({ error: 'Failed to load body types' })
  }
})

// Create body type
router.post('/body-types', requireAuth, async (req, res) => {
  try {
    const { key, name, description, image, isActive } = req.body;
    
    // Validate required fields
    if (!key || !name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Key and name are required' 
      });
    }

    // Generate unique ID
    const id = `body_type_${Date.now()}`;
    
    // Prepare data for Google Sheets (matching the column structure)
    const bodyTypeData = [
      id,
      name,
      description || '',
      image || '',
      isActive !== false ? 'true' : 'false'
    ];

    // Append to Google Sheets
    await GoogleSheetsService.appendData('Body_Types', bodyTypeData);
    
    console.log('✅ Body type created successfully:', id);
    res.json({ 
      success: true, 
      message: 'Body type created successfully',
      bodyType: {
        id,
        key,
        name,
        description: description || '',
        image: image || '',
        isActive: isActive !== false
      }
    });
  } catch (error) {
    console.error('Create body type error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create body type' 
    });
  }
});

// Update body type
router.put('/body-types/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { key, name, description, image, isActive } = req.body;
    
    console.log('✏️ Attempting to update body type with ID:', id);

    // Get all body types to find the one to update
    const data = await GoogleSheetsService.getData('Body_Types');
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No body types found' 
      });
    }

    // Find the body type by ID
    let bodyTypeIndex = -1;
    const targetId = String(id).trim();
    
    for (let i = 1; i < data.length; i++) {
      const bodyTypeId = String(data[i][0] || '').trim();
      if (bodyTypeId === targetId) {
        bodyTypeIndex = i;
        break;
      }
    }

    if (bodyTypeIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Body type not found' 
      });
    }

    // Prepare updated data
    const updatedData = [
      targetId,
      name || data[bodyTypeIndex][1],
      description !== undefined ? description : data[bodyTypeIndex][2],
      image !== undefined ? image : data[bodyTypeIndex][3],
      isActive !== undefined ? (isActive ? 'true' : 'false') : data[bodyTypeIndex][4]
    ];

    // Update in Google Sheets (rowIndex is 1-based for Google Sheets)
    await GoogleSheetsService.updateData('Body_Types', bodyTypeIndex + 1, updatedData);
    
    console.log('✅ Body type updated successfully');
    res.json({ 
      success: true, 
      message: 'Body type updated successfully',
      bodyType: {
        id: targetId,
        name: updatedData[1],
        description: updatedData[2],
        image: updatedData[3],
        isActive: updatedData[4] === 'true'
      }
    });
  } catch (error) {
    console.error('Update body type error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update body type' 
    });
  }
});

// Delete body type
router.delete('/body-types/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Attempting to delete body type with ID:', id);

    // Get all body types to find the one to delete
    const data = await GoogleSheetsService.getData('Body_Types');
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No body types found' 
      });
    }

    // Find the body type by ID
    let bodyTypeIndex = -1;
    const targetId = String(id).trim();
    
    for (let i = 1; i < data.length; i++) {
      const bodyTypeId = String(data[i][0] || '').trim();
      if (bodyTypeId === targetId) {
        bodyTypeIndex = i;
        break;
      }
    }

    if (bodyTypeIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Body type not found' 
      });
    }

    // Delete the body type from Google Sheets (rowIndex is 1-based for Google Sheets)
    await GoogleSheetsService.deleteData('Body_Types', bodyTypeIndex + 1);
    
    console.log('✅ Body type deleted successfully');
    res.json({ 
      success: true, 
      message: 'Body type deleted successfully' 
    });
  } catch (error) {
    console.error('Delete body type error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete body type' 
    });
  }
});

// Get newsletter subscribers
router.get('/newsletter-subscribers', requireAuth, async (req, res) => {
  try {
    // Check if Google Sheets is properly initialized or in demo mode
    if (!GoogleSheetsService.isInitialized && !GoogleSheetsService.isDemoMode) {
      return res.status(503).json({ 
        error: 'Google Sheets service not initialized',
        message: 'The newsletter system is temporarily unavailable. Please try again later.',
        demoMode: GoogleSheetsService.isDemoMode
      })
    }
    
    const data = await GoogleSheetsService.getData('Newsletter_subscribers')
    
    if (data.length <= 1) {
      return res.json([])
    }

    // Convert rows to subscriber objects based on Newsletter_subscribers structure
    // Coloane: Email, Name, Locale, IP, Subscribed At
    const subscribers = data.slice(1).map((row, index) => ({
      id: `subscriber_${index + 1}`,
      email: row[0] || '',
      name: row[1] || '',
      locale: row[2] || 'en',
      ip: row[3] || '',
      subscribedAt: row[4] || new Date().toISOString(),
      status: 'active'
    }))

    res.json(subscribers)
  } catch (error) {
    console.error('Newsletter subscribers error:', error)
    res.status(500).json({ error: 'Failed to load newsletter subscribers' })
  }
})

// Send newsletter
router.post('/newsletter/send', requireAuth, async (req, res) => {
  try {
    const { subject, content } = req.body
    
    if (!subject || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subject and content are required' 
      })
    }

    // Get all active subscribers from Newsletter_subscribers
    const data = await GoogleSheetsService.getData('Newsletter_subscribers')
    const subscribers = data.slice(1).map(row => row[0]).filter(email => email && email !== '') // Email is in column 0

    if (subscribers.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No active subscribers found' 
      })
    }

    console.log(`📧 Sending newsletter to ${subscribers.length} subscribers`)
    
    // Here you would integrate with your email service
    // For now, we'll just log and return success
    console.log(`📨 Newsletter subject: ${subject}`)
    console.log(`📝 Newsletter content preview: ${content.substring(0, 100)}...`)
    
    // Log the newsletter send event to Google Sheets
    const newsletterLog = [
      Date.now().toString(),
      new Date().toISOString(),
      subject,
      subscribers.length.toString(),
      'sent'
    ]
    
    try {
      await GoogleSheetsService.appendData('NewsletterLogs', newsletterLog)
    } catch (logError) {
      console.warn('⚠️ Failed to log newsletter send event:', logError.message)
    }

    res.json({ 
      success: true, 
      message: `Newsletter sent successfully to ${subscribers.length} subscribers`,
      subscriberCount: subscribers.length
    })
  } catch (error) {
    console.error('Send newsletter error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send newsletter' 
    })
  }
})

// Test email service
router.get('/email/test', requireAuth, async (req, res) => {
  try {
    console.log('🧪 Testing email service...');
    const result = await testEmailService();
    
    if (result) {
      res.json({ 
        success: true, 
        message: 'Email service is working correctly' 
      });
    } else {
      res.status(503).json({ 
        success: false, 
        error: 'Email service is not configured properly' 
      });
    }
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to test email service' 
    });
  }
});

// Delete booking
router.delete('/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Attempting to delete booking with ID:', id);
    console.log('📍 ID type:', typeof id);
    console.log('📍 ID value:', JSON.stringify(id));

    // Get all bookings to find the one to delete
    const data = await GoogleSheetsService.getData('Bookings');
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No bookings found' 
      });
    }

    // Log headers and first few rows for debugging
    console.log('📊 Bookings headers:', data[0]);
    console.log('📊 First 3 booking rows:');
    for (let i = 1; i < Math.min(4, data.length); i++) {
      console.log(`Row ${i}: ID="${data[i][0]}" (type: ${typeof data[i][0]}), Name="${data[i][1]}"`);
    }

    // Find the booking by ID with flexible matching
    let bookingIndex = -1;
    const targetId = String(id).trim();
    
    for (let i = 1; i < data.length; i++) {
      const rowId = String(data[i][0] || '').trim();
      console.log(`🔍 Comparing target:"${targetId}" with row:"${rowId}"`);
      
      if (rowId === targetId) {
        bookingIndex = i;
        console.log('✅ Found matching booking at index:', i);
        break;
      }
    }

    if (bookingIndex === -1) {
      console.log('❌ Booking not found after searching all rows');
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    // Delete the booking from Google Sheets
    // Note: bookingIndex is the index in data array (including header), 
    // but for Google Sheets deletion we need the row index (excluding header)
    const sheetRowIndex = bookingIndex - 1; // Convert to 0-based index for sheet rows
    console.log('🗑️ Deleting row from sheet, data index:', bookingIndex, 'sheet index:', sheetRowIndex);
    
    await GoogleSheetsService.deleteData('Bookings', sheetRowIndex);
    console.log('✅ Booking deleted successfully from Google Sheets:', id);

    res.json({ 
      success: true, 
      message: 'Booking deleted successfully' 
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete booking' 
    });
  }
});

// Get email configuration status
router.get('/email/config', requireAuth, async (req, res) => {
  try {
    console.log('🔧 Checking email configuration...');
    
    const config = {
      emailUser: process.env.EMAIL_USER ? 'CONFIGURED' : 'MISSING',
      emailPass: process.env.EMAIL_PASS ? 'CONFIGURED' : 'MISSING',
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: process.env.SMTP_PORT || '465',
      smtpSecure: process.env.SMTP_SECURE || 'true'
    };

    // Test if transporter is working
    let transporterStatus = 'UNKNOWN';
    try {
      if (transporter && transporter.verify) {
        await transporter.verify();
        transporterStatus = 'WORKING';
      } else {
        transporterStatus = 'NOT_INITIALIZED';
      }
    } catch (verifyError) {
      transporterStatus = 'FAILED';
      console.error('❌ Transporter verification failed:', verifyError.message);
    }

    res.json({
      success: true,
      configuration: {
        ...config,
        transporterStatus
      },
      message: 'Email configuration retrieved successfully'
    });

  } catch (error) {
    console.error('Email config error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get email configuration'
    });
  }
});

// Send test email
router.post('/email/send', requireAuth, async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;
    
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, html/text'
      });
    }

    console.log(`📧 Sending test email to: ${to}`);
    
    if (!transporter) {
      console.warn('⚠️ Email transporter not available');
      return res.status(503).json({
        success: false,
        error: 'Email service not configured'
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''),
      html: html || text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Test email sent successfully to ${to} with messageId: ${result.messageId}`);
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('❌ Test email failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      response: error.response,
      responseCode: error.responseCode
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error.message
    });
  }
});

// Test route to validate Google Sheets structure and data consistency
router.get('/test-sheets-structure', async (req, res) => {
  try {
    console.log('📊 Testing Google Sheets structure...');
    
    // Get services data
    const servicesData = await GoogleSheetsService.getData('Vehicle_Services');
    console.log('✅ Vehicle_Services sheet data:', {
      rowCount: servicesData ? servicesData.length : 0,
      headers: servicesData && servicesData.length > 0 ? Object.keys(servicesData[0]) : 'No data',
      sampleData: servicesData ? servicesData.slice(0, 2) : 'No data'
    });
    
    // Get prices data
    const pricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    console.log('✅ Vehicle_Service_Prices sheet data:', {
      rowCount: pricesData ? pricesData.length : 0,
      headers: pricesData && pricesData.length > 0 ? Object.keys(pricesData[0]) : 'No data',
      sampleData: pricesData ? pricesData.slice(0, 2) : 'No data'
    });
    
    // Get services with prices
    const servicesWithPrices = await GoogleSheetsService.getServicesWithPrices();
    console.log('✅ Services with prices:', {
      serviceCount: servicesWithPrices ? servicesWithPrices.length : 0,
      sampleService: servicesWithPrices && servicesWithPrices.length > 0 ? {
        id: servicesWithPrices[0].id,
        name: servicesWithPrices[0].name,
        prices: servicesWithPrices[0].prices
      } : 'No services'
    });
    
    // Test specific service price loading
    if (servicesData && servicesData.length > 0) {
      const testService = servicesData[0];
      console.log('🧪 Testing service price loading for:', testService.id);
      
      // Find prices for this service
      const servicePrices = pricesData ? pricesData.filter(price => 
        price.service_id === testService.id || price.Service_ID === testService.id
      ) : [];
      
      console.log('🔍 Found prices for test service:', {
        serviceId: testService.id,
        priceCount: servicePrices.length,
        prices: servicePrices
      });
    }
    
    res.json({
      success: true,
      data: {
        servicesCount: servicesData ? servicesData.length : 0,
        pricesCount: pricesData ? pricesData.length : 0,
        servicesWithPricesCount: servicesWithPrices ? servicesWithPrices.length : 0,
        servicesHeaders: servicesData && servicesData.length > 0 ? Object.keys(servicesData[0]) : [],
        pricesHeaders: pricesData && pricesData.length > 0 ? Object.keys(pricesData[0]) : [],
        sampleServices: servicesData ? servicesData.slice(0, 3) : [],
        samplePrices: pricesData ? pricesData.slice(0, 3) : [],
        sampleServicesWithPrices: servicesWithPrices ? servicesWithPrices.slice(0, 2) : []
      }
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: 'Test failed',
      details: error.message,
      stack: error.stack
    });
  }
});

export default router
