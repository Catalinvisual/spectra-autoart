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
    if (!i18n.hasResourceBundle(initialLang, 'translation')) {
      const bundle = (resources as any)[initialLang]?.translation || {};
      i18n.addResourceBundle(initialLang, 'translation', bundle, true, true);
    }
    i18n.reloadResources([initialLang]).then(() => {
      console.log('i18n resources reloaded for:', initialLang);
    });
    if (initialLang !== i18n.language) {
      i18n.changeLanguage(initialLang).then(() => {
        setCurrentLanguage(initialLang);
      });
    } else {
      setCurrentLanguage(initialLang);
    }
  }, []); // Only run once on mount

  const setLanguage = async (lang: string) => {
    try {
      // Store in localStorage for persistence first
      localStorage.setItem('selectedLanguage', lang);
      
      if (!i18n.hasResourceBundle(lang, 'translation')) {
        const bundle = (resources as any)[lang]?.translation || {};
        i18n.addResourceBundle(lang, 'translation', bundle, true, true);
      }

      await i18n.reloadResources([lang]);
      
      // Change i18next language (for static content)
      await i18n.changeLanguage(lang);
      
      // Update local state after language change is complete
      setCurrentLanguage(lang);
      
      console.log(`🌍 Language changed to: ${lang}`);
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
