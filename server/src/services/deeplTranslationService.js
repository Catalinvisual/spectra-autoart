import * as deepl from 'deepl-node';

// DeepL API configuration
const DEEPL_FREE_API_URL = 'https://api-free.deepl.com';
const DEEPL_PRO_API_URL = 'https://api.deepl.com';

// Language mapping from our app codes to DeepL codes
const LANGUAGE_MAPPING = {
  'NL': 'nl', // Dutch
  'EN': 'en-GB', // English (British) - DeepL requires specific variant
  'ES': 'es', // Spanish
  'PL': 'pl', // Polish
  'RO': 'ro', // Romanian
  'DE': 'de', // German
  'FR': 'fr', // French
  'IT': 'it', // Italian
  'PT': 'pt', // Portuguese
  'RU': 'ru', // Russian
  'JA': 'ja', // Japanese
  'ZH': 'zh', // Chinese
};

// Reverse mapping for DeepL to our codes
const REVERSE_LANGUAGE_MAPPING = Object.fromEntries(
  Object.entries(LANGUAGE_MAPPING).map(([key, value]) => [value, key])
);

class DeepLTranslationService {
  constructor() {
    this.translator = null;
    this.isInitialized = false;
    this.translationCache = new Map();
    this.detectionCache = new Map();
    
    // Rate limiting configuration
    this.rateLimitConfig = {
      maxRequestsPerMinute: 30, // DeepL free tier limit
      requestQueue: [],
      lastRequestTime: 0,
      minIntervalMs: 2000 // 2 seconds between requests to stay under limit
    };
  }

  async initialize() {
    let DEEPL_API_KEY;
    try {
      DEEPL_API_KEY = process.env.DEEPL_KEY || process.env.DEEPL_API_KEY;
      if (!DEEPL_API_KEY) {
        throw new Error('DeepL API key not found in environment variables');
      }

      // Determine if it's a free or pro API key
      const isFreeKey = DEEPL_API_KEY.endsWith(':fx');
      const apiUrl = isFreeKey ? DEEPL_FREE_API_URL : DEEPL_PRO_API_URL;
      
      console.log(`🔑 DeepL API Key format check: ${DEEPL_API_KEY.substring(0, 8)}...${DEEPL_API_KEY.slice(-4)}`);
      console.log(`🌐 Using ${isFreeKey ? 'Free' : 'Pro'} API URL: ${apiUrl}`);
      
      this.translator = new deepl.Translator(DEEPL_API_KEY);

      // Test the connection with a simple translation instead of usage check
      console.log('🧪 Testing DeepL connection with simple translation...');
      const testResult = await this.translator.translateText('Hello', 'en', 'nl');
      console.log(`✅ DeepL connection test successful: "Hello" -> "${testResult.text}"`);
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize DeepL service:', error);
      console.error('🔑 API Key format:', DEEPL_API_KEY ? 'exists' : 'missing');
      console.error('🌐 Server URL:', error.message.includes('server_url') ? 'check server_url' : 'ok');
      throw error;
    }
  }

