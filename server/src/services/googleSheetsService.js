import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { GOOGLE_SHEETS_STRUCTURE } from '../config/googleSheetsStructure.js';

class GoogleSheetsService {
  constructor() {
    this.doc = null;
    this.isInitialized = false;
    this.isDemoMode = false;
  }

  async initialize() {
    try {
      // Check if Google Sheets credentials are available
      console.log('🔍 Checking Google Sheets credentials...')
      console.log('📊 SPREADSHEET_ID:', process.env.GOOGLE_SHEETS_SPREADSHEET_ID)
      console.log('📧 SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
      console.log('🔑 PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY)
      
      if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.log('⚠️  Google Sheets credentials not configured - switching to demo mode');
        this.isDemoMode = true;
        this.isInitialized = true;
        return true;
      }

      // Clean private key - remove surrounding quotes if present
      let privateKey = process.env.GOOGLE_PRIVATE_KEY;
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      
      const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: privateKey.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID, serviceAccountAuth);
      await this.doc.loadInfo();
      
      // Initialize spreadsheet structure if needed
      await this.initializeSpreadsheetStructure();
      
      this.isInitialized = true;
      console.log('✅ Google Sheets service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets service:', error);
      throw error;
    }
  }

  // Demo data generators
  getDemoData(sheetName) {
    console.log(`📊 Returning demo data for ${sheetName}`);
    
    switch (sheetName) {
      case 'Services':
        return [
          ['ID', 'Name_NL', 'Name_EN', 'Name_ES', 'Name_PL', 'Name_RO', 'Description_NL', 'Description_EN', 'Description_ES', 'Description_PL', 'Description_RO', 'Price', 'Active', 'Created_Date', 'Updated_Date'],
          ['1', 'Auto Detailing', 'Auto Detailing', 'Detallado de Auto', 'Detailing Samochodu', 'Detailing Auto', 'Complete auto detailing service', 'Complete auto detailing service', 'Servicio completo de detallado de auto', 'Kompletna usługa detailingu samochodu', 'Serviciu complet de detailing auto', '150.00', 'true', '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z'],
          ['2', 'Polijsten', 'Polishing', 'Pulido', 'Polerowanie', 'Polish', 'Professional car polishing', 'Professional car polishing', 'Pulido profesional de coche', 'Profesjonalne polerowanie samochodu', 'Polish profesional auto', '200.00', 'true', '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z'],
          ['3', 'Keramische Coating', 'Ceramic Coating', 'Revestimiento Cerámico', 'Powłoka Ceramiczna', 'Coating Ceramic', 'Premium ceramic coating protection', 'Premium ceramic coating protection', 'Protección de revestimiento cerámico premium', 'Premierowa ochrona powłoką ceramiczną', 'Protecție premium cu coating ceramic', '500.00', 'true', '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z']
        ];
      case 'Bookings':
        return [
          ['ID', 'Date', 'Time', 'Service_ID', 'Customer_Name', 'Customer_Email', 'Customer_Phone', 'Vehicle_Make', 'Vehicle_Model', 'Vehicle_Year', 'Vehicle_License_Plate', 'Status', 'Notes', 'Created_Date', 'Updated_Date'],
          ['1', '2024-01-15', '09:00', '1', 'John Doe', 'john@example.com', '+1234567890', 'BMW', 'X5', '2020', 'ABC123', 'confirmed', 'Customer requested premium service', '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z']
        ];
      case 'Newsletter_subscribers':
        return [
          ['Email', 'Name', 'Locale', 'IP_Address', 'Subscribed_Date'],
          ['demo@example.com', 'Demo User', 'en', '127.0.0.1', '2024-01-01T00:00:00.000Z']
        ];
      case 'Testimonials':
          return [
            ['ID', 'Name', 'Rating', 'Comment_NL', 'Comment_EN', 'Comment_ES', 'Comment_PL', 'Comment_RO', 'Active', 'Created_Date'],
            ['test-001', 'Test Client', '5', 'Excelent serviciu! Mașina mea arată ca nouă după detalierea premium.', 'Excellent service! My car looks brand new after premium detailing.', '¡Excelente servicio! Mi auto se ve como nuevo después del detallado premium.', 'Doskonała obsługa! Moje auto wygląda jak nowe po premium detailingu.', 'Serviciu excelent! Mașina mea arată ca nouă după detailing premium.', 'true', '2025-11-20'],
            ['testimonial-1', 'Alex Johnson', '5', 'Excellent service! My car looks brand new.', 'Excellent service! My car looks brand new after premium detailing.', '¡Excelente servicio! Mi auto se ve como nuevo después del detallado premium.', 'Doskonała obsługa! Moje auto wygląda jak nowe po premium detailingu.', 'Serviciu excelent! Mașina mea arată ca nouă după detailing premium.', 'true', '2024-01-05']
          ];
      default:
        return [['Demo header'], ['Demo data']];
    }
  }

