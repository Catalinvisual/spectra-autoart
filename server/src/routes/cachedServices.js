import express from 'express';
import cachedTranslationService from '../services/cachedTranslationService.js';

const router = express.Router();

/**
 * GET /api/services/translations/:language
 * Get services with cached translations for a specific language
 * This endpoint provides fast access to translated services without repeated DeepL calls
 */
router.get('/translations/:language', async (req, res) => {
  try {
    const { language } = req.params;
    const { active_only = 'true' } = req.query;
    const activeOnly = active_only === 'true';

    console.log(`📋 Fetching services with translations for language: ${language}`);

    // Validate language code
    const validLanguages = ['nl', 'en', 'es', 'pl', 'ro'];
    if (!validLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid language code. Supported languages: nl, en, es, pl, ro'
      });
    }

    // Get services with cached translations
    const services = await cachedTranslationService.getServicesWithTranslations(language.toLowerCase(), activeOnly);

    console.log(`✅ Found ${services.length} services for language ${language}`);
    
    res.json({
      success: true,
      data: services,
      metadata: {
        language: language.toLowerCase(),
        total_services: services.length,
        active_only: activeOnly,
        cache_stats: cachedTranslationService.getCacheStats()
      }
    });

  } catch (error) {
    console.error(`❌ Failed to get services with translations for language ${req.params.language}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to get services with translations',
      details: error.message
    });
  }
});

/**
 * GET /api/services/translations/cache/stats
 * Get translation cache statistics
 */
router.get('/translations/cache/stats', async (req, res) => {
  try {
    const stats = cachedTranslationService.getCacheStats();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Failed to get cache stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cache statistics',
      details: error.message
    });
  }
});

/**
 * POST /api/services/translations/cache/clear
 * Clear the translation cache
 * Useful when services are updated and cache needs to be refreshed
 */
router.post('/translations/cache/clear', async (req, res) => {
  try {
    cachedTranslationService.clearCache();
    
    res.json({
      success: true,
      message: 'Translation cache cleared successfully'
    });

  } catch (error) {
    console.error('❌ Failed to clear cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
      details: error.message
    });
  }
});

/**
 * GET /api/services/translations/multiple/:languages
 * Get services for multiple languages at once
 * @param {string} languages - Comma-separated language codes (e.g., "nl,en,es")
 */
router.get('/translations/multiple/:languages', async (req, res) => {
  try {
    const { languages } = req.params;
    const { active_only = 'true' } = req.query;
    const activeOnly = active_only === 'true';

    // Parse languages
    const languageArray = languages.split(',').map(lang => lang.trim().toLowerCase());
    const validLanguages = ['nl', 'en', 'es', 'pl', 'ro'];
    
    // Validate all languages
    const invalidLanguages = languageArray.filter(lang => !validLanguages.includes(lang));
    if (invalidLanguages.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid language codes: ${invalidLanguages.join(', ')}. Supported languages: nl, en, es, pl, ro`
      });
    }

    console.log(`📋 Fetching services for multiple languages: ${languageArray.join(', ')}`);

    // Get services for multiple languages
    const results = await cachedTranslationService.getServicesForMultipleLanguages(languageArray, activeOnly);

    console.log(`✅ Successfully fetched services for ${languageArray.length} languages`);
    
    res.json({
      success: true,
      data: results,
      metadata: {
        languages: languageArray,
        total_languages: languageArray.length,
        active_only: activeOnly
      }
    });

  } catch (error) {
    console.error('❌ Failed to get services for multiple languages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get services for multiple languages',
      details: error.message
    });
  }
});

export default router;