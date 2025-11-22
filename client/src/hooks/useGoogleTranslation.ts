import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

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
 * Custom hook for Google Translate API translations
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

    setTranslations(prev => ({ ...prev, isTranslating: true, error: null }))

    try {
      const translated = await translateMultipleTexts(textsToTranslate)
      setTranslations({
        translatedTexts: translated,
        isTranslating: false,
        error: null
      })
      return translated
    } catch (error) {
      console.error('Multiple translations error:', error)
      setTranslations({
        translatedTexts: textsToTranslate,
        isTranslating: false,
        error: 'Translation failed'
      })
      return textsToTranslate
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
 * Hook for translating testimonial-specific content using Google API
 */
export const useTestimonialTranslations = () => {
  const { currentLanguage } = useLanguage()
  
  // Base Dutch texts for testimonials - these will be translated via Google API
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

  const textsArray = Object.values(testimonialTexts)
  const keysArray = Object.keys(testimonialTexts)
  
  const { translatedTexts, isTranslating, error } = useGoogleTranslations(textsArray, [currentLanguage])
  
  // Convert back to object format with proper fallback
  const translatedObject = keysArray.reduce((acc, key, index) => {
    // If translation failed or we're on Dutch, use original Dutch text
    if (currentLanguage === 'nl' || !translatedTexts[index] || error) {
      acc[key] = testimonialTexts[key as keyof typeof testimonialTexts]
    } else {
      acc[key] = translatedTexts[index]
    }
    return acc
  }, {} as Record<string, string>)

  return {
    t: (key: string) => translatedObject[key] || testimonialTexts[key as keyof typeof testimonialTexts] || key,
    isTranslating,
    error
  }
}