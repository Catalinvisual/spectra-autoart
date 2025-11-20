import fetch from 'node-fetch';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

/**
 * Translate text using Google Translate API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'en', 'es', 'pl', 'ro')
 * @param {string} sourceLanguage - Source language code (optional, defaults to 'auto')
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLanguage, sourceLanguage = 'auto') {
  if (!GOOGLE_API_KEY) {
    console.warn('Google API key not configured, returning original text');
    return text;
  }

  if (!text || text.trim() === '') {
    return text;
  }

  try {
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        source: sourceLanguage === 'auto' ? undefined : sourceLanguage,
        format: 'text'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Translate API error:', errorData);
      throw new Error(`Translation API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Return original text on error
  }
}

/**
 * Translate multiple texts using Google Translate API
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (optional, defaults to 'auto')
 * @returns {Promise<string[]>} Array of translated texts
 */
export async function translateMultipleTexts(texts, targetLanguage, sourceLanguage = 'auto') {
  if (!GOOGLE_API_KEY) {
    console.warn('Google API key not configured, returning original texts');
    return texts;
  }

  if (!texts || texts.length === 0) {
    return texts;
  }

  try {
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: texts,
        target: targetLanguage,
        source: sourceLanguage === 'auto' ? undefined : sourceLanguage,
        format: 'text'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Translate API error:', errorData);
      throw new Error(`Translation API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.data.translations.map(translation => translation.translatedText);
  } catch (error) {
    console.error('Error translating texts:', error);
    return texts; // Return original texts on error
  }
}

/**
 * Detect language of text using Google Translate API
 * @param {string} text - Text to detect language for
 * @returns {Promise<string>} Detected language code
 */
export async function detectLanguage(text) {
  if (!GOOGLE_API_KEY) {
    console.warn('Google API key not configured, returning auto');
    return 'auto';
  }

  if (!text || text.trim() === '') {
    return 'auto';
  }

  try {
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}/detect?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Detect Language API error:', errorData);
      return 'auto';
    }

    const data = await response.json();
    return data.data.detections[0][0].language;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'auto';
  }
}