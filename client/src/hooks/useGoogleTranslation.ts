import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { publicAPI } from '../services/api'
import { isTextInI18n, getI18nKeyForText } from '../utils/i18nChecker'
import i18n from '../i18n'

interface TranslationState {
  translatedText: string
  isTranslating: boolean
  error: string | null
}

interface UseGoogleTranslationReturn {
  translatedText: string
  isTranslating: boolean
  error: string | null
  translate: (text: string) => Promise<string>
}

/**
 * Custom hook for Argos Translate API translations
 * Replaces i18n for dynamic content translation
 */
export const useGoogleTranslation = (text: string, dependencies: any[] = []): UseGoogleTranslationReturn => {
  const { currentLanguage, translateText } = useLanguage()
  const [translation, setTranslation] = useState<TranslationState>({
    translatedText: text,
    isTranslating: false,
    error: null
  })

  const translate = useCallback(async (textToTranslate: string): Promise<string> => {
    if (!textToTranslate || currentLanguage === 'nl') {
      return textToTranslate
    }

    // Check if the text already exists in i18n static translations
    if (isTextInI18n(textToTranslate, currentLanguage)) {
      // Text exists in i18n, use it directly without API call
      const i18nKey = getI18nKeyForText(textToTranslate, currentLanguage)
      if (i18nKey) {
        // Use i18n.t() to get the translated text
        const translated = i18n.t(i18nKey)
        setTranslation({
          translatedText: translated,
          isTranslating: false,
          error: null
        })
        return translated
      }
    }

    setTranslation(prev => ({ ...prev, isTranslating: true, error: null }))

    try {
      const translated = await translateText(textToTranslate)
      setTranslation({
        translatedText: translated,
        isTranslating: false,
        error: null
      })
      return translated
    } catch (error) {
      console.error('Translation error:', error)
      setTranslation({
        translatedText: textToTranslate,
        isTranslating: false,
        error: 'Translation failed'
      })
      return textToTranslate
    }
  }, [currentLanguage, translateText])

  useEffect(() => {
    translate(text)
  }, [text, currentLanguage, ...dependencies])

  return {
    translatedText: translation.translatedText,
    isTranslating: translation.isTranslating,
    error: translation.error,
    translate
  }
}

/**
 * Hook for translating multiple texts at once
 */
export const useGoogleTranslations = (texts: string[], dependencies: any[] = []) => {
  const { currentLanguage, translateMultipleTexts } = useLanguage()
  const [translations, setTranslations] = useState<{
    translatedTexts: string[]
    isTranslating: boolean
    error: string | null
  }>({
    translatedTexts: texts,
    isTranslating: false,
    error: null
  })

  const translateMultiple = useCallback(async (textsToTranslate: string[]): Promise<string[]> => {
    if (!textsToTranslate || textsToTranslate.length === 0 || currentLanguage === 'nl') {
      return textsToTranslate
    }

    // Check each text if it exists in i18n
    const processedTexts = textsToTranslate.map(text => {
      if (isTextInI18n(text, currentLanguage)) {
        const i18nKey = getI18nKeyForText(text, currentLanguage)
        if (i18nKey) {
          return i18n.t(i18nKey)
        }
      }
      return text
    })

    // If all texts were found in i18n, return them directly
    if (processedTexts.every((text, index) => text !== textsToTranslate[index])) {
      setTranslations({
        translatedTexts: processedTexts,
        isTranslating: false,
        error: null
      })
      return processedTexts
    }

    // Otherwise, proceed with API translation for texts not found in i18n
    const textsToTranslateViaAPI = textsToTranslate.filter((text, index) => 
      processedTexts[index] === text
    )

    if (textsToTranslateViaAPI.length === 0) {
      setTranslations({
        translatedTexts: processedTexts,
        isTranslating: false,
        error: null
      })
      return processedTexts
    }

    setTranslations(prev => ({ ...prev, isTranslating: true, error: null }))

    try {
      const translatedViaAPI = await translateMultipleTexts(textsToTranslateViaAPI)
      
      // Merge translated texts back with i18n texts
      const finalTexts = processedTexts.map((text, index) => {
        if (text === textsToTranslate[index] && textsToTranslateViaAPI.includes(text)) {
          const apiIndex = textsToTranslateViaAPI.indexOf(text)
          return translatedViaAPI[apiIndex] || text
        }
        return text
      })

      setTranslations({
        translatedTexts: finalTexts,
        isTranslating: false,
        error: null
      })
      return finalTexts
    } catch (error) {
      console.error('Multiple translations error:', error)
      setTranslations({
        translatedTexts: processedTexts,
        isTranslating: false,
        error: 'Translation failed'
      })
      return processedTexts
    }
  }, [currentLanguage, translateMultipleTexts])

  useEffect(() => {
    translateMultiple(texts)
  }, [JSON.stringify(texts), currentLanguage, ...dependencies])

  return {
    translatedTexts: translations.translatedTexts,
    isTranslating: translations.isTranslating,
    error: translations.error,
    translateMultiple
  }
}

