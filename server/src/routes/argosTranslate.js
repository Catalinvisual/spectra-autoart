import express from 'express';
import { 
  translateWithArgosCacheAndI18n, 
  translateMultipleWithArgosCacheAndI18n,
  getTranslationConfig, 
  updateTranslationConfig, 
  clearTranslationCache, 
  getCacheStats 
} from '../services/argosTranslationService.js';
import { isArgosTranslateAvailable, getAvailableLanguages } from '../services/argosTranslateService.js';

const router = express.Router();

/**
 * POST /argos-translate
 * Translate text using Argos Translate with i18n fallback
 * Body: { text: string, target: string, source?: string }
 */
router.post('/argos-translate', async (req, res) => {
  try {
    const { text, target, source = 'auto' } = req.body;

    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required' 
      });
    }

    if (!target) {
      return res.status(400).json({ 
        success: false, 
        error: 'Target language is required' 
      });
    }

    const translatedText = await translateWithArgosCacheAndI18n(text, target, source);

    res.json({
      success: true,
      data: {
        originalText: text,
        translatedText: translatedText,
        sourceLanguage: source,
        targetLanguage: target,
        service: 'argos-translate',
        i18nFallback: translatedText === text // Indicates if translation was found in i18n
      }
    });
  } catch (error) {
    console.error('Argos translation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Translation failed',
      message: error.message 
    });
  }
});

/**
 * POST /argos-translate/batch
 * Translate multiple texts using Argos Translate with i18n fallback
 * Body: { texts: string[], target: string, source?: string }
 */
router.post('/argos-translate/batch', async (req, res) => {
  try {
    const { texts, target, source = 'auto' } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Texts array is required' 
      });
    }

    if (!target) {
      return res.status(400).json({ 
        success: false, 
        error: 'Target language is required' 
      });
    }

    const translatedTexts = await translateMultipleWithArgosCacheAndI18n(texts, target, source);

    res.json({
      success: true,
      data: {
        originalTexts: texts,
        translatedTexts: translatedTexts,
        sourceLanguage: source,
        targetLanguage: target,
        service: 'argos-translate-batch'
      }
    });
  } catch (error) {
    console.error('Argos batch translation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Batch translation failed',
      message: error.message 
    });
  }
});

/**
 * GET /argos-translate/status
 * Check Argos Translate service status
 */
router.get('/argos-translate/status', async (req, res) => {
  try {
    const isAvailable = await isArgosTranslateAvailable();
    const config = getTranslationConfig();
    const cacheStats = getCacheStats();

    res.json({
      success: true,
      data: {
        service: 'argos-translate',
        available: isAvailable,
        config: config,
        cacheStats: cacheStats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Status check failed',
      message: error.message 
    });
  }
});

/**
 * GET /argos-translate/languages
 * Get available languages for Argos Translate
 */
router.get('/argos-translate/languages', async (req, res) => {
  try {
    const languages = await getAvailableLanguages();

    res.json({
      success: true,
      data: {
        languages: languages,
        count: languages.length,
        service: 'argos-translate'
      }
    });
  } catch (error) {
    console.error('Languages fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch languages',
      message: error.message 
    });
  }
});

/**
 * POST /argos-translate/config
 * Update translation service configuration
 * Body: { primaryService?: 'argos' | 'google', fallbackToGoogle?: boolean, cacheEnabled?: boolean }
 */
router.post('/argos-translate/config', async (req, res) => {
  try {
    const config = req.body;
    
    if (!config || Object.keys(config).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Configuration object is required' 
      });
    }

    updateTranslationConfig(config);
    const updatedConfig = getTranslationConfig();

    res.json({
      success: true,
      data: {
        message: 'Configuration updated successfully',
        config: updatedConfig
      }
    });
  } catch (error) {
    console.error('Configuration update error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Configuration update failed',
      message: error.message 
    });
  }
});

/**
 * POST /argos-translate/cache/clear
 * Clear translation cache
 */
router.post('/argos-translate/cache/clear', async (req, res) => {
  try {
    clearTranslationCache();
    const cacheStats = getCacheStats();

    res.json({
      success: true,
      data: {
        message: 'Translation cache cleared successfully',
        cacheStats: cacheStats
      }
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Cache clear failed',
      message: error.message 
    });
  }
});

/**
 * GET /argos-translate/cache/stats
 * Get translation cache statistics
 */
router.get('/argos-translate/cache/stats', async (req, res) => {
  try {
    const cacheStats = getCacheStats();

    res.json({
      success: true,
      data: cacheStats
    });
  } catch (error) {
    console.error('Cache stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get cache stats',
      message: error.message 
    });
  }
});

export default router;