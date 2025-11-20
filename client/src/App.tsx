import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Home from './pages/Home'
import Admin from './pages/Admin'
import ModernToastContainer from './components/ModernToastContainer'
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
            </Routes>
            <ModernToastContainer />
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </div>
  )
}

export default App
