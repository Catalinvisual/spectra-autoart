import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { resources } from '../i18n';
import { publicAPI } from '../services/api';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => Promise<void>;
  translateText: (text: string) => Promise<string>;
  translateMultipleTexts: (texts: string[]) => Promise<string[]>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Load saved language from localStorage or default to Dutch
  const getInitialLanguage = () => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    return savedLanguage || 'nl';
  };
  
  const [currentLanguage, setCurrentLanguage] = useState<string>(getInitialLanguage());

  useEffect(() => {
    // Set the initial language on mount
    const initialLang = getInitialLanguage();
    // Debug logs - uncomment when needed
    // console.log('🌍 LanguageContext - Initial language from localStorage:', initialLang);
    // console.log('🌍 LanguageContext - i18n current language:', i18n.language);
    // console.log('🌍 LanguageContext - Available resource bundles:', Object.keys(i18n.services.resourceStore.data));
    // console.log('🌍 LanguageContext - Has Romanian bundle:', i18n.hasResourceBundle('ro', 'translation'));
    
    if (!i18n.hasResourceBundle(initialLang, 'translation')) {
      const bundle = (resources as any)[initialLang]?.translation || {};
      // console.log('🌍 LanguageContext - Adding resource bundle for:', initialLang, 'Keys:', Object.keys(bundle));
      // merge without overwriting existing keys
      i18n.addResourceBundle(initialLang, 'translation', bundle, true, false);
    }
    if (initialLang !== i18n.language) {
      // console.log('🌍 LanguageContext - Changing language from', i18n.language, 'to', initialLang);
      i18n.changeLanguage(initialLang).then(() => {
        setCurrentLanguage(initialLang);
        // console.log('🌍 LanguageContext - Language changed successfully to:', initialLang);
      });
    } else {
      setCurrentLanguage(initialLang);
      // console.log('🌍 LanguageContext - Language already set to:', initialLang);
    }
  }, []); // Only run once on mount

  const setLanguage = async (lang: string) => {
    try {
      // Debug logs - uncomment when needed
      // console.log(`🌍 LanguageContext - Changing language to: ${lang}`);
      // console.log(`🌍 LanguageContext - Current language before change: ${i18n.language}`);
      // console.log(`🌍 LanguageContext - Has ${lang} resource bundle:`, i18n.hasResourceBundle(lang, 'translation'));
      // console.log(`🌍 LanguageContext - localStorage before set:`, localStorage.getItem('selectedLanguage'));
      
      // Store in localStorage for persistence first
      localStorage.setItem('selectedLanguage', lang);
      // console.log(`🌍 LanguageContext - localStorage after set:`, localStorage.getItem('selectedLanguage'));
      
      if (!i18n.hasResourceBundle(lang, 'translation')) {
        const bundle = (resources as any)[lang]?.translation || {};
        // console.log(`🌍 LanguageContext - Adding resource bundle for ${lang}:`, Object.keys(bundle));
        // merge without overwriting existing keys
        i18n.addResourceBundle(lang, 'translation', bundle, true, false);
      }
      
      // Change i18next language (for static content)
      await i18n.changeLanguage(lang);
      
      // Update local state after language change is complete
      setCurrentLanguage(lang);
      
      // Debug logs - uncomment when needed
      // console.log(`🌍 Language changed to: ${lang}`);
      // console.log(`🌍 LanguageContext - New i18n language:`, i18n.language);
      // console.log(`🌍 LanguageContext - Has resource bundle after change:`, i18n.hasResourceBundle(lang, 'translation'));
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const translateText = async (text: string): Promise<string> => {
    if (!text || currentLanguage === 'nl') {
      return text;
    }

    try {
      // Use Argos Translate service via the existing translateText endpoint
      // The server will handle routing to Argos Translate internally
      const response = await publicAPI.translateText({
        text: text,
        target: currentLanguage,
        source: 'auto'
      });
      
      return response.data?.translatedText || text;
    } catch (error) {
      console.error('Error translating text with Argos:', error);
      return text; // Return original text on error
    }
  };

  const translateMultipleTexts = async (texts: string[]): Promise<string[]> => {
    if (!texts || texts.length === 0 || currentLanguage === 'nl') {
      return texts;
    }

    try {
      // Use Argos Translate service via the existing translateBatch endpoint
      // The server will handle routing to Argos Translate internally
      const response = await publicAPI.translateBatch({
        texts: texts,
        target: currentLanguage,
        source: 'auto'
      });
      
      return response.data?.translatedTexts || texts;
    } catch (error) {
      console.error('Error translating multiple texts with Argos:', error);
      return texts; // Return original texts on error
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    translateText,
    translateMultipleTexts
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
