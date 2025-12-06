import { translateMultipleWithDeepL, detectLanguageWithDeepL } from './deeplTranslationService.js';
import GoogleSheetsService from './googleSheetsService.js';
import { vehicleServicesService } from './vehicleServicesService.js';

// Required languages for translation
const REQUIRED_LANGUAGES = ['NL', 'EN', 'ES', 'PL', 'RO'];

/**
 * Service for translating vehicle services and managing translations in Google Sheets
 */
class ServiceTranslationService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Google Sheets Service is already initialized at server startup
      // No need to initialize it again here
      
      this.isInitialized = true;
      console.log('✅ ServiceTranslationService initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize ServiceTranslationService:', error);
      throw error;
    }
  }

  /**
   * Translate a service and save all translations to Google Sheets
   * @param {Object} serviceData - Service data to translate
   * @param {string} serviceData.name - Service name
   * @param {string} serviceData.description - Service description
   * @param {string} serviceData.category - Service category
   * @param {number} serviceData.duration_minutes - Service duration in minutes
   * @param {boolean} serviceData.is_active - Whether service is active
   * @returns {Promise<Object>} Translation results with all language versions
   */
  async translateAndSaveService(serviceData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('🔄 Starting service creation (fast-path)...');
      console.log('📋 Input service data:', serviceData);

      const placeholderTranslations = {
        name: {},
        description: {},
        category: {}
      };
      REQUIRED_LANGUAGES.forEach(lang => {
        placeholderTranslations.name[lang] = serviceData.name;
        placeholderTranslations.description[lang] = serviceData.description || '';
        placeholderTranslations.category[lang] = serviceData.category;
      });

      const serviceDataForVehicleService = {
        name: serviceData.name,
        description: serviceData.description,
        category: serviceData.category,
        duration_minutes: serviceData.duration_minutes || 60,
        is_active: serviceData.is_active !== undefined ? serviceData.is_active : true,
        name_en: serviceData.name,
        name_nl: serviceData.name,
        name_es: serviceData.name,
        name_pl: serviceData.name,
        name_ro: serviceData.name,
        description_en: serviceData.description || '',
        description_nl: serviceData.description || '',
        description_es: serviceData.description || '',
        description_pl: serviceData.description || '',
        description_ro: serviceData.description || '',
        category_en: serviceData.category,
        category_nl: serviceData.category,
        category_es: serviceData.category,
        category_pl: serviceData.category,
        category_ro: serviceData.category,
        prices: serviceData.prices || {}
      };

      let normalizedPrices = {};
      if (Array.isArray(serviceData.prices)) {
        normalizedPrices = serviceData.prices.reduce((acc, p) => {
          const key = p && (p.body_type_key || p.body_type_id);
          const min = p && p.price_min;
          if (key && min !== undefined && min !== null && min !== '') {
            acc[String(key).toLowerCase()] = {
              price_min: typeof min === 'string' ? parseFloat(min) : min,
              price_max: p.price_max !== undefined ? p.price_max : null,
              duration_minutes: p.duration_minutes || serviceData.duration_minutes || 60
            };
          }
          return acc;
        }, {});
      } else if (serviceData.prices && typeof serviceData.prices === 'object') {
        normalizedPrices = serviceData.prices;
      }

      const vehicleServiceResult = await vehicleServicesService.addServiceWithPrices(serviceDataForVehicleService, normalizedPrices);
      console.log(`✅ Service created quickly with ID: ${vehicleServiceResult.service.id}`);

      // Kick off DeepL translation in background (non-blocking)
      (async () => {
        try {
          const sourceLanguage = await this.detectSourceLanguage(serviceData);
          const sourceLanguageForTranslation = null;
          const [nameTranslations, descriptionTranslations, categoryTranslations] = await Promise.all([
            translateMultipleWithDeepL(serviceData.name, REQUIRED_LANGUAGES, sourceLanguageForTranslation),
            translateMultipleWithDeepL(serviceData.description || '', REQUIRED_LANGUAGES, sourceLanguageForTranslation),
            translateMultipleWithDeepL(serviceData.category, REQUIRED_LANGUAGES, sourceLanguageForTranslation)
          ]);

          const updatedService = {
            id: vehicleServiceResult.service.id,
            name: serviceData.name,
            name_en: nameTranslations.EN || serviceData.name,
            name_nl: nameTranslations.NL || serviceData.name,
            name_es: nameTranslations.ES || serviceData.name,
            name_pl: nameTranslations.PL || serviceData.name,
            name_ro: nameTranslations.RO || serviceData.name,
            description: serviceData.description || '',
            description_en: descriptionTranslations.EN || serviceData.description || '',
            description_nl: descriptionTranslations.NL || serviceData.description || '',
            description_es: descriptionTranslations.ES || serviceData.description || '',
            description_pl: descriptionTranslations.PL || serviceData.description || '',
            description_ro: descriptionTranslations.RO || serviceData.description || '',
            category: serviceData.category,
            category_en: categoryTranslations.EN || serviceData.category,
            category_nl: categoryTranslations.NL || serviceData.category,
            category_es: categoryTranslations.ES || serviceData.category,
            category_pl: categoryTranslations.PL || serviceData.category,
            category_ro: categoryTranslations.RO || serviceData.category,
            duration_minutes: serviceData.duration_minutes || 60,
            is_active: serviceData.is_active !== undefined ? serviceData.is_active : true
          };

          await GoogleSheetsService.updateServices([updatedService]);
          console.log('✅ Background translation saved to Google Sheets');
        } catch (bgErr) {
          console.warn('⚠️ Background translation failed:', bgErr.message);
        }
      })();

      return {
        success: true,
        serviceId: vehicleServiceResult.service.id,
        translations: placeholderTranslations,
        sourceLanguage: 'auto',
        savedToSheets: true,
        pricesSaved: vehicleServiceResult.prices.length > 0,
        pricesCount: vehicleServiceResult.prices.length
      };

    } catch (error) {
      console.error('❌ Translation and save process failed:', error);
      throw new Error(`Failed to translate and save service: ${error.message}`);
    }
  }

  /**
   * Detect the source language of the service data
   * @param {Object} serviceData - Service data
   * @returns {Promise<string>} Detected language code
   */
  async detectSourceLanguage(serviceData) {
    try {
      // Use name for language detection as it's usually the most reliable indicator
      const detectedLang = await detectLanguageWithDeepL(serviceData.name);
      return detectedLang;
    } catch (error) {
      console.warn('⚠️ Language detection failed, defaulting to EN:', error);
      return 'EN';
    }
  }

  /**
   * Generate a unique service ID
   * @returns {number} Unique service ID
   */
  generateServiceId() {
    const timestamp = Date.now();
    return Math.floor(timestamp / 10000) + 1000; // Reducem la secunde și adăugăm offset pentru a evita numere prea mari
  }

  /**
   * Create URL-friendly slug from text
   * @param {string} text - Text to convert to slug
   * @returns {string} URL-friendly slug
   */
  createSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Prepare data structure for Google Sheets
   * @param {string} serviceId - Unique service ID
   * @param {Object} originalData - Original service data
   * @param {Object} nameTranslations - Name translations
   * @param {Object} descriptionTranslations - Description translations
   * @param {Object} categoryTranslations - Category translations
   * @returns {Array} Formatted data array for Google Sheets
   */
  prepareSheetData(serviceId, originalData, nameTranslations, descriptionTranslations, categoryTranslations) {
    const now = new Date().toISOString();

    return [
      serviceId,                    // ID
      originalData.name,            // Name (original)
      nameTranslations.EN || originalData.name,  // Name_EN
      nameTranslations.NL || originalData.name,  // Name_NL
      nameTranslations.ES || originalData.name,  // Name_ES
      nameTranslations.PL || originalData.name,  // Name_PL
      nameTranslations.RO || originalData.name,  // Name_RO
      originalData.description,     // Description (original)
      descriptionTranslations.EN || originalData.description,  // Description_EN
      descriptionTranslations.NL || originalData.description,  // Description_NL
      descriptionTranslations.ES || originalData.description,  // Description_ES
      descriptionTranslations.PL || originalData.description,  // Description_PL
      descriptionTranslations.RO || originalData.description,  // Description_RO
      originalData.category,        // Category (original)
      categoryTranslations.EN || originalData.category,  // Category_EN
      categoryTranslations.NL || originalData.category,  // Category_NL
      categoryTranslations.ES || originalData.category,  // Category_ES
      categoryTranslations.PL || originalData.category,  // Category_PL
      categoryTranslations.RO || originalData.category,  // Category_RO
      originalData.duration_minutes || 60,  // Duration_Minutes
      originalData.is_active !== undefined ? originalData.is_active : true,  // Is_Active
      now                           // Created_At
    ];
  }

  /**
   * Get all services with translations for a specific language
   * @param {string} language - Target language code (NL, EN, ES, PL, RO)
   * @param {boolean} activeOnly - Whether to return only active services
   * @returns {Promise<Array>} Array of services with translations
   */
  async getServicesForLanguage(language, activeOnly = true) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log(`📋 Fetching services for language: ${language}`);

      // Get data from Google Sheets
      const data = await GoogleSheetsService.getData('Vehicle_Services');
      
      if (data.length <= 1) {
        console.log('⚠️ No services found in Google Sheets');
        return [];
      }

      const headers = data[0];
      const services = [];

      // Find column indices for the requested language
      const nameCol = headers.indexOf(`Name_${language.toUpperCase()}`);
      const descCol = headers.indexOf(`Description_${language.toUpperCase()}`);
      const categoryCol = headers.indexOf(`Category_${language.toUpperCase()}`);
      const isActiveCol = headers.indexOf('Is_Active');

      // Use fallback columns if language-specific ones don't exist
      const nameIndex = nameCol !== -1 ? nameCol : headers.indexOf('Name');
      const descIndex = descCol !== -1 ? descCol : headers.indexOf('Description');
      const categoryIndex = categoryCol !== -1 ? categoryCol : headers.indexOf('Category');
      const isActiveIndex = isActiveCol !== -1 ? isActiveCol : headers.length - 2;

      // Process each service row
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        
        // Skip inactive services if requested
        if (activeOnly && row[isActiveIndex] !== 'true') {
          continue;
        }

        const service = {
          id: row[0], // ID column
          name: row[nameIndex] || row[headers.indexOf('Name')] || 'Unknown Service',
          description: row[descIndex] || row[headers.indexOf('Description')] || '',
          category: row[categoryIndex] || row[headers.indexOf('Category')] || 'general',
          duration_minutes: parseInt(row[headers.indexOf('Duration_Minutes')]) || 60,
          is_active: row[isActiveIndex] === 'true'
        };

        services.push(service);
      }

      console.log(`✅ Found ${services.length} services for language ${language}`);
      return services;

    } catch (error) {
      console.error(`❌ Failed to get services for language ${language}:`, error);
      throw error;
    }
  }

  /**
   * Update service translations
   * @param {string} serviceId - Service ID to update
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Update result
   */
  async updateServiceTranslations(serviceId, updates) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log(`🔄 Updating translations for service ${serviceId}`);

      // Get current data
      const data = await GoogleSheetsService.getData('Vehicle_Services');
      if (data.length <= 1) {
        throw new Error('No services found');
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
        throw new Error(`Service ${serviceId} not found`);
      }

      // Prepare updated data
      const updatedRow = [...data[serviceRowIndex + 1]];
      const headers = data[0];

      // Apply updates
      Object.keys(updates).forEach(field => {
        if (field.includes('_')) {
          // Language-specific field (e.g., Name_EN, Description_NL)
          const colIndex = headers.indexOf(field);
          if (colIndex !== -1) {
            updatedRow[colIndex] = updates[field];
          }
        }
      });

      // Update in Google Sheets
      await GoogleSheetsService.updateData('Vehicle_Services', serviceRowIndex, updatedRow);

      console.log(`✅ Service ${serviceId} translations updated successfully`);
      return { success: true, serviceId };

    } catch (error) {
      console.error(`❌ Failed to update service ${serviceId}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const serviceTranslationService = new ServiceTranslationService();

export default serviceTranslationService;

/**
 * Convenience function for quick service translation
 */
export async function translateAndSaveService(serviceData) {
  return serviceTranslationService.translateAndSaveService(serviceData);
}

/**
 * Convenience function to get services for a specific language
 */
export async function getServicesForLanguage(language, activeOnly = true) {
  return serviceTranslationService.getServicesForLanguage(language, activeOnly);
}
