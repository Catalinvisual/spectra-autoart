import { useState, useEffect } from 'react'
import type { RefCallback } from 'react'
import { gsap } from 'gsap'

export const useScrollAnimation = (): [RefCallback<HTMLElement>] => {
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element) return

    gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        ease: "power2.out"
      }
    )
  }, [element])

  return [setElement]
}

export const useScrollReveal = (): [RefCallback<HTMLElement>] => {
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [element])

  return [setElement]
}

export const useParallax = (speed = 0.5): [RefCallback<HTMLElement>] => {
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element) return

    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -speed
      
      gsap.to(element, {
        y: rate,
        duration: 0.1,
        ease: "none"
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [element, speed])

  return [setElement]
}

export const useFloatingAnimation = (): [RefCallback<HTMLElement>] => {
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element) return

    const tl = gsap.timeline({ repeat: -1 })
    
    tl.to(element, {
      y: -10,
      duration: 2,
      ease: "power1.inOut"
    })
    .to(element, {
      y: 0,
      duration: 2,
      ease: "power1.inOut"
    })

    return () => {
      tl.kill()
    }
  }, [element])

  return [setElement]
}

export const useTypingAnimation = (text: string, speed = 50): [string, RefCallback<HTMLParagraphElement>] => {
  const [displayText, setDisplayText] = useState('')
  const [element, setElement] = useState<HTMLParagraphElement | null>(null)

  useEffect(() => {
    if (!text || !element) return

    setDisplayText('')
    let i = 0
    
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, element, speed])

  return [displayText, setElement]
}

export const useSequentialHeroAnimation = (
  titleParam: string,
  subtitleParam: string,
  _descriptionParam: string,
  onComplete?: () => void
): {
  titleVisible: boolean
  titleText: string
  subtitleText: string
  descriptionVisible: boolean
  buttonVisible: boolean
  setTitleElement: RefCallback<HTMLElement>
  setSubtitleElement: RefCallback<HTMLElement>
  setDescriptionElement: RefCallback<HTMLElement>
  setButtonElement: RefCallback<HTMLElement>
} => {
  const [titleVisible, setTitleVisible] = useState(false)
  const [titleText, setTitleText] = useState('')
  const [subtitleText, setSubtitleText] = useState('')
  const [descriptionVisible, setDescriptionVisible] = useState(false)
  const [buttonVisible, setButtonVisible] = useState(false)
  
  const [titleElement, setTitleElement] = useState<HTMLElement | null>(null)
  const [subtitleElement, setSubtitleElement] = useState<HTMLElement | null>(null)
  const [descriptionElement, setDescriptionElement] = useState<HTMLElement | null>(null)
  const [buttonElement, setButtonElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!titleElement || !subtitleElement || !descriptionElement || !buttonElement) return

    const runAnimation = async () => {
      // Titlu apare instant
      setTitleVisible(true)
      
      // Efect typing pentru title
      setTitleText('')
      let t = 0
      const titleTimer = setInterval(() => {
        if (t < titleParam.length) {
          setTitleText(titleParam.slice(0, t + 1))
          t++
        } else {
          clearInterval(titleTimer)
        }
      }, 60)
      
      // Așteptăm puțin înainte de subtitle
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Efect typing pentru subtitle
      setSubtitleText('')
      let i = 0
      const subtitleTimer = setInterval(() => {
        if (i < subtitleParam.length) {
          setSubtitleText(subtitleParam.slice(0, i + 1))
          i++
        } else {
          clearInterval(subtitleTimer)
          
          // După ce subtitle este complet, așteptăm puțin pentru description
          setTimeout(() => {
            setDescriptionVisible(true)
            
            // După description, așteptăm puțin pentru buton
            setTimeout(() => {
              setButtonVisible(true)
              onComplete?.()
            }, 500)
          }, 300)
        }
      }, 60)
    }

    runAnimation()
  }, [titleElement, subtitleElement, descriptionElement, buttonElement, subtitleParam, onComplete])

  return {
    titleVisible,
    titleText,
    subtitleText,
    descriptionVisible,
    buttonVisible,
    setTitleElement,
    setSubtitleElement,
    setDescriptionElement,
    setButtonElement
  }
}