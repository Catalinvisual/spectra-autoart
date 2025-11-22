import { translateWithArgos, translateMultipleWithArgos } from './argosTranslateService.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Calea către fișierele i18n din client
const I18N_PATH = join(__dirname, '../../../client/src');

/**
 * Configuration for translation services
 */
const TRANSLATION_CONFIG = {
  primaryService: 'argos', // Use only Argos Translate
  cacheEnabled: process.env.TRANSLATION_CACHE !== 'false',
  argosApiUrl: process.env.LIBRETRANSLATE_API_URL || 'https://translate.argosopentech.com/translate',
  argosApiKey: process.env.LIBRETRANSLATE_API_KEY || ''
};

/**
 * Încarcă traducerile din fișierul i18n.ts
 * @param {string} language - Limba dorită (ex: 'en', 'es', 'pl', 'ro')
 * @returns {Object} Obiectul cu traduceri sau null dacă fișierul nu există
 */
function loadI18nTranslations(language) {
  try {
    // Căutăm în fișierul i18n.ts
    const i18nFile = join(I18N_PATH, 'i18n.ts');
    
    // Citim conținutul fișierului
    const content = readFileSync(i18nFile, 'utf8');
    
    // Extragem obiectul resources din fișier
    const resourcesMatch = content.match(/const resources = ({[\s\S]*?});/);
    if (!resourcesMatch) {
      console.log('Nu am putut găsi obiectul resources în i18n.ts');
      return null;
    }
    
    // Evaluăm obiectul resources
    const resourcesStr = resourcesMatch[1];
    
    // Creăm un obiect simplu pentru a evalua structura
    const resources = {};
    
    // Extragem traducerile pentru limba specificată
    const langMatch = content.match(new RegExp(`${language}: ({[\s\S]*?}),`, 'g'));
    if (!langMatch) {
      console.log(`Nu am găsit traduceri pentru limba ${language}`);
      return null;
    }
    
    // Încercăm să parsăm manual obiectul de traduceri
    const langContent = langMatch[0];
    const translationMatch = langContent.match(/translation: ({[\s\S]*?})/);
    
    if (!translationMatch) {
      console.log(`Nu am găsit obiectul translation pentru limba ${language}`);
      return null;
    }
    
    // Returnăm un obiect cu structura așteptată
    return {
      translation: extractTranslationObject(translationMatch[1])
    };
    
  } catch (error) {
    console.log(`Fișierul i18n pentru limba ${language} nu poate fi încărcat:`, error.message);
    return null;
  }
}

/**
 * Extrage obiectul de traduceri din string
 * @param {string} str - Stringul cu obiectul de traduceri
 * @returns {Object} Obiectul de traduceri
 */
function extractTranslationObject(str) {
  const obj = {};
  
  // Extragem perechile cheie-valoare
  const keyValueMatches = str.match(/(\w+):\s*"([^"]*)"/g);
  if (keyValueMatches) {
    keyValueMatches.forEach(match => {
      const [key, value] = match.split(':').map(s => s.trim().replace(/"/g, ''));
      obj[key] = value;
    });
  }
  
  // Căutăm și obiectele imbricate (ex: admin: { ... })
  const nestedObjectMatches = str.match(/(\w+):\s*({[^{}]*})/g);
  if (nestedObjectMatches) {
    nestedObjectMatches.forEach(match => {
      const [key, nestedObj] = match.split(':').map(s => s.trim());
      try {
        obj[key] = JSON.parse(nestedObj);
      } catch (e) {
        // Dacă nu putem parsa JSON, încercăm să extragem manual
        obj[key] = extractTranslationObject(nestedObj.substring(1, nestedObj.length - 1));
      }
    });
  }
  
  return obj;
}

/**
 * Verifică dacă un text există deja în traducerile i18n
 * @param {string} text - Textul de căutat
 * @param {string} targetLanguage - Limba țintă
 * @returns {string|null} Traducerea existentă sau null dacă nu există
 */
function findExistingTranslation(text, targetLanguage) {
  const translations = loadI18nTranslations(targetLanguage);
  if (!translations || !translations.translation) {
    return null;
  }

  // Căutare în toate cheile din obiectul translation
  const searchText = text.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(translations.translation)) {
    if (typeof value === 'string' && value.toLowerCase().trim() === searchText) {
      return value;
    }
    
    // Căutare recursivă în obiectele imbricate
    if (typeof value === 'object') {
      for (const [subKey, subValue] of Object.entries(value)) {
        if (typeof subValue === 'string' && subValue.toLowerCase().trim() === searchText) {
          return subValue;
        }
      }
    }
  }
  
  return null;
}

/**
 * Cache pentru traduceri deja efectuate în această sesiune
 */
const translationCache = new Map();

/**
 * Translate text with Argos Translate (primary) or Google Translate (fallback)
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (optional)
 * @returns {Promise<string>} Translated text
 */
async function translateWithService(text, targetLanguage, sourceLanguage = 'auto') {
  // Pentru limba olandeză (nl), returnăm textul original
  if (targetLanguage === 'nl') {
    return text;
  }
  
  try {
    // Use only Argos Translate
    return await translateWithArgos(text, targetLanguage, sourceLanguage);
  } catch (error) {
    console.error('Argos Translate failed:', error);
    // Return original text on error
    return text;
  }
}

/**
 * Traduce textul folosind i18n dacă există, altfel folosește serviciul de traducere selectat
 * @param {string} text - Textul de tradus
 * @param {string} targetLanguage - Limba țintă
 * @param {string} sourceLanguage - Limba sursă (opțional)
 * @returns {Promise<string>} Textul tradus
 */
