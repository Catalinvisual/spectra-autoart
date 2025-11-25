import i18n from '../i18n';

/**
 * Check if a text exists in the i18n static translations
 * @param text - The text to check
 * @param targetLanguage - The target language (default: 'nl')
 * @returns boolean - true if text exists in i18n, false otherwise
 */
export const isTextInI18n = (text: string, targetLanguage: string = 'nl'): boolean => {
  try {
    const resources = i18n.services.resourceStore.data;
    const translations = resources[targetLanguage]?.translation;
    
    if (!translations) {
      return false;
    }
    
    // Convert the text to lowercase for case-insensitive comparison
    const searchText = text.toLowerCase().trim();
    
    // Helper function to recursively search through the translation object
    const searchInObject = (obj: any): boolean => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          if (obj[key].toLowerCase().trim() === searchText) {
            return true;
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (searchInObject(obj[key])) {
            return true;
          }
        }
      }
      return false;
    };
    
    return searchInObject(translations);
  } catch (error) {
    console.error('Error checking if text exists in i18n:', error);
    return false;
  }
};

/**
 * Get the i18n key for a given text if it exists
 * @param text - The text to find
 * @param targetLanguage - The target language (default: 'nl')
 * @returns string | null - The i18n key if found, null otherwise
 */
export const getI18nKeyForText = (text: string, targetLanguage: string = 'nl'): string | null => {
  try {
    const resources = i18n.services.resourceStore.data;
    const translations = resources[targetLanguage]?.translation;
    
    if (!translations) {
      return null;
    }
    
    const searchText = text.toLowerCase().trim();
    
    // Helper function to recursively search through the translation object
    const findKeyInObject = (obj: any, currentPath: string = ''): string | null => {
      for (const key in obj) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        
        if (typeof obj[key] === 'string') {
          if (obj[key].toLowerCase().trim() === searchText) {
            return newPath;
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          const result = findKeyInObject(obj[key], newPath);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };
    
    return findKeyInObject(translations);
  } catch (error) {
    console.error('Error getting i18n key for text:', error);
    return null;
  }
};

/**
 * Common service-related texts that should be checked against i18n
 */
export const commonServiceTexts = [
  'De la',
  'Pret minim',
  'From',
  'Minimum price',
  'What customers say',
  'The experiences of our satisfied customers',
  'Wat klanten zeggen',
  'De ervaringen van onze tevreden klanten',
  'Premium auto detailing and styling services.',
  'Transform your vehicle with our expert care and attention to detail.',
  'We transform cars into works of art with premium detailing and styling services!'
];