  async initializeSpreadsheetStructure() {
    try {
      // Create sheets if they don't exist
      for (const [sheetKey, config] of Object.entries(GOOGLE_SHEETS_STRUCTURE)) {
        let sheet = this.doc.sheetsByTitle[config.sheetName];
        
        if (!sheet) {
          sheet = await this.doc.addSheet({ title: config.sheetName });
          console.log(`📊 Created sheet: ${config.sheetName}`);
        }

        try {
          // Try to load header row - this will fail if sheet is empty
          await sheet.loadHeaderRow();
          
          // If we get here, headers exist
          console.log(`✅ Sheet ${config.sheetName} already has headers`);
        } catch (headerError) {
          // If loading headers fails, it means the sheet is empty
          console.log(`📝 Sheet ${config.sheetName} is empty, setting up headers...`);
          
          // Set headers by adding a row with header values
          await sheet.setHeaderRow(config.columns);
          console.log(`✅ Set headers for ${config.sheetName}`);
        }
      }
    } catch (error) {
      console.error('❌ Error initializing spreadsheet structure:', error);
      throw error;
    }
  }

  async getData(sheetName) {
    try {
      // Return demo data if in demo mode
      if (this.isDemoMode) {
        return this.getDemoData(sheetName);
      }

      // Check if service is initialized
      if (!this.isInitialized || !this.doc) {
        console.log(`⚠️  Google Sheets service not initialized, using demo data for ${sheetName}`);
        return this.getDemoData(sheetName);
      }

      const sheet = this.doc.sheetsByTitle[sheetName];
      if (!sheet) {
        console.log(`⚠️  Sheet ${sheetName} not found, returning empty array`);
        return [['No data']]; // Return minimal array to avoid errors
      }

      await sheet.loadCells();
      
      // Try to get all rows including header
      const rowCount = sheet.rowCount;
      const columnCount = sheet.columnCount;
      
      console.log(`📊 Sheet ${sheetName} has ${rowCount} rows and ${columnCount} columns`);
      
      const allRows = [];
      
      // Read all cells
      for (let row = 0; row < rowCount; row++) {
        const rowData = [];
        for (let col = 0; col < columnCount; col++) {
          const cell = sheet.getCell(row, col);
          rowData.push(cell.value || '');
        }
        // Only add rows that have at least one non-empty cell
        if (rowData.some(cell => cell !== '')) {
          allRows.push(rowData);
        }
      }
      
      console.log(`📊 Found ${allRows.length} valid rows in ${sheetName}`);
      
      // Return minimal structure if no data found
      if (allRows.length === 0) {
        console.log(`⚠️  No data found in ${sheetName}, returning empty structure`);
        return [['No data']];
      }
      
      return allRows;
    } catch (error) {
      console.error(`❌ Error getting data from ${sheetName}:`, error);
      throw error;
    }
  }

