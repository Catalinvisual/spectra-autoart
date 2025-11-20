import { translateWithCacheAndI18n, translateMultipleWithCacheAndI18n } from './i18nTranslationService.js';

/**
 * Translate text with caching and i18n fallback
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'en', 'es', 'fr')
 * @param {string} sourceLanguage - Source language code (optional, defaults to 'auto')
 * @returns {Promise<string>} - Translated text
 */
export async function translateWithCache(text, targetLanguage, sourceLanguage = 'auto') {
  try {
    // Folosește noul serviciu cu i18n fallback
    return await translateWithCacheAndI18n(text, targetLanguage, sourceLanguage);
  } catch (error) {
    console.error('Translation cache error:', error);
    // Fallback to original text on error
    return text;
  }
}

/**
 * Translate multiple texts with caching and i18n fallback
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (optional, defaults to 'auto')
 * @returns {Promise<string[]>} - Array of translated texts
 */
export async function translateMultipleWithCache(texts, targetLanguage, sourceLanguage = 'auto') {
  try {
    // Folosește noul serviciu cu i18n fallback
    return await translateMultipleWithCacheAndI18n(texts, targetLanguage, sourceLanguage);
  } catch (error) {
    console.error('Multiple translation cache error:', error);
    // Fallback to original texts on error
    return texts;
  }
}