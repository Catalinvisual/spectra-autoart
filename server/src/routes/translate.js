import express from 'express';
import { translateWithCache } from '../services/translationCacheService.js';

const router = express.Router();

/**
 * POST /
 * Translate text using Google Translate API with caching
 * Body: { text: string, target: string, source?: string }
 */
router.post('/', async (req, res) => {
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

    const translatedText = await translateWithCache(text, target, source);

    res.json({
      success: true,
      data: {
        originalText: text,
        translatedText: translatedText,
        sourceLanguage: source,
        targetLanguage: target
      }
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Translation failed',
      message: error.message 
    });
  }
});

/**
 * POST /batch
 * Translate multiple texts using Google Translate API with caching
 * Body: { texts: string[], target: string, source?: string }
 */
router.post('/batch', async (req, res) => {
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

    const translatedTexts = [];
    
    for (const text of texts) {
      const translated = await translateWithCache(text, target, source);
      translatedTexts.push(translated);
    }

    res.json({
      success: true,
      data: {
        originalTexts: texts,
        translatedTexts: translatedTexts,
        sourceLanguage: source,
        targetLanguage: target
      }
    });
  } catch (error) {
    console.error('Batch translation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Batch translation failed',
      message: error.message 
    });
  }
});

export default router;