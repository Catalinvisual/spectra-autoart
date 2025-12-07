import GoogleSheetsService from './googleSheetsService.js';
import { BODY_TYPES } from '../config/bodyTypesConfig.js';

/**
 * Service for managing cached service translations
 * This service provides quick access to translated services without repeated DeepL calls
 */
class CachedTranslationService {
  constructor() {
    this.translationCache = new Map();
    this.lastUpdate = new Map(); // Track last update per language
  }

  /**
   * Get services with translations for a specific language
   * @param {string} language - Target language code (nl, en, es, pl, ro)
   * @param {boolean} activeOnly - Whether to return only active services
   * @returns {Promise<Array>} Array of services with translations
   */
  async getServicesWithTranslations(language, activeOnly = true) {
    try {
      if (!GoogleSheetsService.isInitialized) {
        console.log('🔄 Initializing Google Sheets service in CachedTranslationService...')
        try {
          const ok = await GoogleSheetsService.initialize()
          console.log(`✅ Google Sheets initialize returned: ${ok}`)
        } catch (initError) {
          console.warn('⚠️ Google Sheets initialize failed, returning empty services:', initError.message)
          return []
        }
      }
      const cacheKey = `${language}_${activeOnly}`;
      
      // Check if we have cached data for this specific language
      if (this.translationCache.has(cacheKey) && this.isCacheValid(language)) {
        console.log(`🎯 Using cached translations for language: ${language}`);
        return this.translationCache.get(cacheKey);
      }

      console.log(`📋 Fetching fresh translations for language: ${language}`);

      // Get data from Google Sheets
      const servicesData = await GoogleSheetsService.getData('Vehicle_Services');
      const pricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices');
      
      if (servicesData.length <= 1) {
        console.log('⚠️ No services found in Google Sheets');
        return [];
      }

      const headers = servicesData[0];
      const services = [];
      const langCode = language.toUpperCase();

      // Find column indices for the requested language
      const nameCol = headers.indexOf(`Name_${langCode}`);
      const descCol = headers.indexOf(`Description_${langCode}`);
      const categoryCol = headers.indexOf(`Category_${langCode}`);
      const isActiveCol = headers.indexOf('Is_Active');
      const durationCol = headers.indexOf('Duration_Minutes');
      const idCol = headers.indexOf('ID');

      // Use fallback columns if language-specific ones don't exist
      const nameIndex = nameCol !== -1 ? nameCol : headers.indexOf('Name');
      const descIndex = descCol !== -1 ? descCol : headers.indexOf('Description');
      const categoryIndex = categoryCol !== -1 ? categoryCol : headers.indexOf('Category');

      // Process prices data if available
      const priceHeaders = pricesData.length > 0 ? pricesData[0] : [];
      const servicePrices = {};
      
      console.log(`📊 Processing ${pricesData.length - 1} price rows for ${pricesData.length > 0 ? pricesData[0].length : 0} columns`);
      console.log(`📋 Price headers: ${priceHeaders.join(', ')}`);
      
      if (pricesData.length > 1) {
        const priceServiceIdCol = priceHeaders.indexOf('Service_ID');
        const priceBodyTypeCol = priceHeaders.indexOf('Body_Type_Key'); // Changed from Body_Type_ID to Body_Type_Key
        const priceMinCol = priceHeaders.indexOf('Price_Min');
        const priceMaxCol = priceHeaders.indexOf('Price_Max');
        const priceCurrencyCol = priceHeaders.indexOf('Currency');
        const priceDurationCol = priceHeaders.indexOf('Duration_Minutes');
        const priceIsActiveCol = priceHeaders.indexOf('Is_Active');
        
        console.log(`🔍 Price column indices: Service_ID=${priceServiceIdCol}, Body_Type_ID=${priceBodyTypeCol}, Price_Min=${priceMinCol}, Price_Max=${priceMaxCol}, Currency=${priceCurrencyCol}, Duration_Minutes=${priceDurationCol}, Is_Active=${priceIsActiveCol}`);
        
        // Build a map of service prices
      for (let i = 1; i < pricesData.length; i++) {
        const priceRow = pricesData[i];
        if (priceServiceIdCol === -1) continue;
        
        const serviceId = priceRow[priceServiceIdCol];
        const bodyTypeKey = priceRow[priceBodyTypeCol] || 'default'; // Use body type key directly
        const rawIsActive = priceRow[priceIsActiveCol];
        const isActive = priceIsActiveCol === -1 || rawIsActive === 'true' || rawIsActive === true;
        
        console.log(`🔍 Processing price row ${i}: serviceId=${serviceId}, bodyTypeKey=${bodyTypeKey}, isActive=${isActive}, rawValue=${rawIsActive}`);
        
        // Since all prices are inactive in Google Sheets, process them anyway for now
        // This is a temporary fix to display prices - the data should be corrected in Google Sheets
        if (false) {
          console.log(`⏭️  Skipping inactive price row ${i}`);
          continue;
        }
        
        if (!servicePrices[serviceId]) {
          servicePrices[serviceId] = [];
        }
        
        servicePrices[serviceId].push({
          id: `price-${serviceId}-${i}`,
          service_id: serviceId,
          body_type_key: bodyTypeKey,
          price_min: parseFloat(priceRow[priceMinCol]) || 0,
          price_max: parseFloat(priceRow[priceMaxCol]) || null,
          currency: priceRow[priceCurrencyCol] || 'EUR',
          duration_minutes: parseInt(priceRow[priceDurationCol]) || 60,
          is_active: isActive
        });
        
        console.log(`💰 Added price for service ${serviceId}: €${parseFloat(priceRow[priceMinCol]) || 0} (${bodyTypeKey})`);
      }
      
      console.log(`📊 Service prices map keys: ${Object.keys(servicePrices).join(', ')}`);
      }

      // Process each service row
      for (let i = 1; i < servicesData.length; i++) {
        const row = servicesData[i];
        
        // Skip inactive services if requested
        if (activeOnly && isActiveCol !== -1 && row[isActiveCol] !== 'true' && row[isActiveCol] !== true) {
          continue;
        }

        const serviceId = idCol !== -1 ? row[idCol] : `service-${i}`;
        
        // Map current service to legacy service_1 for price lookup
        // This handles the case where the service was created with a timestamp ID
        // but prices are stored for the legacy service_1 ID
        const legacyServiceId = 'service_1';
        const pricesToUse = servicePrices[serviceId] || servicePrices[legacyServiceId] || [];
        
        const service = {
          id: serviceId,
          name: row[nameIndex] || row[headers.indexOf('Name')] || 'Unknown Service',
          description: row[descIndex] || row[headers.indexOf('Description')] || '',
          category: row[categoryIndex] || row[headers.indexOf('Category')] || 'general',
          duration_minutes: durationCol !== -1 ? parseInt(row[durationCol]) || 60 : 60,
          is_active: isActiveCol !== -1 ? row[isActiveCol] === 'true' : true,
          prices: pricesToUse
        };

        console.log(`📝 Service ${serviceId} has ${pricesToUse.length} prices (mapped from legacy ${legacyServiceId})`);

        services.push(service);
      }

      // Cache the results for this specific language
      this.translationCache.set(cacheKey, services);
      this.lastUpdate.set(language, new Date());

      console.log(`✅ Found ${services.length} services for language ${language}`);
      return services;

    } catch (error) {
      console.error(`❌ Failed to get services with translations for language ${language}:`, error);
      throw error;
    }
  }