/**
 * Hook for translating testimonial-specific content using Argos Translate API
 */
export const useTestimonialTranslations = () => {
  const { currentLanguage } = useLanguage()
  
  // Base Dutch texts for testimonials - these will be translated via Argos Translate API
  const testimonialTexts = {
    title: 'Wat klanten zeggen',
    subtitle: 'De ervaringen van onze tevreden klanten',
    noTestimonials: 'Er zijn nog geen testimonials beschikbaar.',
    writeReview: 'Schrijf een recensie',
    yourName: 'Uw naam',
    yourRating: 'Uw beoordeling',
    yourReview: 'Uw recensie',
    namePlaceholder: 'Vul uw naam in',
    reviewPlaceholder: 'Vertel ons over uw ervaring...',
    submitReview: 'Recensie versturen',
    errorSubmit: 'Fout bij het versturen van de recensie',
    submitting: 'Bezig met versturen...',
    cancel: 'Annuleren',
    reviewSubmittedSuccessfully: 'Recensie succesvol verzonden!'
  }

  // Always use the translation hook to maintain consistent hook order
  const textsArray = Object.values(testimonialTexts)
  const keysArray = Object.keys(testimonialTexts)
  
  const { translatedTexts, isTranslating, error } = useGoogleTranslations(textsArray, [currentLanguage])
  
  // For Dutch language, return the Dutch texts directly without using translations
  if (currentLanguage === 'nl') {
    return {
      t: (key: string) => testimonialTexts[key as keyof typeof testimonialTexts] || key,
      isTranslating: false,
      error: null,
      translateMultiple: (texts: string[]) => Promise.resolve(texts)
    }
  }

  // For other languages, use the translated texts
  const translatedObject = keysArray.reduce((acc, key, index) => {
    if (!translatedTexts[index] || error) {
      // If translation failed, fallback to Dutch
      acc[key] = testimonialTexts[key as keyof typeof testimonialTexts]
    } else {
      // Use the translated text
      acc[key] = translatedTexts[index]
    }
    return acc
  }, {} as Record<string, string>)

  return {
    t: (key: string) => translatedObject[key] || testimonialTexts[key as keyof typeof testimonialTexts] || key,
    isTranslating,
    error,
    translateMultiple: async (texts: string[]) => {
      // For Dutch, return texts as-is
      if (currentLanguage === 'nl') {
        return texts
      }
      
      try {
        // Use the translate batch endpoint via publicAPI
      const response = await publicAPI.translateBatch({
        texts,
        target: currentLanguage,
        source: 'nl'
      })
        
        return response.data?.translatedTexts || texts
      } catch (error) {
        console.error('Error translating multiple texts:', error)
        return texts // Fallback to original texts
      }
    }
  }
}