  /**
   * Rate limiting implementation
   */
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.rateLimitConfig.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitConfig.minIntervalMs) {
      const waitTime = this.rateLimitConfig.minIntervalMs - timeSinceLastRequest;
      console.log(`⏳ Rate limiting: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.rateLimitConfig.lastRequestTime = Date.now();
  }

  /**
   * Detect language using DeepL's language detection
   * @param {string} text - Text to analyze
   * @returns {Promise<string>} Language code (our format: NL, EN, ES, PL, RO)
   */
  async detectLanguage(text) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const cacheKey = `detect:${text.substring(0, 100)}`; // Use first 100 chars for cache key
    
    if (this.detectionCache.has(cacheKey)) {
      console.log(`💾 Language detection cache hit: ${this.detectionCache.get(cacheKey)}`);
      return this.detectionCache.get(cacheKey);
    }

    try {
      await this.waitForRateLimit();
      
      // Use DeepL's language detection by translating to English with auto-detection
      const result = await this.translator.translateText(text, null, 'en-GB');
      
      // Extract detected language from the result
      const detectedLang = result.detectedSourceLang;
      const ourLangCode = REVERSE_LANGUAGE_MAPPING[detectedLang.toLowerCase()] || 'EN';
      
      console.log(`🔍 DeepL detected language: ${detectedLang} → ${ourLangCode}`);
      
      // Cache the result
      this.detectionCache.set(cacheKey, ourLangCode);
      
      return ourLangCode;
    } catch (error) {
      console.error('❌ DeepL language detection failed:', error);
      // Fallback to English
      return 'EN';
    }
  }

  /**
   * Translate text using DeepL
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code (NL, EN, ES, PL, RO)
   * @param {string} sourceLanguage - Source language code (optional, defaults to auto-detection)
   * @returns {Promise<string>} Translated text
   */
  async translate(text, targetLanguage, sourceLanguage = null) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Validate input
    if (!text || typeof text !== 'string' || !text.trim()) {
      console.warn(`⚠️ Invalid text input for translation:`, typeof text, text);
      return text || '';
    }

    if (!targetLanguage) {
      throw new Error('Target language is required');
    }

    // Map our language codes to DeepL codes
    const targetLangCode = LANGUAGE_MAPPING[targetLanguage.toUpperCase()];
    if (!targetLangCode) {
      throw new Error(`Unsupported target language: ${targetLanguage}`);
    }

    // Check cache
    const cacheKey = `translate:${text}:${targetLanguage}:${sourceLanguage || 'auto'}`;
    if (this.translationCache.has(cacheKey)) {
      console.log(`💾 Translation cache hit: ${text.substring(0, 50)}... → ${targetLanguage}`);
      return this.translationCache.get(cacheKey);
    }

    try {
      await this.waitForRateLimit();
      
      // Map source language if provided
      let sourceLangCode = null;
      if (sourceLanguage && sourceLanguage !== 'auto') {
        sourceLangCode = LANGUAGE_MAPPING[sourceLanguage.toUpperCase()];
        if (!sourceLangCode) {
          console.warn(`⚠️ Unsupported source language: ${sourceLanguage}, using auto-detection`);
          sourceLangCode = null;
        }
      }

      console.log(`🔄 DeepL translating: "${text.substring(0, 50)}..." ${sourceLangCode || 'auto'} → ${targetLangCode}`);
      
      const result = await this.translator.translateText(text, sourceLangCode, targetLangCode);
      
      console.log(`✅ DeepL translation completed: "${text.substring(0, 50)}..." → "${result.text.substring(0, 50)}..."`);
      
      // Cache the result
      this.translationCache.set(cacheKey, result.text);
      
      return result.text;
    } catch (error) {
      console.error('❌ DeepL translation failed:', error);
      
      // If it's a rate limit error, wait longer and retry
      if (error.message?.includes('Too many requests')) {
        console.log('⏰ Rate limit hit, waiting 30 seconds before retry');
        await new Promise(resolve => setTimeout(resolve, 30000));
        return this.translate(text, targetLanguage, sourceLanguage);
      }
      
      // Return original text as fallback
      return text;
    }
  }

  /**
   * Translate text to multiple languages
   * @param {string} text - Text to translate
   * @param {string[]} targetLanguages - Array of target language codes
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<Object>} Object with language codes as keys and translations as values
   */
  async translateMultiple(text, targetLanguages, sourceLanguage = null) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const translations = {};
    
    // Process translations sequentially to respect rate limits
    for (const targetLanguage of targetLanguages) {
      try {
        const translated = await this.translate(text, targetLanguage, sourceLanguage);
        translations[targetLanguage] = translated;
      } catch (error) {
        console.error(`❌ Failed to translate to ${targetLanguage}:`, error);
        translations[targetLanguage] = text; // Fallback to original
      }
    }
    
    return translations;
  }

  /**
   * Batch translate multiple texts to multiple languages
   * @param {string[]} texts - Array of texts to translate
   * @param {string[]} targetLanguages - Array of target language codes
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<Object>} Object with language codes as keys and arrays of translations as values
   */
  async batchTranslate(texts, targetLanguages, sourceLanguage = null) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const results = {};
    
    // Initialize result structure
    targetLanguages.forEach(lang => {
      results[lang] = [];
    });
    
    // Process each text
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      console.log(`🔄 Processing batch translation ${i + 1}/${texts.length}: "${text.substring(0, 50)}..."`);
      
      const translations = await this.translateMultiple(text, targetLanguages, sourceLanguage);
      
      targetLanguages.forEach(lang => {
        results[lang].push(translations[lang]);
      });
    }
    
    return results;
  }

  /**
   * Get current usage statistics
   * @returns {Promise<Object>} Usage information
   */
  async getUsage() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const usage = await this.translator.getUsage();
      return {
        characterCount: usage.characterCount,
        characterLimit: usage.characterLimit,
        remainingCharacters: usage.characterLimit - usage.characterCount,
        usagePercentage: (usage.characterCount / usage.characterLimit) * 100
      };
    } catch (error) {
      console.error('❌ Failed to get DeepL usage:', error);
      return null;
    }
  }

  /**
   * Clear translation and detection caches
   */
  clearCache() {
    this.translationCache.clear();
    this.detectionCache.clear();
    console.log('🧹 DeepL translation and detection caches cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      translationCacheSize: this.translationCache.size,
      detectionCacheSize: this.detectionCache.size,
      totalCachedItems: this.translationCache.size + this.detectionCache.size
    };
  }
}

// Create singleton instance
const deepLService = new DeepLTranslationService();

// Export service and utility functions
export default deepLService;

/**
 * Convenience function for single text translation
 */
export async function translateWithDeepL(text, targetLanguage, sourceLanguage = null) {
  return deepLService.translate(text, targetLanguage, sourceLanguage);
}

/**
 * Convenience function for multiple language translation
 */
export async function translateMultipleWithDeepL(text, targetLanguages, sourceLanguage = null) {
  return deepLService.translateMultiple(text, targetLanguages, sourceLanguage);
}

/**
 * Convenience function for language detection
 */
export async function detectLanguageWithDeepL(text) {
  return deepLService.detectLanguage(text);
}

/**
 * Convenience function for batch translation
 */
export async function batchTranslateWithDeepL(texts, targetLanguages, sourceLanguage = null) {
  return deepLService.batchTranslate(texts, targetLanguages, sourceLanguage);
}