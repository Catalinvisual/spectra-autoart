import axios from 'axios';

const LIBRETRANSLATE_API_URL = process.env.LIBRETRANSLATE_API_URL || 'https://libretranslate.com/translate';
const LIBRETRANSLATE_API_KEY = process.env.LIBRETRANSLATE_API_KEY || '';

/**
 * Argos Translate Service using LibreTranslate API
 * This service provides offline-capable translation using Argos Translate models
 */

/**
 * Translate text using LibreTranslate API (Argos Translate)
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'en', 'es', 'pl', 'ro')
 * @param {string} sourceLanguage - Source language code (optional, defaults to 'auto')
 * @returns {Promise<string>} Translated text
 */
export async function translateWithArgos(text, targetLanguage, sourceLanguage = 'auto') {
  if (!text || text.trim() === '') {
    return text;
  }

  try {
    // Detectăm limba sursă dacă este necesar
    let detectedSourceLanguage = sourceLanguage;
    if (sourceLanguage === 'auto') {
      // Pentru MyMemory API, vom folosi "en" ca limbă sursă implicită
      // sau putem încerca să detectăm limba din text
      detectedSourceLanguage = 'en';
      
      // Detectare simplă bazată pe caractere
      if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(text)) {
        detectedSourceLanguage = 'fr';
      } else if (/[äöüß]/.test(text)) {
        detectedSourceLanguage = 'de';
      } else if (/[áéíóúñ¿¡]/.test(text)) {
        detectedSourceLanguage = 'es';
      } else if (/[àèéìíîòóùú]/.test(text)) {
        detectedSourceLanguage = 'it';
      } else if (/[αβγδεζηθικλμνξοπρστυφχψωάέήίόύώ]/.test(text)) {
        detectedSourceLanguage = 'el';
      }
    }

    // Încercăm mai întâi cu MyMemory API gratuit
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${detectedSourceLanguage}|${targetLanguage}`;
    const response = await axios.get(myMemoryUrl, {
      timeout: 10000 // 10 second timeout
    });

    console.log('MyMemory API response:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.responseData && response.data.responseData.translatedText) {
      return response.data.responseData.translatedText;
    } else {
      throw new Error('Invalid response format from MyMemory API');
    }
  } catch (error) {
    console.error('Argos Translate API error:', error.message);
    if (error.response) {
      console.error('API Response data:', error.response.data);
      console.error('API Response status:', error.response.status);
      console.error('API Response headers:', error.response.headers);
    }
    
    // Return original text if translation fails
    return text;
  }
}

/**
 * Translate multiple texts using LibreTranslate API (Argos Translate)
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (optional, defaults to 'auto')
 * @returns {Promise<string[]>} Array of translated texts
 */
export async function translateMultipleWithArgos(texts, targetLanguage, sourceLanguage = 'auto') {
  if (!texts || texts.length === 0) {
    return texts;
  }

  try {
    const translatedTexts = [];
    
    // LibreTranslate API doesn't support batch translation, so we translate one by one
    for (const text of texts) {
      const translated = await translateWithArgos(text, targetLanguage, sourceLanguage);
      translatedTexts.push(translated);
    }
    
    return translatedTexts;
  } catch (error) {
    console.error('Argos Translate batch API error:', error.message);
    
    // Return original texts if Argos fails
    return texts;
  }
}

/**
 * Detect language using LibreTranslate API
 * @param {string} text - Text to detect language for
 * @returns {Promise<string>} Detected language code
 */
export async function detectLanguageWithArgos(text) {
  if (!text || text.trim() === '') {
    return 'auto';
  }

  try {
    const detectUrl = LIBRETRANSLATE_API_URL.replace('/translate', '/detect');
    const response = await axios.post(detectUrl, {
      q: text,
      api_key: LIBRETRANSLATE_API_KEY
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });

    if (response.data && response.data.length > 0 && response.data[0].language) {
      return response.data[0].language;
    } else {
      throw new Error('Invalid response format from LibreTranslate detect API');
    }
  } catch (error) {
    console.error('Argos Detect Language API error:', error.message);
    
    // Return 'auto' if language detection fails
    return 'auto';
  }
}

/**
 * Get available languages from LibreTranslate API
 * @returns {Promise<Array>} Array of available languages
 */
export async function getAvailableLanguages() {
  try {
    const languagesUrl = LIBRETRANSLATE_API_URL.replace('/translate', '/languages');
    const response = await axios.get(languagesUrl, {
      params: {
        api_key: LIBRETRANSLATE_API_KEY
      },
      timeout: 10000
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error('Invalid response format from LibreTranslate languages API');
    }
  } catch (error) {
    console.error('Argos Languages API error:', error.message);
    
    // Return common languages as fallback
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'nl', name: 'Dutch' },
      { code: 'pl', name: 'Polish' },
      { code: 'ro', name: 'Romanian' }
    ];
  }
}

/**
 * Check if LibreTranslate API is available
 * @returns {Promise<boolean>} True if API is available
 */
export async function isArgosTranslateAvailable() {
  try {
    const response = await axios.get(LIBRETRANSLATE_API_URL.replace('/translate', '/languages'), {
      timeout: 5000
    });
    return response.status === 200;
  } catch (error) {
    console.log('LibreTranslate API is not available:', error.message);
    return false;
  }
}

export default {
  translateWithArgos,
  translateMultipleWithArgos,
  detectLanguageWithArgos,
  getAvailableLanguages,
  isArgosTranslateAvailable
};