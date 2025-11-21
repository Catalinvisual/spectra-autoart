import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import whatsappLogo from '../assets/whatsaap.svg'
import instagramLogo from '../assets/instagram.png'
import chatbotIcon from '../assets/chat.png'
import './RightRail.css'

const RightRail = () => {
  const { t } = useTranslation()
  const { currentLanguage, translateText } = useLanguage()
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: t('chatbot.welcome') }
  ])
  const [translatedQuickReplies, setTranslatedQuickReplies] = useState<string[]>([])

  // Translate welcome message and quick replies when language changes
  useEffect(() => {
    const translateChatbotContent = async () => {
      const welcomeMessage = t('chatbot.welcome')
      const quickReplies = [
        t('chatbot.prices'),
        t('chatbot.bookings'),
        t('chatbot.services'),
        t('chatbot.hours')
      ]
      
      if (currentLanguage === 'nl') {
        // Dutch is the default language, use i18n translations directly
        setMessages([{ type: 'bot', text: welcomeMessage }])
        setTranslatedQuickReplies(quickReplies)
      } else {
        // Use Google API Translator for other languages
        try {
          const [translatedWelcome, ...translatedReplies] = await Promise.all([
            translateText(welcomeMessage),
            ...(Array.isArray(quickReplies) ? quickReplies.map(reply => translateText(reply)) : [])
          ])
          
          setMessages([{ type: 'bot', text: translatedWelcome }])
          setTranslatedQuickReplies(translatedReplies)
        } catch (error) {
          console.error('Error translating chatbot content:', error)
          setMessages([{ type: 'bot', text: welcomeMessage }])
          setTranslatedQuickReplies(quickReplies)
        }
      }
    }

    translateChatbotContent()
  }, [currentLanguage, t, translateText])

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/1234567890', '_blank')
  }

  const handleInstagramClick = () => {
    window.open('https://instagram.com/spectraautoart', '_blank')
  }

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen)
  }

  const handleQuickReply = async (option: string) => {
    const userMessage = { type: 'user', text: option }
    setMessages(prev => [...prev, userMessage])
    
    setTimeout(async () => {
      let botResponse = ''
      
      // Get the response based on the selected option
      switch (option) {
        case t('chatbot.prices'):
        case translatedQuickReplies[0]:
          botResponse = t('chatbot.pricesResponse')
          break
        case t('chatbot.bookings'):
        case translatedQuickReplies[1]:
          botResponse = t('chatbot.bookingsResponse')
          break
        case t('chatbot.services'):
        case translatedQuickReplies[2]:
          botResponse = t('chatbot.servicesResponse')
          break
        case t('chatbot.hours'):
        case translatedQuickReplies[3]:
          botResponse = t('chatbot.hoursResponse')
          break
        default:
          botResponse = 'Vă mulțumim pentru interes! Vă vom contacta în curând.'
      }
      
      // Use Google API Translator if not in Dutch (default language)
      if (currentLanguage !== 'nl') {
        try {
          botResponse = await translateText(botResponse)
        } catch (error) {
          console.error('Error translating bot response:', error)
        }
      }
      
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }])
    }, 1000)
  }

  // ChatModal Component with Portal
  const ChatModal = () => {
    const portalRoot = document.getElementById('chatbot-portal')
    if (!portalRoot) return null

    return createPortal(
      <div className="chatbot-modal">
        <div className="chatbot-header">
          <h3>{t('chatbot.title')}</h3>
          <button 
            className="chatbot-close"
            onClick={() => setChatbotOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="chatbot-messages">
          {Array.isArray(messages) && messages.map((message, index) => (
            <div key={index} className={`chatbot-message ${message.type}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="chatbot-quick-replies">
          {Array.isArray(translatedQuickReplies) && translatedQuickReplies.map((option, index) => (
            <button
              key={index}
              className="quick-reply-btn"
              onClick={() => handleQuickReply(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="chatbot-footer">
          <p>Chatbot-ul este în curs de dezvoltare!</p>
        </div>
      </div>,
      portalRoot
    )
  }

  return (
    <>
      <div className="right-rail">
        <button 
          className="rail-button whatsapp" 
          onClick={handleWhatsAppClick}
          title="WhatsApp"
        >
          <img src={whatsappLogo} alt="WhatsApp" style={{ width: '28px', height: '28px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
        </button>
        
        <button 
          className="rail-button instagram" 
          onClick={handleInstagramClick}
          title="Instagram"
        >
          <img src={instagramLogo} alt="Instagram" style={{ width: '28px', height: '28px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
        </button>
        
        <button 
          className="rail-button chat" 
          onClick={toggleChatbot}
          title="Chat"
        >
          <img src={chatbotIcon} alt="Chat" style={{ width: '28px', height: '28px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
        </button>
      </div>
      
      {chatbotOpen && <ChatModal />}
    </>
  )
}

export default RightRail