import express from 'express';
import { translateMultipleWithDeepL, detectLanguageWithDeepL } from '../services/deeplTranslationService.js';
import GoogleSheetsService from '../services/googleSheetsService.js';
import { vehicleServicesService } from '../services/vehicleServicesService.js';
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
    if (!name || !description || !category) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, description, and category are required' });
    }

    const base = {
      name: String(name).trim(),
      description: String(description).trim(),
      category: String(category).trim(),
      duration_minutes: duration_minutes || 60,
      is_active: is_active !== undefined ? is_active : true
    };

    let normalizedPrices = {};
    if (Array.isArray(prices)) {
      normalizedPrices = prices.reduce((acc, p) => {
        const key = p && (p.body_type_key || p.body_type_id);
        const min = p && p.price_min;
        if (key && min !== undefined && min !== null && min !== '') {
          acc[String(key).toLowerCase()] = {
            price_min: typeof min === 'string' ? parseFloat(min) : min,
            price_max: p.price_max !== undefined ? p.price_max : null,
            duration_minutes: p.duration_minutes || base.duration_minutes || 60
          };
        }
        return acc;
      }, {});
    }

    const serviceDataForVehicleService = {
      ...base,
      name_en: base.name,
      name_nl: base.name,
      name_es: base.name,
      name_pl: base.name,
      name_ro: base.name,
      description_en: base.description,
      description_nl: base.description,
      description_es: base.description,
      description_pl: base.description,
      description_ro: base.description,
      category_en: base.category,
      category_nl: base.category,
      category_es: base.category,
      category_pl: base.category,
      category_ro: base.category,
      prices: prices || {}
    };

    const result = await vehicleServicesService.addServiceWithPrices(serviceDataForVehicleService, normalizedPrices);

    res.json({
      success: true,
      message: 'Service created successfully (translations updating in background)',
      data: {
        serviceId: result.service.id,
        translations: {
          name: { NL: base.name, EN: base.name, ES: base.name, PL: base.name, RO: base.name },
          description: { NL: base.description, EN: base.description, ES: base.description, PL: base.description, RO: base.description },
          category: { NL: base.category, EN: base.category, ES: base.category, PL: base.category, RO: base.category }
        },
        sourceLanguage: 'auto'
      }
    });

    (async () => {
      try {
        const src = await detectLanguageWithDeepL(base.name);
        const [nameT, descT, catT] = await Promise.all([
          translateMultipleWithDeepL(base.name, ['NL', 'EN', 'ES', 'PL', 'RO'], null),
          translateMultipleWithDeepL(base.description, ['NL', 'EN', 'ES', 'PL', 'RO'], null),
          translateMultipleWithDeepL(base.category, ['NL', 'EN', 'ES', 'PL', 'RO'], null)
        ]);
        const updated = {
          id: result.service.id,
          name: base.name,
          name_nl: nameT.NL || base.name,
          name_en: nameT.EN || base.name,
          name_es: nameT.ES || base.name,
          name_pl: nameT.PL || base.name,
          name_ro: nameT.RO || base.name,
          description: base.description,
          description_nl: descT.NL || base.description,
          description_en: descT.EN || base.description,
          description_es: descT.ES || base.description,
          description_pl: descT.PL || base.description,
          description_ro: descT.RO || base.description,
          category: base.category,
          category_nl: catT.NL || base.category,
          category_en: catT.EN || base.category,
          category_es: catT.ES || base.category,
          category_pl: catT.PL || base.category,
          category_ro: catT.RO || base.category,
          duration_minutes: base.duration_minutes,
          is_active: base.is_active
        };
        await GoogleSheetsService.updateServices([updated]);
      } catch (e) {
        console.warn('⚠️ Background translation failed:', e.message);
      }
    })();

  } catch (error) {
    console.error('❌ Service creation failed:', error);
    res.status(500).json({ success: false, error: 'Failed to create service', details: error.message });
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
