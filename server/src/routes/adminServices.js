import express from 'express';
import { translateAndSaveService } from '../services/serviceTranslationService.js';
import GoogleSheetsService from '../services/googleSheetsService.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/admin/services/create-with-translation
 * Create a new service with automatic translation to all supported languages
 * Requires admin authentication
 */
router.post('/create-with-translation', auth, async (req, res) => {
  try {
    const { name, description, category, duration_minutes, is_active, prices } = req.body;

    // Validate required fields
    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, description, and category are required'
      });
    }

    console.log('🔄 Starting service creation with translation...');
    console.log('📋 Input data:', { name, description, category, duration_minutes, is_active, prices });

    // Prepare service data
    const serviceData = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      duration_minutes: duration_minutes || 60,
      is_active: is_active !== undefined ? is_active : true,
      prices: prices || {} // Add prices support
    };

    // Translate and save service
    const result = await translateAndSaveService(serviceData);

    console.log('✅ Service created and translated successfully');
    
    res.json({
      success: true,
      message: 'Service created and translated successfully',
      data: {
        serviceId: result.serviceId,
        translations: result.translations,
        sourceLanguage: result.sourceLanguage
      }
    });

  } catch (error) {
    console.error('❌ Service creation with translation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create service with translations',
      details: error.message
    });
  }
});

/**
 * GET /api/admin/services/translations/:serviceId
 * Get all translations for a specific service
 * Requires admin authentication
 */
router.get('/translations/:serviceId', auth, async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Get data from Google Sheets
    const data = await GoogleSheetsService.getData('Vehicle_Services');
    
    if (data.length <= 1) {
      return res.status(404).json({
        success: false,
        error: 'No services found'
      });
    }

    // Find the service
    const headers = data[0];
    let serviceData = null;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === serviceId) {
        serviceData = data[i];
        break;
      }
    }

    if (!serviceData) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // Extract translations
    const translations = {
      name: {},
      description: {},
      category: {}
    };

    // Extract name translations
    REQUIRED_LANGUAGES.forEach(lang => {
      const nameCol = headers.indexOf(`Name_${lang}`);
      const descCol = headers.indexOf(`Description_${lang}`);
      const catCol = headers.indexOf(`Category_${lang}`);

      translations.name[lang.toLowerCase()] = nameCol !== -1 ? serviceData[nameCol] : '';
      translations.description[lang.toLowerCase()] = descCol !== -1 ? serviceData[descCol] : '';
      translations.category[lang.toLowerCase()] = catCol !== -1 ? serviceData[catCol] : '';
    });

    // Add original values as fallback
    const originalNameCol = headers.indexOf('Name');
    const originalDescCol = headers.indexOf('Description');
    const originalCatCol = headers.indexOf('Category');

    const originalName = originalNameCol !== -1 ? serviceData[originalNameCol] : '';
    const originalDesc = originalDescCol !== -1 ? serviceData[originalDescCol] : '';
    const originalCat = originalCatCol !== -1 ? serviceData[originalCatCol] : '';

    res.json({
      success: true,
      data: {
        serviceId,
        translations,
        original: {
          name: originalName,
          description: originalDesc,
          category: originalCat
        },
        duration_minutes: parseInt(serviceData[headers.indexOf('Duration_Minutes')]) || 60,
        is_active: serviceData[headers.indexOf('Is_Active')] === 'true',
        created_at: serviceData[headers.indexOf('Created_At')]
      }
    });

  } catch (error) {
    console.error('❌ Failed to get service translations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get service translations',
      details: error.message
    });
  }
});

/**
 * PUT /api/admin/services/translations/:serviceId
 * Update service translations
 * Requires admin authentication
 */
router.put('/translations/:serviceId', auth, async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updates = req.body;

    console.log(`🔄 Updating translations for service ${serviceId}...`);

    // Get current data
    const data = await GoogleSheetsService.getData('Vehicle_Services');
    
    if (data.length <= 1) {
      return res.status(404).json({
        success: false,
        error: 'No services found'
      });
    }

    // Find the service row
    let serviceRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === serviceId) {
        serviceRowIndex = i - 1; // Adjust for header row
        break;
      }
    }

    if (serviceRowIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // Prepare updated row
    const updatedRow = [...data[serviceRowIndex + 1]];
    const headers = data[0];

    // Apply updates
    Object.keys(updates).forEach(field => {
      const colIndex = headers.indexOf(field);
      if (colIndex !== -1) {
        updatedRow[colIndex] = updates[field];
      }
    });

    // Update in Google Sheets
    await GoogleSheetsService.updateData('Vehicle_Services', serviceRowIndex, updatedRow);

    console.log(`✅ Service ${serviceId} translations updated successfully`);
    
    res.json({
      success: true,
      message: 'Service translations updated successfully',
      data: { serviceId, updates }
    });

  } catch (error) {
    console.error('❌ Failed to update service translations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update service translations',
      details: error.message
    });
  }
});

/**
 * GET /api/admin/services/list-with-translations
 * Get all services with their translations
 * Requires admin authentication
 */
router.get('/list-with-translations', auth, async (req, res) => {
  try {
    const { active_only = 'true' } = req.query;
    const activeOnly = active_only === 'true';

    console.log('📋 Fetching all services with translations...');

    // Get data from Google Sheets
    const data = await GoogleSheetsService.getData('Vehicle_Services');
    
    if (data.length <= 1) {
      return res.json({
        success: true,
        data: []
      });
    }

    const headers = data[0];
    const services = [];

    // Process each service row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip inactive services if requested
      const isActiveCol = headers.indexOf('Is_Active');
      if (activeOnly && isActiveCol !== -1 && row[isActiveCol] !== 'true') {
        continue;
      }

      const service = {
        id: row[0], // ID column
        name: {},
        description: {},
        category: {},
        duration_minutes: parseInt(row[headers.indexOf('Duration_Minutes')]) || 60,
        is_active: row[isActiveCol] === 'true',
        created_at: row[headers.indexOf('Created_At')]
      };

      // Extract translations for all languages
      REQUIRED_LANGUAGES.forEach(lang => {
        const nameCol = headers.indexOf(`Name_${lang}`);
        const descCol = headers.indexOf(`Description_${lang}`);
        const catCol = headers.indexOf(`Category_${lang}`);

        service.name[lang.toLowerCase()] = nameCol !== -1 ? row[nameCol] : '';
        service.description[lang.toLowerCase()] = descCol !== -1 ? row[descCol] : '';
        service.category[lang.toLowerCase()] = catCol !== -1 ? row[catCol] : '';
      });

      services.push(service);
    }

    console.log(`✅ Found ${services.length} services with translations`);
    
    res.json({
      success: true,
      data: services
    });

  } catch (error) {
    console.error('❌ Failed to get services with translations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get services with translations',
      details: error.message
    });
  }
});

export default router;