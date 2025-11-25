import express from 'express';
import { translateMultipleWithDeepL } from '../services/deeplTranslationService.js';

const router = express.Router();

/**
 * POST /
 * Translate text using DeepL API
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

    let translatedText = text;
    try {
      const result = await translateMultipleWithDeepL(text, [target.toUpperCase()], source);
      translatedText = result[target.toUpperCase()] || text;
    } catch (error) {
      console.error('DeepL translation error:', error);
      translatedText = text; // Fallback to original text
    }

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
 * Translate multiple texts using DeepL API
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
      try {
        const result = await translateMultipleWithDeepL(text, [target.toUpperCase()], source);
        translatedTexts.push(result[target.toUpperCase()] || text);
      } catch (error) {
        console.error(`❌ DeepL translation failed for text:`, text.substring(0, 50), error.message);
        translatedTexts.push(text); // Fallback to original text
      }
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