export async function translateWithI18nAndArgos(text, targetLanguage, sourceLanguage = 'auto') {
  // Verificăm dacă textul există deja în i18n
  const existingTranslation = findExistingTranslation(text, targetLanguage);
  if (existingTranslation) {
    console.log(`🎯 Traducere găsită în i18n pentru "${text}" în ${targetLanguage}: "${existingTranslation}"`);
    return existingTranslation;
  }
  
  // Dacă nu există, folosim serviciul de traducere selectat
  console.log(`🔄 Textul "${text}" nu există în i18n pentru ${targetLanguage}, folosim ${TRANSLATION_CONFIG.primaryService}`);
  return await translateWithService(text, targetLanguage, sourceLanguage);
}

/**
 * Traduce mai multe texte folosind i18n dacă există, altfel folosește serviciul de traducere selectat
 * @param {string[]} texts - Array de texte de tradus
 * @param {string} targetLanguage - Limba țintă
 * @param {string} sourceLanguage - Limba sursă (opțional)
 * @returns {Promise<string[]>} Array de texte traduse
 */
export async function translateMultipleWithI18nAndArgos(texts, targetLanguage, sourceLanguage = 'auto') {
  const results = [];
  const textsToTranslate = [];
  const indicesToTranslate = [];
  
  // Parcurgem fiecare text
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    
    // Pentru limba olandeză, păstrăm textul original
    if (targetLanguage === 'nl') {
      results[i] = text;
      continue;
    }
    
    // Verificăm dacă există în i18n
    const existingTranslation = findExistingTranslation(text, targetLanguage);
    if (existingTranslation) {
      results[i] = existingTranslation;
      console.log(`🎯 Traducere găsită în i18n pentru textul ${i}: "${text}" → "${existingTranslation}"`);
    } else {
      // Dacă nu există, îl adăugăm la lista pentru traducere
      textsToTranslate.push(text);
      indicesToTranslate.push(i);
      console.log(`🔄 Textul ${i} nu există în i18n: "${text}"`);
    }
  }
  
  // Traducem textele care nu există în i18n
  if (textsToTranslate.length > 0) {
    console.log(`🌐 Traducem ${textsToTranslate.length} texte cu ${TRANSLATION_CONFIG.primaryService}`);
    
    try {
      // Use only Argos Translate for batch translation
      const translatedTexts = await translateMultipleWithArgos(textsToTranslate, targetLanguage, sourceLanguage);
      
      // Completăm rezultatele
      for (let j = 0; j < indicesToTranslate.length; j++) {
        results[indicesToTranslate[j]] = translatedTexts[j];
      }
    } catch (error) {
      console.error('Batch translation error:', error);
      // Return original texts on error
      for (let j = 0; j < indicesToTranslate.length; j++) {
        results[indicesToTranslate[j]] = textsToTranslate[j];
      }
    }
  }
  
  return results;
}

/**
 * Traduce textul cu cache, i18n fallback și Argos/Google Translate
 * @param {string} text - Textul de tradus
 * @param {string} targetLanguage - Limba țintă
 * @param {string} sourceLanguage - Limba sursă (opțional)
 * @returns {Promise<string>} Textul tradus
 */
export async function translateWithArgosCacheAndI18n(text, targetLanguage, sourceLanguage = 'auto') {
  const cacheKey = `${text}:${targetLanguage}:${sourceLanguage}`;
  
  // Verificăm cache-ul
  if (TRANSLATION_CONFIG.cacheEnabled && translationCache.has(cacheKey)) {
    console.log(`💾 Traducere găsită în cache: "${text}" → "${translationCache.get(cacheKey)}"`);
    return translationCache.get(cacheKey);
  }
  
  // Dacă nu este în cache, traducem
  const translated = await translateWithI18nAndArgos(text, targetLanguage, sourceLanguage);
  
  // Salvăm în cache
  if (TRANSLATION_CONFIG.cacheEnabled) {
    translationCache.set(cacheKey, translated);
  }
  
  return translated;
}

/**
 * Traduce mai multe texte cu cache, i18n fallback și Argos/Google Translate
 * @param {string[]} texts - Array de texte de tradus
 * @param {string} targetLanguage - Limba țintă
 * @param {string} sourceLanguage - Limba sursă (opțional)
 * @returns {Promise<string[]>} Array de texte traduse
 */
export async function translateMultipleWithArgosCacheAndI18n(texts, targetLanguage, sourceLanguage = 'auto') {
  const results = await translateMultipleWithI18nAndArgos(texts, targetLanguage, sourceLanguage);
  
  // Salvăm în cache
  if (TRANSLATION_CONFIG.cacheEnabled) {
    for (let i = 0; i < texts.length; i++) {
      const cacheKey = `${texts[i]}:${targetLanguage}:${sourceLanguage}`;
      translationCache.set(cacheKey, results[i]);
    }
  }
  
  return results;
}

/**
 * Get translation service configuration
 * @returns {Object} Current translation configuration
 */
export function getTranslationConfig() {
  return { ...TRANSLATION_CONFIG };
}

/**
 * Update translation service configuration
 * @param {Object} newConfig - New configuration values
 */
export function updateTranslationConfig(newConfig) {
  Object.assign(TRANSLATION_CONFIG, newConfig);
  console.log('Translation configuration updated:', TRANSLATION_CONFIG);
}

/**
 * Clear translation cache
 */
export function clearTranslationCache() {
  translationCache.clear();
  console.log('Translation cache cleared');
}

/**
 * Get translation cache statistics
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
  return {
    size: translationCache.size,
    entries: Array.from(translationCache.keys())
  };
}

export default {
  translateWithArgosCacheAndI18n,
  translateMultipleWithArgosCacheAndI18n,
  translateWithI18nAndArgos,
  translateMultipleWithI18nAndArgos,
  getTranslationConfig,
  updateTranslationConfig,
  clearTranslationCache,
  getCacheStats
};