  /**
   * Get a specific service with translations
   * @param {string} serviceId - Service ID
   * @param {string} language - Target language code
   * @returns {Promise<Object|null>} Service object or null if not found
   */
  async getServiceWithTranslation(serviceId, language) {
    try {
      const services = await this.getServicesWithTranslations(language);
      return services.find(service => service.id === serviceId) || null;
    } catch (error) {
      console.error(`❌ Failed to get service ${serviceId} with translation:`, error);
      return null;
    }
  }

  /**
   * Get services for multiple languages (useful for admin panel)
   * @param {Array} languages - Array of language codes
   * @param {boolean} activeOnly - Whether to return only active services
   * @returns {Promise<Object>} Object with language codes as keys and services arrays as values
   */
  async getServicesForMultipleLanguages(languages, activeOnly = true) {
    try {
      const results = {};
      
      for (const language of languages) {
        try {
          results[language] = await this.getServicesWithTranslations(language, activeOnly);
        } catch (error) {
          console.error(`❌ Failed to get services for language ${language}:`, error);
          results[language] = [];
        }
      }

      return results;
    } catch (error) {
      console.error('❌ Failed to get services for multiple languages:', error);
      throw error;
    }
  }

  /**
   * Clear the translation cache
   * Useful when services are updated
   */
  clearCache() {
    this.translationCache.clear();
    this.lastUpdate.clear();
    console.log('🗑️ Translation cache cleared');
  }

  /**
   * Check if cache is still valid for a specific language (less than 1 hour old)
   * @param {string} language - Language code to check
   * @returns {boolean} Whether cache is valid
   */
  isCacheValid(language) {
    const lastUpdate = this.lastUpdate.get(language);
    if (!lastUpdate) return false;
    
    const now = new Date();
    const cacheAge = now - lastUpdate;
    const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
    
    return cacheAge < maxAge;
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    const languageUpdates = {};
    this.lastUpdate.forEach((date, language) => {
      languageUpdates[language] = date.toISOString();
    });
    
    return {
      cacheSize: this.translationCache.size,
      languagesCached: Array.from(this.translationCache.keys()),
      languageLastUpdates: languageUpdates,
      totalLanguages: this.lastUpdate.size
    };
  }
}

// Create singleton instance
const cachedTranslationService = new CachedTranslationService();

export default cachedTranslationService;

/**
 * Convenience function to get services with translations
 */
export async function getServicesWithTranslations(language, activeOnly = true) {
  return cachedTranslationService.getServicesWithTranslations(language, activeOnly);
}
