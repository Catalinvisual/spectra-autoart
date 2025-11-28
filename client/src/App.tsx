import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Home from './pages/Home'
import Admin from './pages/Admin'
import TermsConditions from './pages/TermsConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import CookiePolicy from './pages/CookiePolicy'
import GDPR from './pages/GDPR'
import ContactLegal from './pages/ContactLegal'
import ModernToastContainer from './components/ModernToastContainer'
import TermsPopup from './components/TermsPopup'
import { ToastProvider } from './contexts/ToastContext'
import { LanguageProvider } from './contexts/LanguageContext'
import './App.css'

function App() {
  const { ready } = useTranslation()

  if (!ready) {
    return <div>Loading translations...</div>
  }

  return (
    <div className="dark">
      <LanguageProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/gdpr" element={<GDPR />} />
              <Route path="/contact-legal" element={<ContactLegal />} />
            </Routes>
            <ModernToastContainer />
            <TermsPopup />
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </div>
  )
}

export default App