  async appendData(sheetName, data) {
    try {
      // Simulate success in demo mode
      if (this.isDemoMode) {
        console.log(`📊 Demo mode: Simulating append to ${sheetName}`, data);
        return true;
      }

      const sheet = this.doc.sheetsByTitle[sheetName];
      if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found`);
      }

      await sheet.addRow(data);
      return true;
    } catch (error) {
      console.error(`❌ Error appending data to ${sheetName}:`, error);
      throw error;
    }
  }

  async updateData(sheetName, rowIndex, data) {
    try {
      // Simulate success in demo mode
      if (this.isDemoMode) {
        console.log(`📊 Demo mode: Simulating update in ${sheetName} at row ${rowIndex}`, data);
        return true;
      }

      const sheet = this.doc.sheetsByTitle[sheetName];
      if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found`);
      }

      const rows = await sheet.getRows();
      if (rowIndex >= 0 && rowIndex < rows.length) {
        Object.assign(rows[rowIndex], data);
        await rows[rowIndex].save();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Error updating data in ${sheetName}:`, error);
      throw error;
    }
  }

  async deleteData(sheetName, rowIndex) {
    try {
      // Simulate success in demo mode
      if (this.isDemoMode) {
        console.log(`📊 Demo mode: Simulating delete from ${sheetName} at row ${rowIndex}`);
        return true;
      }

      const sheet = this.doc.sheetsByTitle[sheetName];
      if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found`);
      }

      const rows = await sheet.getRows();
      if (rowIndex >= 0 && rowIndex < rows.length) {
        await rows[rowIndex].delete();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Error deleting data from ${sheetName}:`, error);
      throw error;
    }
  }

  // Specific methods for different data types
  async getServices(locale = 'nl', activeOnly = true) {
    const data = await this.getData('Services');
    if (data.length <= 1) return [];

    const headers = data[0];
    const nameIndex = headers.indexOf(`Name_${locale.toUpperCase()}`);
    const descIndex = headers.indexOf(`Description_${locale.toUpperCase()}`);
    const priceIndex = headers.indexOf('Price');
    const activeIndex = headers.indexOf('Active');

    return data.slice(1)
      .filter(row => !activeOnly || row[activeIndex] === 'true')
      .map(row => ({
        id: row[0],
        name: row[nameIndex] || row[headers.indexOf('Name_NL')],
        description: row[descIndex] || row[headers.indexOf('Description_NL')],
        price: parseFloat(row[priceIndex]) || 0,
        active: row[activeIndex] === 'true'
      }));
  }

  async getBookingsByDate(date) {
    const data = await this.getData('Bookings');
    if (data.length <= 1) return [];

    const headers = data[0];
    const dateIndex = headers.indexOf('Date');
    
    return data.slice(1).filter(row => row[dateIndex] === date);
  }

  async checkDateAvailability(date) {
    const bookings = await this.getBookingsByDate(date);
    const maxBookings = parseInt(process.env.MAX_BOOKINGS_PER_DAY || '1');
    return bookings.length < maxBookings;
  }

  async addNewsletterSubscriber(email, name, locale, ip) {
    return await this.appendData('Newsletter_subscribers', [
      email,
      name || '',
      locale,
      ip,
      new Date().toISOString()
    ]);
  }

  // Vehicle Services with Body Type Pricing
  async getBodyTypes() {
    const data = await this.getData('Body_Types');
    if (data.length <= 1) return [];

    const headers = data[0];
    const idIndex = headers.indexOf('ID');
    const keyIndex = headers.indexOf('Key');
    const nameIndex = headers.indexOf('Name');
    const sortOrderIndex = headers.indexOf('Sort_Order');
    const isActiveIndex = headers.indexOf('Is_Active');

    return data.slice(1)
      .filter(row => row[isActiveIndex] === 'true')
      .map(row => ({
        id: parseInt(row[idIndex]) || 0,
        key: row[keyIndex],
        name: row[nameIndex],
        sort_order: parseInt(row[sortOrderIndex]) || 0,
        is_active: row[isActiveIndex] === 'true'
      }))
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  createSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async getServicesWithPrices() {
    const servicesData = await this.getData('Vehicle_Services');
    const pricesData = await this.getData('Vehicle_Service_Prices');

    console.log('DEBUG: Vehicle_Services data length:', servicesData?.length || 0);
    console.log('DEBUG: Vehicle_Service_Prices data length:', pricesData?.length || 0);
    console.log('DEBUG: Services headers:', servicesData?.[0] || 'No headers');
    console.log('DEBUG: Prices headers:', pricesData?.[0] || 'No headers');

    if (servicesData.length <= 1) return [];

    const servicesHeaders = servicesData[0];
    const pricesHeaders = pricesData.length > 0 ? pricesData[0] : [];

    // Map prices by service_id and body_type_id
    const pricesMap = {};
    console.log('DEBUG: Processing prices data, total rows:', pricesData.length - 1);
    console.log('DEBUG: Prices data sample (first 2 rows):');
    pricesData.slice(1, 3).forEach((row, index) => {
      console.log(`DEBUG: Price row ${index + 1}:`);
      row.forEach((cell, cellIndex) => {
        if (cell !== '' && cell !== null && cell !== undefined) {
          console.log(`  Column ${cellIndex}: "${cell}"`);
        }
      });
    });
    
    if (pricesData.length > 1) {
      pricesData.slice(1).forEach((row, index) => {
        const serviceId = row[pricesHeaders.indexOf('Service_ID')];
        const bodyTypeId = row[pricesHeaders.indexOf('Body_Type_ID')];
        const isActive = row[pricesHeaders.indexOf('Is_Active')] === 'true';
        
        console.log(`DEBUG: Price row ${index + 1} - Service_ID: "${serviceId}", Body_Type_ID: "${bodyTypeId}", Is_Active: ${isActive}`);
        
        if (isActive && serviceId && bodyTypeId) {
          const key = `${serviceId}_${bodyTypeId}`;
          pricesMap[key] = {
            id: parseInt(row[pricesHeaders.indexOf('ID')]) || 0,
            body_type_id: bodyTypeId,
            bodyTypeName: bodyTypeId, // Use ID as name since we don't have separate body types sheet
            price_min: parseFloat(row[pricesHeaders.indexOf('Price_Min')]) || 0,
            price_max: parseFloat(row[pricesHeaders.indexOf('Price_Max')]) || null,
            currency: row[pricesHeaders.indexOf('Currency')] || 'EUR',
            duration_minutes: parseInt(row[pricesHeaders.indexOf('Duration_Minutes')]) || 0,
            promo_percent: parseInt(row[pricesHeaders.indexOf('Promo_Percent')]) || 0,
            is_active: isActive
          };
          console.log(`DEBUG: Added price to map for service ${serviceId}, body type ${bodyTypeId}`);
        }
      });
    }
    
    console.log('DEBUG: Total prices in map:', Object.keys(pricesMap).length);

    // Build services with prices for all body types
    const allServices = servicesData.slice(1);
    console.log('DEBUG: All services before filtering:', allServices.length);
    console.log('DEBUG: Services data sample (first 2 rows):');
    allServices.slice(0, 2).forEach((row, index) => {
      console.log(`DEBUG: Service row ${index + 1}:`);
      row.forEach((cell, cellIndex) => {
        if (cell !== '' && cell !== null && cell !== undefined) {
          console.log(`  Column ${cellIndex} (${servicesHeaders[cellIndex]}): "${cell}"`);
        }
      });
    });
    
    const activeServices = allServices
      .filter(row => {
        const isActive = row[servicesHeaders.indexOf('Is_Active')];
        console.log('DEBUG: Checking Is_Active value:', isActive, 'type:', typeof isActive);
        return isActive === 'true' || isActive === true;
      });
    
    console.log('DEBUG: Active services found:', activeServices.length);
    console.log('DEBUG: First active service:', activeServices[0]);
    
    return activeServices.map(row => {
        const serviceId = row[servicesHeaders.indexOf('ID')];
        const serviceIdStr = serviceId.toString();
        
        // Get all prices for this service
        const servicePrices = [];
        
        console.log(`DEBUG: Looking for prices for service ${serviceIdStr}`);
    console.log(`DEBUG: Available price keys in map:`, Object.keys(pricesMap));
        
        // Find all prices for this service ID
        Object.keys(pricesMap).forEach(key => {
          console.log(`DEBUG: Checking key: ${key} against ${serviceIdStr}_`);
          if (key.startsWith(`${serviceIdStr}_`)) {
            servicePrices.push(pricesMap[key]);
            console.log(`DEBUG: Added price for service ${serviceIdStr}:`, pricesMap[key]);
          }
        });
        
        console.log(`DEBUG: Total prices found for service ${serviceIdStr}:`, servicePrices.length);
        
        return {
          id: parseInt(serviceId) || 0,
          slug: this.createSlug(row[servicesHeaders.indexOf('Name_EN')]),
          name: row[servicesHeaders.indexOf('Name_EN')], // Use English name as default
          description: row[servicesHeaders.indexOf('Description_EN')], // Use English description as default
          category: row[servicesHeaders.indexOf('Category_EN')],
          image_url: '', // No image URL in Vehicle_Services structure
          duration_minutes: parseInt(row[servicesHeaders.indexOf('Duration_Minutes')]) || 0,
          is_active: row[servicesHeaders.indexOf('Is_Active')] === 'true',
          prices: servicePrices
        };
      });
  }

  async updateServices(services) {
    try {
      // Dacă suntem în mod demo, nu facem nimic
      if (this.isDemoMode) {
        console.log('📊 Demo mode: Skipping Google Sheets sync for services');
        return true;
      }
      
      // Folosește metoda incrementală pentru actualizare
      return await this.updateServicesIncremental(services);
    } catch (error) {
      console.error('❌ Error updating services:', error);
      throw error;
    }
  }

  async updateServicesIncremental(services) {
    try {
      const sheet = this.doc.sheetsByTitle['Vehicle_Services'];
      if (!sheet) {
        throw new Error('Vehicle_Services sheet not found');
      }

      // Obține toate rândurile existente pentru a compara
      const existingRows = await sheet.getRows();
      const existingServicesMap = new Map();
      
      // Creează o hartă cu serviciile existente pentru căutare rapidă
      existingRows.forEach(row => {
        const serviceId = row.get('ID');
        if (serviceId) {
          existingServicesMap.set(serviceId.toString(), row);
        }
      });

      let addedCount = 0;
      let updatedCount = 0;

      // Procesează fiecare serviciu
      for (const service of services) {
        const serviceId = service.id.toString();
        const existingRow = existingServicesMap.get(serviceId);

        if (existingRow) {
          // Actualizează serviciul existent
          existingRow.set('Name', service.name);
          existingRow.set('Name_EN', service.name);
          existingRow.set('Name_NL', service.name);
          existingRow.set('Name_ES', service.name);
          existingRow.set('Name_PL', service.name);
          existingRow.set('Name_RO', service.name);
          existingRow.set('Description', service.description);
          existingRow.set('Description_EN', service.description);
          existingRow.set('Description_NL', service.description);
          existingRow.set('Description_ES', service.description);
          existingRow.set('Description_PL', service.description);
          existingRow.set('Description_RO', service.description);
          existingRow.set('Category', service.category);
          existingRow.set('Category_EN', service.category);
          existingRow.set('Category_NL', service.category);
          existingRow.set('Category_ES', service.category);
          existingRow.set('Category_PL', service.category);
          existingRow.set('Category_RO', service.category);
          existingRow.set('Duration_Minutes', service.duration_minutes);
          existingRow.set('Is_Active', service.is_active);
          existingRow.set('Updated_At', new Date().toISOString());
          
          await existingRow.save();
          updatedCount++;
        } else {
          // Adaugă serviciu nou folosind appendRow pentru performanță optimă
          const newRowData = {
            'ID': service.id,
            'Name': service.name,
            'Name_EN': service.name,
            'Name_NL': service.name,
            'Name_ES': service.name,
            'Name_PL': service.name,
            'Name_RO': service.name,
            'Description': service.description,
            'Description_EN': service.description,
            'Description_NL': service.description,
            'Description_ES': service.description,
            'Description_PL': service.description,
            'Description_RO': service.description,
            'Category': service.category,
            'Category_EN': service.category,
            'Category_NL': service.category,
            'Category_ES': service.category,
            'Category_PL': service.category,
            'Category_RO': service.category,
            'Duration_Minutes': service.duration_minutes,
            'Is_Active': service.is_active,
            'Created_At': new Date().toISOString()
          };
          
          await sheet.addRow(newRowData);
          addedCount++;
        }
      }

      console.log(`✅ Incremental update completed: ${addedCount} added, ${updatedCount} updated in Vehicle_Services sheet`);
      return true;
    } catch (error) {
      console.error('❌ Error with incremental services update:', error);
      throw error;
    }
  }

  async updateServicePrices(prices) {
    try {
      // Dacă suntem în mod demo, nu facem nimic
      if (this.isDemoMode) {
        console.log('📊 Demo mode: Skipping Google Sheets sync for service prices');
        return true;
      }
      
      // Folosește metoda incrementală pentru actualizare
      return await this.updateServicePricesIncremental(prices);
    } catch (error) {
      console.error('❌ Error updating service prices:', error);
      throw error;
    }
  }

  async updateServicePricesIncremental(prices) {
    try {
      const sheet = this.doc.sheetsByTitle['Vehicle_Service_Prices'];
      if (!sheet) {
        throw new Error('Vehicle_Service_Prices sheet not found');
      }

      // Obține toate rândurile existente pentru a compara
      const existingRows = await sheet.getRows();
      const existingPricesMap = new Map();
      
      // Creează o hartă cu prețurile existente pentru căutare rapidă
      // Cheia unică este combinația dintre Service_ID și Body_Type_ID
      existingRows.forEach(row => {
        const serviceId = row.get('Service_ID');
        const bodyTypeId = row.get('Body_Type_ID');
        const priceId = row.get('ID');
        
        if (serviceId && bodyTypeId) {
          const key = `${serviceId}_${bodyTypeId}`;
          existingPricesMap.set(key, { row, priceId: priceId?.toString() });
        }
      });

      let addedCount = 0;
      let updatedCount = 0;

      // Procesează fiecare preț
      for (const price of prices) {
        const key = `${price.service_id}_${price.body_type_id}`;
        const existingData = existingPricesMap.get(key);

        if (existingData) {
          // Actualizează prețul existent
          const { row } = existingData;
          row.set('Service_ID', price.service_id);
          row.set('Body_Type_ID', price.body_type_id);
          row.set('Price_Min', price.price_min);
          row.set('Price_Max', price.price_max);
          row.set('Currency', price.currency);
          row.set('Duration_Minutes', price.duration_minutes);
          row.set('Promo_Percent', price.promo_percent);
          row.set('Is_Active', price.is_active);
          
          await row.save();
          updatedCount++;
        } else {
          // Adaugă preț nou folosind appendRow pentru performanță optimă
          const newRowData = {
            'ID': price.id,
            'Service_ID': price.service_id,
            'Body_Type_ID': price.body_type_id,
            'Price_Min': price.price_min,
            'Price_Max': price.price_max,
            'Currency': price.currency,
            'Duration_Minutes': price.duration_minutes,
            'Promo_Percent': price.promo_percent,
            'Is_Active': price.is_active
          };
          
          await sheet.addRow(newRowData);
          addedCount++;
        }
      }

      console.log(`✅ Incremental update completed: ${addedCount} added, ${updatedCount} updated in Vehicle_Service_Prices sheet`);
      return true;
    } catch (error) {
      console.error('❌ Error with incremental service prices update:', error);
      throw error;
    }
  }
}

export default new GoogleSheetsService();