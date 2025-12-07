import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { GOOGLE_SHEETS_STRUCTURE } from '../config/googleSheetsStructure.js';
import { translateMultipleWithDeepL, detectLanguageWithDeepL } from './deeplTranslationService.js';
import { BODY_TYPES } from '../config/bodyTypesConfig.js';

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
      console.log('🌍 NODE_ENV:', process.env.NODE_ENV)
      
      if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
        console.log('⚠️  Google Sheets spreadsheet ID not configured - service will not initialize');
        this.isDemoMode = false; // Explicitly disable demo mode
        this.isInitialized = false;
        return false;
      }

      try {
        // Try to use service account JSON file first
        let serviceAccountAuth;
        const serviceAccountPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || './config/service-account.json';
        
        try {
          // Import fs to read the service account file
          const fs = await import('fs');
          const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
          
          serviceAccountAuth = new JWT({
            email: serviceAccount.client_email,
            key: serviceAccount.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          });
          
          console.log('✅ Using service account JSON file for authentication');
        } catch (fileError) {
          console.log('📄 Service account JSON file not found or invalid, trying environment variables...');
          
          // Fallback to environment variables
          if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            console.log('⚠️  Google Sheets credentials not configured - service will not initialize');
            this.isDemoMode = false;
            this.isInitialized = false;
            return false;
          }

          // Clean private key - remove surrounding quotes if present and handle formatting
          let privateKey = process.env.GOOGLE_PRIVATE_KEY;
          console.log('🔑 Raw private key length:', privateKey.length);
          
          // Remove surrounding quotes if present (handles both single and double quotes)
          if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || 
              (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
            privateKey = privateKey.slice(1, -1);
          }
          
          // Replace escaped newlines with actual newlines (for cases where \n is used)
          privateKey = privateKey.replace(/\\n/g, '\n');
          
          // Ensure proper line endings - replace any remaining \r or mixed line endings
          privateKey = privateKey.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
          
          console.log('🔑 Cleaned private key length:', privateKey.length);
          
          // Additional private key validation and formatting
          if (!privateKey.includes('BEGIN PRIVATE KEY') || !privateKey.includes('END PRIVATE KEY')) {
            throw new Error('Invalid private key format: missing BEGIN/END markers');
          }
          
          const formattedKey = privateKey.trim();
          
          serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: formattedKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          });
          
          console.log('✅ Using environment variables for authentication');
        }

        this.doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID, serviceAccountAuth);
        await this.doc.loadInfo();
        
        // Initialize spreadsheet structure if needed
        await this.initializeSpreadsheetStructure();
        
        this.isInitialized = true;
        console.log('✅ Google Sheets service initialized successfully');
        return true;
      } catch (authError) {
        console.error('❌ Google Sheets authentication failed:', authError.message);
        console.error('❌ Full auth error:', authError);
        // Enable demo mode when authentication fails
        console.log('⚠️  Enabling demo mode due to authentication failure');
        this.isDemoMode = true;
        this.isInitialized = true; // Consider it initialized in demo mode
        return true; // Return success for demo mode
      }
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets service:', error);
      // DO NOT fall back to demo mode - let the service fail properly
      this.isDemoMode = false;
      this.isInitialized = false;
      throw new Error(`Failed to initialize Google Sheets service: ${error.message}`);
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
          ['ID', 'Name', 'Email', 'Phone', 'Date', 'Services', 'Total', 'Status', 'Created At', 'Make', 'Model', 'Type', 'Body'],
          ['1', 'John Doe', 'john@example.com', '+1234567890', '2024-01-15T09:00:00.000Z', '[{"name":"Premium Detailing","price":150}]', '150.00', 'confirmed', '2024-01-01T00:00:00.000Z', 'BMW', 'X5', 'SUV', 'SUV'],
          ['2', 'Jane Smith', 'jane@example.com', '+0987654321', '2024-01-16T14:00:00.000Z', 'Interior Cleaning, Exterior Wash', '80.00', 'pending', '2024-01-02T10:30:00.000Z', 'Audi', 'A4', 'Sedan', 'Sedan'],
          ['3', 'Mike Johnson', 'mike@example.com', '+1122334455', '2024-01-17T11:00:00.000Z', '[{"name":"Ceramic Coating","price":500}]', '500.00', 'confirmed', '2024-01-03T09:15:00.000Z', 'Mercedes', 'C-Class', 'Sedan', 'Sedan']
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
      case 'Vehicles':
        return [
          ['ID', 'Make_NL', 'Make_EN', 'Model_NL', 'Model_EN', 'Type_NL', 'Type_EN', 'Body_NL', 'Body_EN'],
          ['1', 'BMW', 'BMW', 'Seria 3', 'Series 3', 'Sedan', 'Sedan', 'Sedan', 'Sedan'],
          ['2', 'BMW', 'BMW', 'Seria 5', 'Series 5', 'Sedan', 'Sedan', 'Sedan', 'Sedan'],
          ['3', 'Audi', 'Audi', 'A4', 'A4', 'Sedan', 'Sedan', 'Sedan', 'Sedan'],
          ['4', 'Audi', 'Audi', 'Q5', 'Q5', 'SUV', 'SUV', 'SUV', 'SUV'],
          ['5', 'Mercedes', 'Mercedes', 'C-Klasse', 'C-Class', 'Sedan', 'Sedan', 'Sedan', 'Sedan'],
          ['6', 'Mercedes', 'Mercedes', 'GLE', 'GLE', 'SUV', 'SUV', 'SUV', 'SUV']
        ];
      case 'Vehicle_Services':
        return [
          ['ID', 'Name', 'Name_EN', 'Name_NL', 'Description', 'Description_EN', 'Description_NL', 'Category', 'Category_EN', 'Category_NL', 'Duration_Minutes', 'Is_Active'],
          ['1', 'Premium Wash', 'Premium Wash', 'Premium Was', 'Complete exterior cleaning with premium products', 'Complete exterior cleaning with premium products', 'Complete exterieur reiniging met premium producten', 'exterior', 'exterior', 'exterieur', '45', 'true'],
          ['2', 'Interior Detail', 'Interior Detail', 'Interieur Detail', 'Deep interior cleaning with extraction and deodorizing', 'Deep interior cleaning with extraction and deodorizing', 'Diep interieur reiniging met extractie en deodoriseren', 'interior', 'interior', 'interieur', '120', 'true']
        ];
      case 'Vehicle_Service_Prices':
        return [
          ['ID', 'Service_ID', 'Body_Type_ID', 'Price_Min', 'Price_Max', 'Currency', 'Duration_Minutes', 'Is_Active'],
          ['1', '1', 'sedan', '25', '35', 'EUR', '45', 'true'],
          ['2', '1', 'suv', '35', '45', 'EUR', '45', 'true'],
          ['3', '2', 'sedan', '100', '130', 'EUR', '120', 'true'],
          ['4', '2', 'suv', '120', '150', 'EUR', '120', 'true']
        ];
      case 'Gallery':
        return [
          ['ID', 'Image_URL', 'Description', 'Category', 'Active', 'Upload_Date'],
          ['img1', 'https://example.com/image1.jpg', 'Mașină premium detailing', 'exterior', 'true', '2024-01-01'],
          ['img2', 'https://example.com/image2.jpg', 'Interior curățat profesional', 'interior', 'true', '2024-01-02'],
          ['img3', 'https://example.com/image3.jpg', 'Ceramic coating aplicație', 'protection', 'true', '2024-01-03']
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
      if (this.isDemoMode) {
        return this.getDemoData(sheetName);
      }
      // Force real Google Sheets operation - no more demo mode
      if (!this.isInitialized || !this.doc) {
        throw new Error('Google Sheets service not properly initialized for getting data');
      }

      // Ensure document info is loaded
      try {
        if (!this.doc.title) {
          await this.doc.loadInfo();
        }
      } catch (loadError) {
        console.log(`⚠️  Document info not loaded, loading now: ${loadError.message}`);
        await this.doc.loadInfo();
      }

      const sheet = this.doc.sheetsByTitle[sheetName];
      if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found`);
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
      // Force real Google Sheets operation - no more demo mode
      if (!this.isInitialized || !this.doc) {
        throw new Error('Google Sheets service not properly initialized for appending data');
      }

      // Ensure document info is loaded
      try {
        if (!this.doc.title) {
          await this.doc.loadInfo();
        }
      } catch (loadError) {
        console.log(`⚠️  Document info not loaded, loading now: ${loadError.message}`);
        await this.doc.loadInfo();
      }

      const sheet = this.doc.sheetsByTitle[sheetName];
      if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found`);
      }

      // Încarcă header-ele pentru a obține numărul de coloane
      await sheet.loadHeaderRow();
      const numColumns = sheet.headerValues.length;
      
      // Obține numărul total de rânduri pentru a ști unde să adăugăm
      await sheet.loadCells();
      const lastRow = sheet.rowCount;
      
      console.log(`📊 Sheet ${sheetName} has ${numColumns} columns and ${lastRow} total rows`);
      
      // Verificăm dacă avem destule coloane în datele noastre
      if (Array.isArray(data) && data.length < numColumns) {
        // Completăm cu valori goale până la numărul de coloane
        const paddedData = [...data];
        while (paddedData.length < numColumns) {
          paddedData.push('');
        }
        
        console.log(`🔧 Padded data from ${data.length} to ${paddedData.length} columns`);
        
        // Folosim Google Sheets API direct pentru a append la sfârșit
        try {
          await sheet.addRow(paddedData);
          console.log(`✅ Successfully appended data to ${sheetName} using addRow`);
        } catch (addRowError) {
          console.log(`⚠️  addRow failed, trying loadCells approach: ${addRowError.message}`);
          
          // Încercăm o abordare diferită - găsim primul rând gol
          let firstEmptyRow = 1; // Începem de la rândul 2 (după header)
          for (let row = 1; row <= Math.min(lastRow, 1000); row++) {
            const cell = sheet.getCell(row, 0);
            if (!cell.value || cell.value === '') {
              firstEmptyRow = row;
              break;
            }
          }
          
          console.log(`🔍 Found first empty row at: ${firstEmptyRow}`);
          
          // Adăugăm datele la primul rând gol
          for (let col = 0; col < paddedData.length; col++) {
            const cell = sheet.getCell(firstEmptyRow, col);
            cell.value = paddedData[col];
          }
          
          await sheet.saveUpdatedCells();
          console.log(`✅ Successfully saved data to row ${firstEmptyRow}`);
        }
      } else {
        // Dacă datele au suficiente coloane, folosim addRow direct
        await sheet.addRow(data);
        console.log(`✅ Successfully appended data to ${sheetName}`);
      }
      
      return true;
    } catch (error) {
      console.error(`❌ Error appending data to ${sheetName}:`, error);
      throw error;
    }
  }

  async appendDataWithFormats(sheetName, data, formats = {}) {
    try {
      // Force real Google Sheets operation - no more demo mode
      if (!this.isInitialized || !this.doc) {
        throw new Error('Google Sheets service not properly initialized for appending formatted data');
      }

      // Ensure document info is loaded
      try {
        if (!this.doc.title) {
          await this.doc.loadInfo();
        }
      } catch (loadError) {
        console.log(`⚠️  Document info not loaded, loading now: ${loadError.message}`);
        await this.doc.loadInfo();
      }

      const sheet = this.doc.sheetsByTitle[sheetName];
      if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found`);
      }

      // Create a copy of data to modify
      const formattedData = [...data];
      
      // Apply text formatting by adding single quote prefix
      for (const [colIndex, format] of Object.entries(formats)) {
        if (format === 'TEXT' && formattedData[parseInt(colIndex)]) {
          formattedData[parseInt(colIndex)] = `'${formattedData[parseInt(colIndex)]}`;
        }
      }

      // Add the formatted row
      await sheet.addRow(formattedData);
      console.log(`✅ Successfully appended formatted data to ${sheetName}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Error appending data with formats to ${sheetName}:`, error);
      throw error;
    }
  }

  async updateData(sheetName, rowIndex, data) {
    try {
      // Force real Google Sheets operation - no more demo mode
      if (!this.isInitialized || !this.doc) {
        throw new Error('Google Sheets service not properly initialized for updating data');
      }

      // Ensure document info is loaded
      try {
        if (!this.doc.title) {
          await this.doc.loadInfo();
        }
      } catch (loadError) {
        console.log(`⚠️  Document info not loaded, loading now: ${loadError.message}`);
        await this.doc.loadInfo();
      }

      const sheet = this.doc.sheetsByTitle[sheetName];
      if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found`);
      }

      const rows = await sheet.getRows();
      if (rowIndex >= 0 && rowIndex < rows.length) {
        Object.assign(rows[rowIndex], data);
        await rows[rowIndex].save();
        console.log(`✅ Successfully updated row ${rowIndex} in ${sheetName}`);
        return true;
      }
      console.log(`❌ Row index ${rowIndex} not found in ${sheetName}`);
      return false;
    } catch (error) {
      console.error(`❌ Error updating data in ${sheetName}:`, error);
      throw error;
    }
  }

  async deleteData(sheetName, rowIndex) {
    try {
      // Force real Google Sheets operation - no more demo mode
      if (!this.isInitialized || !this.doc) {
        throw new Error('Google Sheets service not properly initialized for deletion');
      }

      // Ensure document info is loaded
      try {
        if (!this.doc.title) {
          await this.doc.loadInfo();
        }
      } catch (loadError) {
        console.log(`⚠️  Document info not loaded, loading now: ${loadError.message}`);
        await this.doc.loadInfo();
      }

      const sheet = this.doc.sheetsByTitle[sheetName];
      if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found`);
      }

      const rows = await sheet.getRows();
      if (rowIndex >= 0 && rowIndex < rows.length) {
        await rows[rowIndex].delete();
        console.log(`✅ Successfully deleted row ${rowIndex} from ${sheetName}`);
        return true;
      }
      console.log(`❌ Row index ${rowIndex} not found in ${sheetName}`);
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

  // Helper function to map body type ID to key
  getBodyTypeKeyById(bodyTypeId) {
    console.log(`DEBUG getBodyTypeKeyById: input="${bodyTypeId}", type=${typeof bodyTypeId}`);
    if (!bodyTypeId) return 'default';
    
    // If it's already a string key, return it
    if (typeof bodyTypeId === 'string' && !/^\d+$/.test(bodyTypeId)) {
      console.log(`DEBUG getBodyTypeKeyById: returning string key "${bodyTypeId}"`);
      return bodyTypeId;
    }
    
    // If it's a numeric ID, find the corresponding body type
    const numericId = parseInt(bodyTypeId);
    console.log(`DEBUG getBodyTypeKeyById: looking for numeric ID ${numericId}`);
    const bodyType = BODY_TYPES.find(bt => bt.id === numericId);
    const result = bodyType ? bodyType.key : 'default';
    console.log(`DEBUG getBodyTypeKeyById: found body type`, bodyType, 'returning key:', result);
    return result;
  }

  // Helper function to get body type name by ID
  getBodyTypeNameById(bodyTypeId) {
    if (!bodyTypeId) return 'Default';
    
    // If it's already a string key, find the name
    if (typeof bodyTypeId === 'string' && !/^\d+$/.test(bodyTypeId)) {
      const bodyType = BODY_TYPES.find(bt => bt.key === bodyTypeId);
      return bodyType ? bodyType.name : bodyTypeId;
    }
    
    // If it's a numeric ID, find the corresponding body type
    const numericId = parseInt(bodyTypeId);
    const bodyType = BODY_TYPES.find(bt => bt.id === numericId);
    return bodyType ? bodyType.name : `Type ${bodyTypeId}`;
  }

  async getServicesWithPrices(lang = 'nl') {
    try {
      const servicesData = await this.getData('Vehicle_Services');
      const pricesData = await this.getData('Vehicle_Service_Prices');

    console.log('DEBUG: Vehicle_Services data length:', servicesData?.length || 0);
    console.log('DEBUG: Vehicle_Service_Prices data length:', pricesData?.length || 0);
    console.log('DEBUG: Services headers:', servicesData?.[0] || 'No headers');
    console.log('DEBUG: Prices headers:', pricesData?.[0] || 'No headers');

    if (servicesData.length <= 1) return [];

    const servicesHeaders = servicesData[0];
    const pricesHeaders = pricesData.length > 0 ? pricesData[0] : [];

    // Funcție pentru detectarea limbii originale pe fiecare serviciu
    const detectServiceOriginalLanguage = (row) => {
      // Detectează limba originală pentru acest serviciu specific
      if (servicesHeaders.indexOf('Name_NL') !== -1 && row[servicesHeaders.indexOf('Name_NL')] && row[servicesHeaders.indexOf('Name_NL')].trim().length > 0) {
        return 'nl';
      } else if (servicesHeaders.indexOf('Name_EN') !== -1 && row[servicesHeaders.indexOf('Name_EN')] && row[servicesHeaders.indexOf('Name_EN')].trim().length > 0) {
        return 'en';
      } else if (servicesHeaders.indexOf('Name_RO') !== -1 && row[servicesHeaders.indexOf('Name_RO')] && row[servicesHeaders.indexOf('Name_RO')].trim().length > 0) {
        return 'ro';
      } else if (servicesHeaders.indexOf('Name_ES') !== -1 && row[servicesHeaders.indexOf('Name_ES')] && row[servicesHeaders.indexOf('Name_ES')].trim().length > 0) {
        return 'es';
      } else if (servicesHeaders.indexOf('Name_PL') !== -1 && row[servicesHeaders.indexOf('Name_PL')] && row[servicesHeaders.indexOf('Name_PL')].trim().length > 0) {
        return 'pl';
      }
      return 'en'; // Default
    };

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
    
    console.log(`DEBUG: Prices data length: ${pricesData.length}`);
    if (pricesData.length > 1) {
      console.log(`DEBUG: Processing ${pricesData.length - 1} price rows`);
      pricesData.slice(1).forEach((row, index) => {
        const serviceId = row[pricesHeaders.indexOf('Service_ID')];
        const bodyTypeId = row[pricesHeaders.indexOf('Body_Type_Key')]; // This could be numeric ID or string key
        const isActive = row[pricesHeaders.indexOf('Is_Active')] === 'true' || row[pricesHeaders.indexOf('Is_Active')] === true || row[pricesHeaders.indexOf('Is_Active')] === '' || row[pricesHeaders.indexOf('Is_Active')] === null || row[pricesHeaders.indexOf('Is_Active')] === undefined;
        
        console.log(`DEBUG: Price row ${index + 1} - Service_ID: "${serviceId}", Body_Type_Key: "${bodyTypeId}", Is_Active: ${isActive}`);
        console.log(`DEBUG: BODY_TYPES loaded:`, BODY_TYPES.length, 'types');
        console.log(`DEBUG: BODY_TYPES sample:`, BODY_TYPES.slice(0, 2));
        
        // Allow prices with empty Body_Type_Key to be linked to services
        if (isActive && serviceId) {
          // Map body type ID to key for frontend compatibility
          const bodyTypeKey = this.getBodyTypeKeyById(bodyTypeId);
          const bodyTypeName = this.getBodyTypeNameById(bodyTypeId);
          
          const key = bodyTypeId ? `${serviceId}_${bodyTypeKey}` : `${serviceId}_default`;
          pricesMap[key] = {
            id: parseInt(row[pricesHeaders.indexOf('ID')]) || 0,
            body_type_id: bodyTypeKey, // Use the mapped key for frontend
            body_type_key: bodyTypeKey, // Add body_type_key for frontend compatibility
            bodyTypeName: bodyTypeName, // Use the proper name
            price_min: parseFloat(row[pricesHeaders.indexOf('Price_Min')]) || 0,
            price_max: parseFloat(row[pricesHeaders.indexOf('Price_Max')]) || null,
            currency: row[pricesHeaders.indexOf('Currency')] || 'EUR',
            duration_minutes: parseInt(row[pricesHeaders.indexOf('Duration_Minutes')]) || 0,
            promo_percent: parseInt(row[pricesHeaders.indexOf('Promo_Percent')]) || 0,
            is_active: isActive
          };
          console.log(`DEBUG: Added price to map with key: ${key}`);
          console.log(`DEBUG: Price details: service=${serviceId}, body_type=${bodyTypeKey}, price_min=${pricesMap[key].price_min}`);
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
    
    return await Promise.all(activeServices.map(async (row) => {
        const serviceId = row[servicesHeaders.indexOf('ID')] || row[0]; // Fallback la prima coloană dacă 'ID' nu există
        if (!serviceId) {
          console.log('DEBUG: Skipping row - no ID found:', row);
          return null;
        }
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
        
        // If no prices found, generate fallback prices for common body types
        if (servicePrices.length === 0) {
          console.log(`⚠️  No prices found for service ${serviceIdStr}, generating fallback prices`);
          const fallbackBodyTypes = ['suv', 'berlina', 'hatchback', 'coupe'];
          const basePrice = 25 + (Math.floor(Math.random() * 50)); // Random price between 25-75
          
          fallbackBodyTypes.forEach((bodyType, index) => {
            servicePrices.push({
            id: `fallback_${serviceIdStr}_${bodyType}`,
            body_type_id: bodyType,
            body_type_key: bodyType, // Add body_type_key for frontend compatibility
            bodyTypeName: bodyType,
            price_min: basePrice + (index * 10), // Incremental pricing
            price_max: null,
            currency: 'EUR',
            duration_minutes: parseInt(row[servicesHeaders.indexOf('Duration_Minutes')]) || 60,
            promo_percent: 0,
            is_active: true
          });
          });
          console.log(`✅ Generated ${servicePrices.length} fallback prices for service ${serviceIdStr}`);
        }

        // Detectează limba originală pentru acest serviciu specific
        const serviceOriginalLang = detectServiceOriginalLanguage(row);
        console.log(`DEBUG: Service ${serviceIdStr} original language: ${serviceOriginalLang}`);

        // Get text from original language columns
        const getOriginalText = (columnBaseName) => {
          const originalColumn = servicesHeaders.indexOf(`${columnBaseName}_${serviceOriginalLang.toUpperCase()}`);
          if (originalColumn !== -1 && row[originalColumn]) {
            return row[originalColumn];
          }
          // Fallback to English if original language not found
          const englishColumn = servicesHeaders.indexOf(`${columnBaseName}_EN`);
          if (englishColumn !== -1 && row[englishColumn]) {
            return row[englishColumn];
          }
          // Last fallback: use any available language column
          for (const langSuffix of ['NL', 'RO', 'EN']) {
            const column = servicesHeaders.indexOf(`${columnBaseName}_${langSuffix}`);
            if (column !== -1 && row[column]) {
              return row[column];
            }
          }
          return '';
        };

        // Get original texts
        const originalName = getOriginalText('Name');
        const originalDescription = getOriginalText('Description');
        const originalCategory = getOriginalText('Category');

        // If target language is Dutch and we have Dutch columns, use them directly
        if (lang === 'nl') {
          const dutchNameColumn = servicesHeaders.indexOf('Name_NL') !== -1 ? 'Name_NL' : null;
          const dutchDescColumn = servicesHeaders.indexOf('Description_NL') !== -1 ? 'Description_NL' : null;
          const dutchCategoryColumn = servicesHeaders.indexOf('Category_NL') !== -1 ? 'Category_NL' : null;

          // Use Dutch if available, otherwise translate from original using DeepL
          let finalName = originalName;
          let finalDescription = originalDescription;
          let finalCategory = originalCategory;
          
          if (dutchNameColumn && row[servicesHeaders.indexOf(dutchNameColumn)]) {
            finalName = row[servicesHeaders.indexOf(dutchNameColumn)];
          } else if (serviceOriginalLang !== 'nl') {
            try {
              const nameResult = await translateMultipleWithDeepL(originalName, ['NL'], serviceOriginalLang);
              finalName = nameResult['NL'] || originalName;
            } catch (error) {
              console.error(`❌ DeepL translation failed for service name:`, originalName, error.message);
              finalName = originalName;
            }
          }
          
          if (dutchDescColumn && row[servicesHeaders.indexOf(dutchDescColumn)]) {
            finalDescription = row[servicesHeaders.indexOf(dutchDescColumn)];
          } else if (serviceOriginalLang !== 'nl') {
            try {
              const descResult = await translateMultipleWithDeepL(originalDescription, ['NL'], serviceOriginalLang);
              finalDescription = descResult['NL'] || originalDescription;
            } catch (error) {
              console.error(`❌ DeepL translation failed for service description:`, originalDescription, error.message);
              finalDescription = originalDescription;
            }
          }
          
          if (dutchCategoryColumn && row[servicesHeaders.indexOf(dutchCategoryColumn)]) {
            finalCategory = row[servicesHeaders.indexOf(dutchCategoryColumn)];
          } else if (serviceOriginalLang !== 'nl') {
            try {
              const categoryResult = await translateMultipleWithDeepL(originalCategory, ['NL'], serviceOriginalLang);
              finalCategory = categoryResult['NL'] || originalCategory;
            } catch (error) {
              console.error(`❌ DeepL translation failed for service category:`, originalCategory, error.message);
              finalCategory = originalCategory;
            }
          }

          return {
            id: serviceId,
            slug: this.createSlug(finalName),
            name: finalName,
            description: finalDescription,
            category: finalCategory,
            image_url: '',
            duration_minutes: parseInt(row[servicesHeaders.indexOf('Duration_Minutes')]) || 0,
            is_active: row[servicesHeaders.indexOf('Is_Active')] === 'true' || row[servicesHeaders.indexOf('Is_Active')] === true,
            prices: servicePrices
          };
        }

        // For other languages: first translate to Dutch (if needed), then to target language
        let dutchName = originalName;
        let dutchDescription = originalDescription;
        let dutchCategory = originalCategory;

        // If original is not Dutch, translate to Dutch first
        if (serviceOriginalLang !== 'nl') {
          try {
            const nameResult = await translateMultipleWithDeepL(originalName, ['NL'], serviceOriginalLang);
            dutchName = nameResult['NL'] || originalName;
            
            const descResult = await translateMultipleWithDeepL(originalDescription, ['NL'], serviceOriginalLang);
            dutchDescription = descResult['NL'] || originalDescription;
            
            const categoryResult = await translateMultipleWithDeepL(originalCategory, ['NL'], serviceOriginalLang);
            dutchCategory = categoryResult['NL'] || originalCategory;
          } catch (error) {
            console.error(`❌ DeepL translation to Dutch failed:`, error.message);
            dutchName = originalName;
            dutchDescription = originalDescription;
            dutchCategory = originalCategory;
          }
        }

        // Now translate from Dutch to target language
        let targetName = dutchName;
        let targetDescription = dutchDescription;
        let targetCategory = dutchCategory;
        
        try {
          const nameResult = await translateMultipleWithDeepL(dutchName, [lang.toUpperCase()], 'NL');
          targetName = nameResult[lang.toUpperCase()] || dutchName;
          
          const descResult = await translateMultipleWithDeepL(dutchDescription, [lang.toUpperCase()], 'NL');
          targetDescription = descResult[lang.toUpperCase()] || dutchDescription;
          
          const categoryResult = await translateMultipleWithDeepL(dutchCategory, [lang.toUpperCase()], 'NL');
          targetCategory = categoryResult[lang.toUpperCase()] || dutchCategory;
        } catch (error) {
          console.error(`❌ DeepL translation from Dutch to ${lang} failed:`, error.message);
          targetName = dutchName;
          targetDescription = dutchDescription;
          targetCategory = dutchCategory;
        }

        return {
          id: serviceId,
          slug: this.createSlug(targetName),
          name: targetName,
          description: targetDescription,
          category: targetCategory,
          image_url: '',
          duration_minutes: parseInt(row[servicesHeaders.indexOf('Duration_Minutes')]) || 0,
          is_active: row[servicesHeaders.indexOf('Is_Active')] === 'true' || row[servicesHeaders.indexOf('Is_Active')] === true,
          prices: servicePrices
        };
      })).then(results => results.filter(service => service !== null)); // Elimină serviciile null
  } catch (error) {
      console.error('❌ Error in getServicesWithPrices:', error);
      throw error;
    }
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
          existingRow.set('Name_EN', service.name_en || service.name);
          existingRow.set('Name_NL', service.name_nl || service.name);
          existingRow.set('Name_ES', service.name_es || service.name);
          existingRow.set('Name_PL', service.name_pl || service.name);
          existingRow.set('Name_RO', service.name_ro || service.name);
          existingRow.set('Description', service.description || '');
          existingRow.set('Description_EN', service.description_en || service.description || '');
          existingRow.set('Description_NL', service.description_nl || service.description || '');
          existingRow.set('Description_ES', service.description_es || service.description || '');
          existingRow.set('Description_PL', service.description_pl || service.description || '');
          existingRow.set('Description_RO', service.description_ro || service.description || '');
          existingRow.set('Category', service.category || 'general');
          existingRow.set('Category_EN', service.category_en || service.category || 'general');
          existingRow.set('Category_NL', service.category_nl || service.category || 'general');
          existingRow.set('Category_ES', service.category_es || service.category || 'general');
          existingRow.set('Category_PL', service.category_pl || service.category || 'general');
          existingRow.set('Category_RO', service.category_ro || service.category || 'general');
          existingRow.set('Duration_Minutes', service.duration_minutes || 60);
          existingRow.set('Is_Active', service.is_active !== undefined ? service.is_active : true);
          existingRow.set('Created_At', service.created_at || new Date().toISOString());
          
          await existingRow.save();
          updatedCount++;
        } else {
          // Adaugă serviciu nou folosind appendRow pentru performanță optimă
          const newRowData = {
            'ID': service.id,
            'Name': service.name,
            'Name_EN': service.name_en || service.name,
            'Name_NL': service.name_nl || service.name,
            'Name_ES': service.name_es || service.name,
            'Name_PL': service.name_pl || service.name,
            'Name_RO': service.name_ro || service.name,
            'Description': service.description || '',
            'Description_EN': service.description_en || service.description || '',
            'Description_NL': service.description_nl || service.description || '',
            'Description_ES': service.description_es || service.description || '',
            'Description_PL': service.description_pl || service.description || '',
            'Description_RO': service.description_ro || service.description || '',
            'Category': service.category || 'general',
            'Category_EN': service.category_en || service.category || 'general',
            'Category_NL': service.category_nl || service.category || 'general',
            'Category_ES': service.category_es || service.category || 'general',
            'Category_PL': service.category_pl || service.category || 'general',
            'Category_RO': service.category_ro || service.category || 'general',
            'Duration_Minutes': service.duration_minutes || 60,
            'Is_Active': service.is_active !== undefined ? service.is_active : true,
            'Created_At': service.created_at || new Date().toISOString()
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
        const bodyTypeKey = row.get('Body_Type_Key'); // Schimbat din Body_Type_ID în Body_Type_Key
        const priceId = row.get('ID');
        
        if (serviceId && bodyTypeKey) {
          const key = `${serviceId}_${bodyTypeKey}`;
          existingPricesMap.set(key, { row, priceId: priceId?.toString() });
        }
      });

      let addedCount = 0;
      let updatedCount = 0;

      // Procesează fiecare preț
      for (const price of prices) {
        const bodyTypeKey = price.body_type_key || price.body_type_id;
        const key = `${price.service_id}_${bodyTypeKey}`;
        const existingData = existingPricesMap.get(key);

        if (existingData) {
          // Actualizează prețul existent
          const { row } = existingData;
          row.set('Service_ID', price.service_id);
          row.set('Body_Type_Key', price.body_type_key || price.body_type_id); // Schimbat din Body_Type_ID în Body_Type_Key
          row.set('Price_Min', price.price_min);
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
            'Body_Type_Key': price.body_type_key || price.body_type_id, // Schimbat din Body_Type_ID în Body_Type_Key
            'Price_Min': price.price_min,
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

  /**
   * Translate Google Sheets data using Argos Translate with i18n fallback
   * @param {Array} data - Google Sheets data array (headers + rows)
   * @param {string} targetLanguage - Target language code (e.g., 'en', 'es', 'pl', 'ro')
   * @param {string} sourceLanguage - Source language code (optional, defaults to 'auto')
   * @returns {Promise<Array>} - Translated Google Sheets data
   */
  async translateSheetData(data, targetLanguage, sourceLanguage = 'auto') {
    if (!data || data.length <= 1) {
      return data;
    }

    try {
      const headers = data[0];
      const rows = data.slice(1);
      
      // Identify translatable columns (Name and Description columns)
      const translatableColumns = [];
      headers.forEach((header, index) => {
        if (header && (header.toLowerCase().includes('name') || header.toLowerCase().includes('description') || header.toLowerCase().includes('comment'))) {
          translatableColumns.push(index);
        }
      });

      if (translatableColumns.length === 0) {
        console.log(`ℹ️  No translatable columns found in sheet for language ${targetLanguage}`);
        return data;
      }

      console.log(`🔄 Translating sheet data to ${targetLanguage} using Argos Translate...`);
      console.log(`📊 Found ${translatableColumns.length} translatable columns:`, translatableColumns.map(i => headers[i]));

      // Collect all texts to translate
      const textsToTranslate = [];
      const textLocations = [];
      
      rows.forEach((row, rowIndex) => {
        translatableColumns.forEach(colIndex => {
          const text = row[colIndex];
          if (text && text.trim() !== '') {
            textsToTranslate.push(text);
            textLocations.push({ rowIndex: rowIndex + 1, colIndex }); // +1 because we sliced the header
          }
        });
      });

      if (textsToTranslate.length === 0) {
        console.log(`ℹ️  No texts to translate in sheet for language ${targetLanguage}`);
        return data;
      }

      console.log(`📝 Found ${textsToTranslate.length} texts to translate`);

      // Translate all texts using DeepL
      const translatedTexts = [];
      for (const text of textsToTranslate) {
        try {
          const result = await translateMultipleWithDeepL(text, [targetLanguage.toUpperCase()], sourceLanguage);
          translatedTexts.push(result[targetLanguage.toUpperCase()] || text);
        } catch (error) {
          console.error(`❌ DeepL translation failed for text:`, text.substring(0, 50), error.message);
          translatedTexts.push(text); // Fallback to original text
        }
      }

      // Create new data array with translated texts
      const translatedData = [headers];
      
      // Copy all rows
      rows.forEach(row => translatedData.push([...row]));
      
      // Replace texts with translations
      textLocations.forEach((location, index) => {
        const translatedText = translatedTexts[index];
        if (translatedText && translatedText !== textsToTranslate[index]) {
          translatedData[location.rowIndex][location.colIndex] = translatedText;
        }
      });

      console.log(`✅ Successfully translated ${translatedTexts.length} texts to ${targetLanguage}`);
      return translatedData;

    } catch (error) {
      console.error(`❌ Error translating sheet data to ${targetLanguage}:`, error);
      // Return original data on error
      return data;
    }
  }

  /**
   * Get services with Argos Translate integration
   * @param {string} locale - Target language code (e.g., 'en', 'es', 'pl', 'ro')
   * @param {boolean} activeOnly - Return only active services
   * @param {boolean} useArgosTranslate - Use Argos Translate for dynamic translation
   * @returns {Promise<Array>} - Services array with translated content
   */
  async getServicesWithArgosTranslation(locale = 'nl', activeOnly = true, useArgosTranslate = true) {
    let data = await this.getData('Services');
    
    // If Argos Translate is enabled and locale is not Dutch, translate the data
    if (useArgosTranslate && locale !== 'nl' && data.length > 1) {
      console.log(`🔄 Using Argos Translate to translate services to ${locale}...`);
      data = await this.translateSheetData(data, locale);
    }

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

  /**
   * Get testimonials with Argos Translate integration
   * @param {string} locale - Target language code (e.g., 'en', 'es', 'pl', 'ro')
   * @param {boolean} activeOnly - Return only active testimonials
   * @param {boolean} useArgosTranslate - Use Argos Translate for dynamic translation
   * @returns {Promise<Array>} - Testimonials array with translated content
   */
  async getTestimonialsWithDeepLTranslation(locale = 'nl', activeOnly = true, useDeepLTranslate = true) {
    let data = await this.getData('Testimonials');
    
    console.log(`📊 getTestimonialsWithDeepLTranslation called with locale=${locale}, useDeepLTranslate=${useDeepLTranslate}`);
    console.log(`📋 Raw data length: ${data.length}`);
    
    if (data.length > 1) {
      console.log(`📋 Headers: ${JSON.stringify(data[0])}`);
    }

    if (data.length <= 1) return [];

    const headers = data[0];
    const activeIndex = headers.indexOf('Active');
    
    console.log(`🔍 Looking for testimonials in locale: ${locale}`);
    console.log(`🔍 Found Active at index: ${activeIndex}`);

    // Detect the original language of the testimonials in Google Sheets
    const detectOriginalLanguage = () => {
      // Get active testimonials only
      const activeTestimonials = data.slice(1).filter(row => {
        if (!activeOnly) return true;
        if (activeIndex === -1) return true;
        const activeValue = row[activeIndex];
        return activeValue === 'true' || activeValue === true || activeValue === 1 || activeValue === '1';
      });
      
      // Debug: Show content of ALL testimonials (active and inactive)
      console.log(`DEBUG: Found ${data.slice(1).length} total testimonials`);
      console.log(`DEBUG: Found ${activeTestimonials.length} active testimonials`);
      data.slice(1).forEach((row, index) => {
        const nlComment = headers.indexOf('Comment_NL') !== -1 ? row[headers.indexOf('Comment_NL')] : 'N/A';
        const enComment = headers.indexOf('Comment_EN') !== -1 ? row[headers.indexOf('Comment_EN')] : 'N/A';
        const roComment = headers.indexOf('Comment_RO') !== -1 ? row[headers.indexOf('Comment_RO')] : 'N/A';
        const isActive = activeIndex !== -1 ? row[activeIndex] : 'N/A';
        console.log(`DEBUG: Testimonial ${index + 1} (Active: ${isActive}):`);
        console.log(`  NL: "${nlComment}"`);
        console.log(`  EN: "${enComment}"`);
        console.log(`  RO: "${roComment}"`);
      });
      
      // Check which language columns exist and have data in active testimonials
      const hasEnglish = headers.includes('Comment_EN') && activeTestimonials.some(row => {
        const comment = row[headers.indexOf('Comment_EN')];
        return comment && comment.trim().length > 0;
      });
      
      const hasDutch = headers.includes('Comment_NL') && activeTestimonials.some(row => {
        const comment = row[headers.indexOf('Comment_NL')];
        return comment && comment.trim().length > 0;
      });
      
      const hasRomanian = headers.includes('Comment_RO') && activeTestimonials.some(row => {
        const comment = row[headers.indexOf('Comment_RO')];
        return comment && comment.trim().length > 0;
      });
      
      console.log(`DEBUG: Language detection results:`);
      console.log(`  Has Dutch (NL): ${hasDutch}`);
      console.log(`  Has English (EN): ${hasEnglish}`);
      console.log(`  Has Romanian (RO): ${hasRomanian}`);
      
      // Priority: if Dutch exists and has data, use Dutch as original
      if (hasDutch) return 'nl';
      // If English exists and has data, use English
      if (hasEnglish) return 'en';
      // If Romanian exists and has data, use Romanian
      if (hasRomanian) return 'ro';
      
      // Default to English if nothing found
      return 'en';
    };

    const originalLanguage = detectOriginalLanguage();
    console.log(`DEBUG: Detected original language for testimonials: ${originalLanguage}`);
    
    // Debug: Show what's in the Dutch, English, and Romanian columns for active testimonials
    const activeTestimonials = data.slice(1).filter(row => {
      if (!activeOnly) return true;
      if (activeIndex === -1) return true;
      const activeValue = row[activeIndex];
      return activeValue === 'true' || activeValue === true || activeValue === 1 || activeValue === '1';
    });
    
    console.log(`DEBUG: Found ${activeTestimonials.length} active testimonials`);
    activeTestimonials.forEach((row, index) => {
      const nlComment = headers.indexOf('Comment_NL') !== -1 ? row[headers.indexOf('Comment_NL')] : 'N/A';
      const enComment = headers.indexOf('Comment_EN') !== -1 ? row[headers.indexOf('Comment_EN')] : 'N/A';
      const roComment = headers.indexOf('Comment_RO') !== -1 ? row[headers.indexOf('Comment_RO')] : 'N/A';
      console.log(`DEBUG: Testimonial ${index + 1}:`);
      console.log(`  NL: "${nlComment}"`);
      console.log(`  EN: "${enComment}"`);
      console.log(`  RO: "${roComment}"`);
    });

    // Get text from original language columns with better fallback logic
    const getOriginalText = (row, columnBaseName) => {
      // First try the detected original language
      const originalColumn = headers.indexOf(`${columnBaseName}_${originalLanguage.toUpperCase()}`);
      if (originalColumn !== -1 && row[originalColumn] && row[originalColumn].trim().length > 0) {
        return row[originalColumn];
      }
      
      // If original language column is empty, try to find any column with content
      // Priority: English, Romanian, Dutch
      for (const langSuffix of ['EN', 'RO', 'NL']) {
        const column = headers.indexOf(`${columnBaseName}_${langSuffix}`);
        if (column !== -1 && row[column] && row[column].trim().length > 0) {
          return row[column];
        }
      }
      
      return '';
    };

    const result = await Promise.all(
      data.slice(1)
        .filter(row => {
          if (!activeOnly) return true;
          if (activeIndex === -1) return true; // No active column, include all
          const activeValue = row[activeIndex];
          return activeValue === 'true' || activeValue === true || activeValue === 1 || activeValue === '1';
        })
        .map(async (row) => {
          // Get original comment text - detect language for THIS specific testimonial
          const originalComment = getOriginalText(row, 'Comment');
          
          // Detect language for this specific testimonial based on which column has content
          let testimonialOriginalLang = 'en'; // default
          
          if (headers.indexOf('Comment_NL') !== -1 && row[headers.indexOf('Comment_NL')] && row[headers.indexOf('Comment_NL')].trim().length > 0) {
            testimonialOriginalLang = 'nl';
          } else if (headers.indexOf('Comment_EN') !== -1 && row[headers.indexOf('Comment_EN')] && row[headers.indexOf('Comment_EN')].trim().length > 0) {
            testimonialOriginalLang = 'en';
          } else if (headers.indexOf('Comment_RO') !== -1 && row[headers.indexOf('Comment_RO')] && row[headers.indexOf('Comment_RO')].trim().length > 0) {
            testimonialOriginalLang = 'ro';
          } else if (headers.indexOf('Comment_ES') !== -1 && row[headers.indexOf('Comment_ES')] && row[headers.indexOf('Comment_ES')].trim().length > 0) {
            testimonialOriginalLang = 'es';
          } else if (headers.indexOf('Comment_PL') !== -1 && row[headers.indexOf('Comment_PL')] && row[headers.indexOf('Comment_PL')].trim().length > 0) {
            testimonialOriginalLang = 'pl';
          }
          
          let finalComment = originalComment;
          
          // Use DeepL for translation if enabled
          if (useDeepLTranslate) {
            try {
              // If target language is Dutch
              if (locale === 'nl') {
                // If original is already Dutch, use it as-is
                if (testimonialOriginalLang === 'nl') {
                  finalComment = originalComment;
                } else {
                  // Translate from original language to Dutch using DeepL
                  const translated = await translateMultipleWithDeepL(originalComment, ['NL'], testimonialOriginalLang);
                  finalComment = translated['NL'] || originalComment;
                }
              } else {
                // For other languages: first translate to Dutch (if needed), then to target language
                let dutchComment = originalComment;
                
                // If original is not Dutch, translate to Dutch first
                if (testimonialOriginalLang !== 'nl') {
                  const dutchTranslated = await translateMultipleWithDeepL(originalComment, ['NL'], testimonialOriginalLang);
                  dutchComment = dutchTranslated['NL'] || originalComment;
                }
                
                // Now translate from Dutch to target language using DeepL
                const finalTranslated = await translateMultipleWithDeepL(dutchComment, [locale.toUpperCase()], 'NL');
                finalComment = finalTranslated[locale.toUpperCase()] || dutchComment;
              }
            } catch (error) {
              console.error('❌ DeepL translation failed in getTestimonials, using original text as fallback:', error);
              // Fallback to original text
              finalComment = originalComment;
            }
          } else {
            // Fallback to original text if DeepL is disabled
            finalComment = originalComment;
          }
          
          return {
            id: row[0],
            name: row[headers.indexOf('Name')] || 'Unknown Client',
            rating: parseInt(row[headers.indexOf('Rating')]) || 5,
            comment: finalComment,
            active: activeIndex !== -1 ? row[activeIndex] === 'true' : true,
            created_date: row[headers.indexOf('Created_Date')] || ''
          };
        })
    );
      
    console.log(`✅ getTestimonialsWithDeepLTranslation returning ${result.length} testimonials`);
    return result;
  }

  /**
   * Get services with DeepL Translate integration
   * @param {string} locale - Target language code (e.g., 'en', 'es', 'pl', 'ro')
   * @param {boolean} activeOnly - Return only active services
   * @param {boolean} useDeepLTranslate - Use DeepL Translate for dynamic translation
   * @returns {Promise<Array>} - Services array with translated content
   */
  async getServicesWithDeepLTranslation(locale = 'nl', activeOnly = true, useDeepLTranslate = true) {
    let data = await this.getData('Services');
    
    console.log(`📊 getServicesWithDeepLTranslation called with locale=${locale}, useDeepLTranslate=${useDeepLTranslate}`);
    console.log(`📋 Raw services data length: ${data.length}`);
    
    if (data.length <= 1) return [];

    const headers = data[0];
    const activeIndex = headers.indexOf('Is_Active');
    
    console.log(`🔍 Processing services for locale: ${locale}`);
    
    // Filter active services if requested
    let servicesData = data.slice(1);
    if (activeOnly && activeIndex !== -1) {
      servicesData = servicesData.filter(row => row[activeIndex] === 'true');
    }
    
    // If DeepL Translate is enabled and locale is not Dutch, translate the data
    if (useDeepLTranslate && locale !== 'nl') {
      console.log(`🔄 Using DeepL Translate to translate services to ${locale}...`);
      
      // Get the original language (assuming Dutch for services)
      const originalLang = 'nl';
      
      // Process each service
      const translatedServices = await Promise.all(
        servicesData.map(async (row) => {
          const idIndex = headers.indexOf('ID');
          const nameIndex = headers.indexOf('Name_NL');
          const descIndex = headers.indexOf('Description_NL');
          const priceIndex = headers.indexOf('Price');
          const categoryIndex = headers.indexOf('Category');
          const durationIndex = headers.indexOf('Duration_Minutes');
          
          if (idIndex === -1 || nameIndex === -1 || descIndex === -1) {
            console.warn('⚠️ Missing required service columns');
            return null;
          }
          
          const originalName = row[nameIndex] || '';
          const originalDesc = row[descIndex] || '';
          
          let translatedName = originalName;
          let translatedDesc = originalDesc;
          
          // Translate to target language using DeepL
          try {
            const { translateMultipleWithDeepL } = await import('./deeplTranslationService.js');
            
            if (originalName) {
              const nameResult = await translateMultipleWithDeepL(originalName, [locale.toUpperCase()], originalLang);
              translatedName = nameResult[locale.toUpperCase()] || originalName;
            }
            
            if (originalDesc) {
              const descResult = await translateMultipleWithDeepL(originalDesc, [locale.toUpperCase()], originalLang);
              translatedDesc = descResult[locale.toUpperCase()] || originalDesc;
            }
            
            console.log(`✅ Translated service ${row[idIndex]}: "${originalName}" → "${translatedName}"`);
          } catch (error) {
            console.error(`❌ DeepL translation failed for service ${row[idIndex]}:`, error.message);
            // Keep original text as fallback
          }
          
          return {
            id: row[idIndex] || '',
            name: translatedName,
            description: translatedDesc,
            price: parseFloat(row[priceIndex]) || 0,
            category: row[categoryIndex] || '',
            duration_minutes: parseInt(row[durationIndex]) || 0,
            is_active: activeIndex !== -1 ? row[activeIndex] === 'true' : true
          };
        })
      );
      
      return translatedServices.filter(service => service !== null);
    }
    
    // If no translation needed or disabled, return services as-is
    return servicesData.map(row => {
      const idIndex = headers.indexOf('ID');
      const nameIndex = headers.indexOf('Name_NL');
      const descIndex = headers.indexOf('Description_NL');
      const priceIndex = headers.indexOf('Price');
      const categoryIndex = headers.indexOf('Category');
      const durationIndex = headers.indexOf('Duration_Minutes');
      
      return {
        id: row[idIndex] || '',
        name: row[nameIndex] || '',
        description: row[descIndex] || '',
        price: parseFloat(row[priceIndex]) || 0,
        category: row[categoryIndex] || '',
        duration_minutes: parseInt(row[durationIndex]) || 0,
        is_active: activeIndex !== -1 ? row[activeIndex] === 'true' : true
      };
    });
  }

  /**
   * Get gallery images with DeepL Translate integration
   * @param {string} locale - Target language code (e.g., 'en', 'es', 'pl', 'ro')
   * @param {boolean} activeOnly - Return only active images
   * @param {boolean} useDeepLTranslate - Use DeepL Translate for dynamic translation
   * @returns {Promise<Array>} - Gallery array with translated content
   */
  async getGalleryWithDeepLTranslation(locale = 'nl', activeOnly = true, useDeepLTranslate = true) {
    let data = await this.getData('Gallery');
    
    console.log(`📊 getGalleryWithDeepLTranslation called with locale=${locale}, useDeepLTranslate=${useDeepLTranslate}`);
    console.log(`📋 Raw gallery data length: ${data.length}`);
    
    if (data.length <= 1) return [];

    const headers = data[0];
    const activeIndex = headers.indexOf('Active');
    
    console.log(`🔍 Processing gallery for locale: ${locale}`);
    
    // Filter active images if requested
    let galleryData = data.slice(1);
    if (activeOnly && activeIndex !== -1) {
      galleryData = galleryData.filter(row => row[activeIndex] === 'true');
    }
    
    // If DeepL Translate is enabled and locale is not Dutch, translate the data
    if (useDeepLTranslate && locale !== 'nl') {
      console.log(`🔄 Using DeepL Translate to translate gallery to ${locale}...`);
      
      // Get the original language (assuming Dutch for gallery)
      const originalLang = 'nl';
      
      // Process each gallery image
      const translatedGallery = await Promise.all(
        galleryData.map(async (row) => {
          const idIndex = headers.indexOf('ID');
          const titleIndex = headers.indexOf('Title');
          const descIndex = headers.indexOf('Description');
          const urlIndex = headers.indexOf('Image_URL');
          const categoryIndex = headers.indexOf('Category');
          const uploadDateIndex = headers.indexOf('Upload_Date');
          
          if (idIndex === -1 || titleIndex === -1 || descIndex === -1) {
            console.warn('⚠️ Missing required gallery columns');
            return null;
          }
          
          const originalTitle = row[titleIndex] || '';
          const originalDesc = row[descIndex] || '';
          
          let translatedTitle = originalTitle;
          let translatedDesc = originalDesc;
          
          try {
            // Translate title
            if (originalTitle) {
              const titleResult = await translateMultipleWithDeepL(originalTitle, [locale.toUpperCase()], originalLang);
              translatedTitle = titleResult[locale.toUpperCase()] || originalTitle;
            }
            
            // Translate description
            if (originalDesc) {
              const descResult = await translateMultipleWithDeepL(originalDesc, [locale.toUpperCase()], originalLang);
              translatedDesc = descResult[locale.toUpperCase()] || originalDesc;
            }
            
            console.log(`✅ Translated gallery ${row[idIndex]}: "${originalTitle}" → "${translatedTitle}"`);
          } catch (error) {
            console.error(`❌ DeepL translation failed for gallery ${row[idIndex]}:`, error.message);
            // Keep original text as fallback
          }
          
          return {
            id: row[idIndex] || '',
            title: translatedTitle,
            description: translatedDesc,
            url: row[urlIndex] || '',
            category: row[categoryIndex] || 'general',
            active: activeIndex !== -1 ? row[activeIndex] === 'true' : true,
            upload_date: row[uploadDateIndex] || ''
          };
        })
      );
      
      return translatedGallery.filter(image => image !== null);
    }
    
    // If no translation needed or disabled, return gallery as-is
    return galleryData.map(row => {
      const idIndex = headers.indexOf('ID');
      const titleIndex = headers.indexOf('Title');
      const descIndex = headers.indexOf('Description');
      const urlIndex = headers.indexOf('Image_URL');
      const categoryIndex = headers.indexOf('Category');
      const uploadDateIndex = headers.indexOf('Upload_Date');
      
      return {
        id: row[idIndex] || '',
        title: row[titleIndex] || '',
        description: row[descIndex] || '',
        url: row[urlIndex] || '',
        category: row[categoryIndex] || 'general',
        active: activeIndex !== -1 ? row[activeIndex] === 'true' : true,
        upload_date: row[uploadDateIndex] || ''
      };
    });
  }
}

export { GoogleSheetsService };
export default new GoogleSheetsService();
