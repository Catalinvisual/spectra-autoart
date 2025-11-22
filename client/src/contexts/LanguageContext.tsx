import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language || 'nl');

  useEffect(() => {
    // Sync with i18next language changes
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const setLanguage = async (lang: string) => {
    try {
      // Change i18next language (for static content)
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      
      // Store in localStorage for persistence
      localStorage.setItem('selectedLanguage', lang);
      
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