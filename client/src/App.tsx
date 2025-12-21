import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import TermsConditions from './pages/TermsConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import CookiePolicy from './pages/CookiePolicy'
import ContactLegal from './pages/ContactLegal'
import GalleryPage from './pages/GalleryPage'
import ServicesPage from './pages/ServicesPage'
import ModernToastContainer from './components/ModernToastContainer'
import TermsPopup from './components/TermsPopup'

import './App.css'

function App() {
  return (
    <div className="dark">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/reset-password" element={<Admin />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/contact-legal" element={<ContactLegal />} />
        </Routes>
        <ModernToastContainer />
        <TermsPopup />
      </Router>
    </div>
  )
}

export default App
