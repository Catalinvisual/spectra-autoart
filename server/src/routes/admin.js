import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import requireAuth from '../middleware/auth.js'
import GoogleSheetsService from '../services/googleSheetsService.js'
import NotificationService from '../services/notificationService.js'
import { vehicleServicesService } from '../services/vehicleServicesService.js'

const router = Router()

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email și parolă sunt obligatorii' })
    }
    
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD
    
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )
      
      return res.json({ token, user: { email, role: 'admin' } })
    }
    
    res.status(401).json({ error: 'Credențiale invalide' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/bookings', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Bookings')
    
    if (data.length <= 1) {
      return res.json([])
    }

    const bookings = data.slice(1).map(row => {
      // New correct mapping for updated Google Sheets structure:
      // ID, Name, Email, Phone, Date, Time, Services, Total, Status, Created At
      const id = row[0] ? row[0].toString() : Date.now().toString();
      const name = row[1] || '';
      const email = row[2] || '';
      const phone = row[3] || '';
      const dateRaw = row[4] || '';
      const timeRaw = row[5] || '';
      const servicesRaw = row[6]; // Services as comma-separated string
      const totalRaw = row[7];
      const status = row[8] || 'pending';
      const createdAt = row[9] || '';
      
      // Clean date and time - remove single quote prefix if present
      const date = dateRaw.toString().replace(/^'/, '');
      const time = timeRaw.toString().replace(/^'/, '');
      
      // Parse services from comma-separated string
      let services = []
      if (servicesRaw) {
        if (typeof servicesRaw === 'string') {
          services = servicesRaw.split(',').map(service => ({
            name: service.trim(),
            price: 0
          }))
        } else {
          // Handle case where servicesRaw is not a string (single service)
          services = [{
            name: servicesRaw.toString().trim(),
            price: 0
          }]
        }
      }
      
      // Parse total
      let total = 0
      if (totalRaw) {
        if (typeof totalRaw === 'number') {
          total = totalRaw
        } else if (typeof totalRaw === 'string') {
          total = parseFloat(totalRaw) || 0
        }
      }
      
      // Extract make/model from services or use defaults
      const make = '';
      const model = '';
      const type = '';
      const body = '';
      
      return {
        id: id,
        date: date,
        time: time,
        make: make,
        model: model,
        type: type,
        body: body,
        services: services,
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
    res.status(500).json({ error: error.message })
  }
})

router.patch('/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const data = await GoogleSheetsService.getData('Bookings')
    
    if (data.length <= 1) {
      return res.status(404).json({ error: 'Nu există programări' })
    }

    const headers = data[0]
    const rows = data.slice(1)
    const rowIndex = rows.findIndex(row => row[0] == id || row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Programarea nu a fost găsită' })
    }
    
    // Update the status column (find the status column index)
    const statusIndex = headers.findIndex(header => header.toLowerCase() === 'status')
    if (statusIndex !== -1) {
      rows[rowIndex][statusIndex] = status
    }
    
    // Update the entire row
    await GoogleSheetsService.updateData('Bookings', rowIndex, rows[rowIndex])
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT endpoint for full booking updates
router.put('/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const bookingData = req.body
    
    const data = await GoogleSheetsService.getData('Bookings')
    
    if (data.length <= 1) {
      return res.status(404).json({ error: 'Nu există programări' })
    }

    const headers = data[0]
    const rows = data.slice(1)
    const rowIndex = rows.findIndex(row => row[0] == id || row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Programarea nu a fost găsită' })
    }
    
    // Create updated row with new data while preserving the ID
    const updatedRow = [...rows[rowIndex]]
    
    // Update each field based on the headers
    Object.keys(bookingData).forEach(key => {
      const columnIndex = headers.findIndex(header => header.toLowerCase() === key.toLowerCase())
      if (columnIndex !== -1) {
        updatedRow[columnIndex] = bookingData[key]
      }
    })
    
    // Update the entire row
    await GoogleSheetsService.updateData('Bookings', rowIndex, updatedRow)
    
    res.json({ success: true, booking: updatedRow })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🗑️  Attempting to delete booking with ID: ${id}`)
    
    const data = await GoogleSheetsService.getData('Bookings')
    console.log(`📊 Found ${data.length} total rows in Bookings sheet`)
    
    if (data.length <= 1) {
      console.log('❌ No bookings found in sheet')
      return res.status(404).json({ error: 'Nu există programări' })
    }

    const rows = data.slice(1)
    console.log(`📋 Checking ${rows.length} booking rows for ID: ${id}`)
    
    // Log first few rows to see the data structure
    if (rows.length > 0) {
      console.log(`🔍 First row ID: ${rows[0][0]} (type: ${typeof rows[0][0]})`)
      console.log(`🔍 Second row ID: ${rows[1][0]} (type: ${typeof rows[1][0]})`)
    }
    
    const rowIndex = rows.findIndex(row => {
      const rowId = row[0]
      console.log(`🔍 Comparing row ID: ${rowId} (type: ${typeof rowId}) with search ID: ${id} (type: ${typeof id})`)
      return rowId == id || rowId === id
    })
    
    if (rowIndex === -1) {
      console.log(`❌ Booking with ID ${id} not found`)
      return res.status(404).json({ error: 'Programarea nu a fost găsită' })
    }
    
    console.log(`✅ Found booking at row index: ${rowIndex}`)
    
    await GoogleSheetsService.deleteData('Bookings', rowIndex)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/services', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Services')
    
    if (data.length <= 1) {
      return res.json([])
    }

    const headers = data[0]
    
    // Handle case where headers might be missing or incomplete
    if (!headers || !Array.isArray(headers) || headers.length === 0) {
      console.log('No valid headers found, using default structure')
      return res.json([])
    }
    
    const services = data.slice(1).map((row, index) => {
      const service = {}
      headers.forEach((header, index) => {
        if (header && typeof header === 'string') {
          service[header.toLowerCase().replace(/ /g, '_')] = row[index] || ''
        } else {
          // Fallback for missing/invalid headers
          service[`column_${index}`] = row[index] || ''
        }
      })
      
      // Try to extract service data with fallback logic
      let serviceId = service.id || service.column_0 || ''
      
      // Generate a unique ID if none exists (for existing services without IDs)
      if (!serviceId) {
        serviceId = `service_${Date.now()}_${index}`
      }
      
      const serviceName = service.name || service.column_1 || 'Unknown Service'
      const serviceDescription = service.description || service.column_2 || ''
      const servicePrice = parseFloat(service.price || service.column_3 || '0') || 0
      const serviceActive = (service.active || service.column_4 || 'true').toLowerCase() === 'true'
      
      return {
        id: serviceId,
        name: {
          nl: serviceName,
          en: serviceName,
          es: serviceName,
          pl: serviceName,
          ro: serviceName
        },
        description: {
          nl: serviceDescription,
          en: serviceDescription,
          es: serviceDescription,
          pl: serviceDescription,
          ro: serviceDescription
        },
        price: servicePrice,
        active: serviceActive
      }
    })
    
    res.json(services)
  } catch (error) {
    console.error('Error in get services:', error)
    res.status(500).json({ error: error.message })
  }
})

router.post('/services', requireAuth, async (req, res) => {
  try {
    const { name, description, price, active } = req.body
    
    const serviceId = Date.now().toString()
    
    const serviceData = [
      serviceId,
      name.nl || name,
      name.en || '',
      name.es || '',
      name.pl || '',
      name.ro || '',
      description.nl || description,
      description.en || '',
      description.es || '',
      description.pl || '',
      description.ro || '',
      price || 0,
      active ? 'true' : 'false',
      new Date().toISOString(), // Created_Date
      new Date().toISOString()  // Updated_Date
    ]
    
    await GoogleSheetsService.appendData('Services', serviceData)
    
    res.json({ success: true, id: serviceId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/services/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, price, active } = req.body
    
    const data = await GoogleSheetsService.getData('Services')
    
    if (data.length <= 1) {
      return res.status(404).json({ error: 'No services found' })
    }

    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Service not found' })
    }
    
    const currentRow = data[rowIndex + 1]
    const updatedData = [
      id,
      name.nl || name || currentRow[1],
      name.en || currentRow[2],
      name.es || currentRow[3],
      name.pl || currentRow[4],
      name.ro || currentRow[5],
      description.nl || description || currentRow[6],
      description.en || currentRow[7],
      description.es || currentRow[8],
      description.pl || currentRow[9],
      description.ro || currentRow[10],
      price !== undefined ? price.toString() : currentRow[11],
      active !== undefined ? (active ? 'true' : 'false') : currentRow[12],
      currentRow[13], // Created_Date
      new Date().toISOString() // Updated_Date
    ]
    
    await GoogleSheetsService.updateData('Services', rowIndex, updatedData)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/services/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    
    const data = await GoogleSheetsService.getData('Services')
    
    if (data.length <= 1) {
      return res.status(404).json({ error: 'No services found' })
    }

    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Service not found' })
    }
    
    await GoogleSheetsService.deleteData('Services', rowIndex)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/newsletter-subscribers', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Newsletter_subscribers')
    
    if (data.length <= 1) {
      return res.json([])
    }

    const headers = data[0]
    const subscribers = data.slice(1).map(row => {
      const subscriber = {}
      headers.forEach((header, index) => {
        subscriber[header.toLowerCase().replace(/ /g, '_')] = row[index] || ''
      })
      
      return {
        email: subscriber.email || '',
        name: subscriber.name || '',
        locale: subscriber.locale || 'nl',
        ip: subscriber.ip || '',
        subscribedAt: subscriber.subscribed_at || ''
      }
    }).filter(subscriber => subscriber.email)
    
    res.json(subscribers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/newsletter/send', requireAuth, async (req, res) => {
  try {
    const { subject, htmlContent, textContent, locale = 'nl' } = req.body
    
    if (!subject || !htmlContent) {
      return res.status(400).json({ 
        error: 'Subject and HTML content are required' 
      })
    }
    
    // Get all newsletter subscribers
    const data = await GoogleSheetsService.getData('Newsletter_subscribers')
    
    if (data.length <= 1) {
      return res.status(400).json({ 
        error: 'No newsletter subscribers found' 
      })
    }

    const headers = data[0]
    const subscribers = data.slice(1).map(row => {
      const subscriber = {}
      headers.forEach((header, index) => {
        subscriber[header.toLowerCase().replace(/ /g, '_')] = row[index] || ''
      })
      
      return {
        email: subscriber.email || '',
        name: subscriber.name || '',
        locale: subscriber.locale || 'nl'
      }
    }).filter(subscriber => subscriber.email)
    
    if (subscribers.length === 0) {
      return res.status(400).json({ 
        error: 'No newsletter subscribers found' 
      })
    }
    
    // Send newsletter to all subscribers
    const result = await NotificationService.sendNewsletter(
      subscribers,
      subject,
      htmlContent,
      textContent
    )
    
    res.json({
      success: true,
      message: `Newsletter sent to ${result.sent} subscribers`,
      details: result
    })
  } catch (error) {
    console.error('Error sending newsletter:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/vehicle-services', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Vehicle_Services')
    const pricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices')
    
    if (data.length <= 1) {
      return res.json([])
    }

    const headers = data[0]
    const priceHeaders = pricesData.length > 0 ? pricesData[0] : []
    const activePrices = pricesData.length > 1 ? pricesData.slice(1).filter(row => row[8] === 'true') : []

    const vehicleServices = data.slice(1).map(row => {
      const service = {}
      headers.forEach((header, index) => {
        service[header.toLowerCase().replace(/ /g, '_')] = row[index] || ''
      })
      
      // Get prices for this service
      const servicePrices = activePrices
        .filter(priceRow => parseInt(priceRow[1]) === parseInt(service.id))
        .map(priceRow => ({
          id: parseInt(priceRow[0]) || 0,
          service_id: parseInt(priceRow[1]) || 0,
          body_type_key: priceRow[2] || '',
          price_min: parseFloat(priceRow[3]) || 0,
          price_max: priceRow[4] ? parseFloat(priceRow[4]) : null,
          currency: priceRow[5] || 'EUR',
          duration_minutes: parseInt(priceRow[6]) || 0,
          promo_percent: parseInt(priceRow[7]) || 0,
          is_active: priceRow[8] === 'true'
        }))
      
      return {
        id: service.id || '',
        name: service.name || '',
        name_en: service.name_en || '',
        name_nl: service.name_nl || '',
        name_es: service.name_es || '',
        name_pl: service.name_pl || '',
        name_ro: service.name_ro || '',
        description: service.description || '',
        description_en: service.description_en || '',
        description_nl: service.description_nl || '',
        description_es: service.description_es || '',
        description_pl: service.description_pl || '',
        description_ro: service.description_ro || '',
        category: service.category || '',
        category_en: service.category_en || '',
        category_nl: service.category_nl || '',
        category_es: service.category_es || '',
        category_pl: service.category_pl || '',
        category_ro: service.category_ro || '',
        duration_minutes: parseInt(service.duration_minutes) || 0,
        is_active: String(service.is_active || 'true').toLowerCase() === 'true',
        createdAt: service.created_at || '',
        prices: servicePrices
      }
    })
    
    res.json(vehicleServices)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/body-types', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Body_Types')
    
    if (data.length <= 1) {
      return res.json([])
    }

    const headers = data[0]
    const bodyTypes = data.slice(1).map(row => {
      const bodyType = {}
      headers.forEach((header, index) => {
        bodyType[header.toLowerCase().replace(/ /g, '_')] = row[index] || ''
      })
      
      return {
        id: bodyType.id || '',
        key: bodyType.key || '',
        name: bodyType.name || '',
        sort_order: parseInt(bodyType.sort_order) || 0,
        is_active: String(bodyType.is_active || 'true').toLowerCase() === 'true'
      }
    })
    
    res.json(bodyTypes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/gallery', requireAuth, async (req, res) => {
  try {
    const data = await GoogleSheetsService.getData('Gallery')
    
    if (data.length <= 1) {
      return res.json([])
    }

    const headers = data[0]
    const gallery = data.slice(1).map(row => {
      const item = {}
      headers.forEach((header, index) => {
        item[header.toLowerCase().replace(/ /g, '_')] = row[index] || ''
      })
      
      return {
        id: item.id || '',
        title: item.title || '',
        description: item.description || '',
        url: item.image_url || '',  // Changed from imageUrl to url to match client expectation
        category: item.category || '',
        active: item.Active ? (item.Active.toLowerCase() === 'true') : true, // Default to true if Active column doesn't exist
        createdAt: item.upload_date || ''
      }
    })
    
    res.json(gallery)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Upload new image to gallery
router.post('/gallery', requireAuth, async (req, res) => {
  try {
    const { url, alt_text, category, active } = req.body
    
    if (!url) {
      return res.status(400).json({ error: 'Image URL is required' })
    }
    
    // Generate unique ID
    const id = Date.now().toString()
    const createdAt = new Date().toISOString()
    
    // Prepare data for Google Sheets - as array matching column structure
    const imageData = [
      id,                    // ID
      alt_text || '',        // Title
      alt_text || '',        // Description  
      url,                   // Image URL
      category || 'general', // Category
      active || 'true',      // Active
      createdAt              // Upload Date
    ]
    
    // Add to Google Sheets
    await GoogleSheetsService.appendData('Gallery', imageData)
    
    res.json({ 
      success: true, 
      image: {
        id,
        title: alt_text || '',
        description: alt_text || '',
        image_url: url,
        category: category || 'general',
        created_at: createdAt
      }
    })
  } catch (error) {
    console.error('Error adding gallery image:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

// Delete gallery image
router.delete('/gallery/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    
    const data = await GoogleSheetsService.getData('Gallery')
    
    if (data.length <= 1) {
      return res.status(404).json({ 
        success: false, 
        error: 'No gallery images found' 
      })
    }

    const rowIndex = data.slice(1).findIndex(row => row[0] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Gallery image not found' 
      })
    }

    await GoogleSheetsService.deleteData('Gallery', rowIndex)
    
    res.json({ 
      success: true, 
      message: 'Gallery image deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete gallery image' 
    })
  }
})

// Create new vehicle service
router.post('/vehicle-services', requireAuth, async (req, res) => {
  try {
    const { name, name_en, name_nl, name_es, name_pl, name_ro, description, description_en, description_nl, description_es, description_pl, description_ro, category, category_en, category_nl, category_es, category_pl, category_ro, duration_minutes, is_active, prices } = req.body
    
    // Prepare service data in the format expected by vehicleServicesService
    const serviceData = {
      name: name || '',
      name_en: name_en || '',
      name_nl: name_nl || '',
      name_es: name_es || '',
      name_pl: name_pl || '',
      name_ro: name_ro || '',
      description: description || '',
      description_en: description_en || '',
      description_nl: description_nl || '',
      description_es: description_es || '',
      description_pl: description_pl || '',
      description_ro: description_ro || '',
      category: category || '',
      category_en: category_en || '',
      category_nl: category_nl || '',
      category_es: category_es || '',
      category_pl: category_pl || '',
      category_ro: category_ro || '',
      duration_minutes: duration_minutes || 60,
      is_active: is_active !== undefined ? is_active : true
    }
    
    // Use the vehicleServicesService to create the service with prices
    // This will automatically generate Service_ID and create prices for all body types
    // Include the prices from the request body in serviceData
    const serviceDataWithPrices = {
      ...serviceData,
      prices: prices || []
    }
    
    const result = await vehicleServicesService.addServiceWithPrices(serviceDataWithPrices)
    
    res.json({ 
      success: true, 
      service: result.service,
      prices: result.prices
    })
  } catch (error) {
    console.error('Error creating vehicle service:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

// Update vehicle service
router.put('/vehicle-services/:id', requireAuth, async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id)
    const { name, name_en, name_nl, name_es, name_pl, name_ro, description, description_en, description_nl, description_es, description_pl, description_ro, category, category_en, category_nl, category_es, category_pl, category_ro, duration_minutes, is_active, prices } = req.body
    
    // Get existing services
    const existingData = await GoogleSheetsService.getData('Vehicle_Services')
    if (existingData.length <= 1) {
      return res.status(404).json({ error: 'Service not found' })
    }
    
    const headers = existingData[0]
    const serviceIndex = existingData.findIndex(row => parseInt(row[0]) === serviceId)
    
    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' })
    }
    
    // Update service data
    const updatedService = {
      id: serviceId,
      name: name || existingData[serviceIndex][headers.indexOf('name')] || '',
      name_en: name_en || existingData[serviceIndex][headers.indexOf('name_en')] || '',
      name_nl: name_nl || existingData[serviceIndex][headers.indexOf('name_nl')] || '',
      name_es: name_es || existingData[serviceIndex][headers.indexOf('name_es')] || '',
      name_pl: name_pl || existingData[serviceIndex][headers.indexOf('name_pl')] || '',
      name_ro: name_ro || existingData[serviceIndex][headers.indexOf('name_ro')] || '',
      description: description || existingData[serviceIndex][headers.indexOf('description')] || '',
      description_en: description_en || existingData[serviceIndex][headers.indexOf('description_en')] || '',
      description_nl: description_nl || existingData[serviceIndex][headers.indexOf('description_nl')] || '',
      description_es: description_es || existingData[serviceIndex][headers.indexOf('description_es')] || '',
      description_pl: description_pl || existingData[serviceIndex][headers.indexOf('description_pl')] || '',
      description_ro: description_ro || existingData[serviceIndex][headers.indexOf('description_ro')] || '',
      category: category || existingData[serviceIndex][headers.indexOf('category')] || '',
      category_en: category_en || existingData[serviceIndex][headers.indexOf('category_en')] || '',
      category_nl: category_nl || existingData[serviceIndex][headers.indexOf('category_nl')] || '',
      category_es: category_es || existingData[serviceIndex][headers.indexOf('category_es')] || '',
      category_pl: category_pl || existingData[serviceIndex][headers.indexOf('category_pl')] || '',
      category_ro: category_ro || existingData[serviceIndex][headers.indexOf('category_ro')] || '',
      duration_minutes: duration_minutes !== undefined ? duration_minutes : (existingData[serviceIndex][headers.indexOf('duration_minutes')] || 0),
      is_active: is_active !== undefined ? is_active : (existingData[serviceIndex][headers.indexOf('is_active')] === 'true'),
      created_at: existingData[serviceIndex][headers.indexOf('created_at')] || new Date().toISOString()
    }
    
    // Update service in Google Sheets
    await GoogleSheetsService.updateData('Vehicle_Services', serviceIndex, Object.values(updatedService))
    
    // Update prices if provided
    if (prices && prices.length > 0) {
      // Get existing prices
      const existingPrices = await GoogleSheetsService.getData('Vehicle_Service_Prices')
      
      // Deactivate all existing prices for this service
      if (existingPrices.length > 1) {
        for (let i = 1; i < existingPrices.length; i++) {
          if (parseInt(existingPrices[i][1]) === serviceId) {
            existingPrices[i][8] = 'false' // Set is_active to false
            await GoogleSheetsService.updateData('Vehicle_Service_Prices', i, existingPrices[i])
          }
        }
      }
      
      // Add new prices
      let nextPriceId = existingPrices.length > 1 ? Math.max(...existingPrices.slice(1).map(row => parseInt(row[0]) || 0)) + 1 : 1
      
      const priceData = prices.filter(price => price.price_min !== null && price.price_min !== undefined).map(price => [
        nextPriceId++,
        serviceId,
        price.body_type_key || '',
        price.price_min || 0,
        price.price_max || '',
        'EUR',
        price.duration_minutes || updatedService.duration_minutes,
        0, // promo_percent
        price.is_active !== undefined ? price.is_active : true
      ])
      
      for (const priceRow of priceData) {
        await GoogleSheetsService.appendData('Vehicle_Service_Prices', [priceRow])
      }
    }
    
    res.json({ success: true, service: updatedService })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router