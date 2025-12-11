import * as nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Rate limiting for Resend API (2 requests per second limit)
class RateLimiter {
  constructor(maxRequests = 2, timeWindow = 1000) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindow
    this.requests = []
  }

  async throttle() {
    const now = Date.now()
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow)
    
    // If we've hit the limit, wait
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0]
      const waitTime = this.timeWindow - (now - oldestRequest) + 100 // Add 100ms buffer
      console.log(`⏳ Rate limit reached, waiting ${waitTime}ms...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
      return this.throttle() // Recursively check again
    }
    
    // Add current request
    this.requests.push(now)
  }
}

const resendRateLimiter = new RateLimiter(2, 1000) // 2 requests per second

// Create transporter with error handling and Gmail-optimized settings
let transporter = null
let fallbackTransporters = []

const makeTransport = (override = {}) => {
  const host = override.host || process.env.ZOHO_SMTP_HOST || process.env.SMTP_HOST || 'smtppro.zoho.eu'
  const port = override.port || parseInt(process.env.ZOHO_SMTP_PORT || process.env.SMTP_PORT || '465')
  const secure = override.secure ?? ((process.env.ZOHO_SMTP_SECURE || process.env.SMTP_SECURE || 'true') === 'true')
  const user = process.env.ZOHO_SMTP_USER || process.env.EMAIL_USER
  const pass = process.env.ZOHO_SMTP_PASS || process.env.EMAIL_PASS
  
  // Optimized settings for Railway production environment
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    // Reduced timeouts for faster failover
    connectionTimeout: 10000,  // 10s instead of 15s
    greetingTimeout: 10000,   // 10s instead of 15s
    socketTimeout: 20000,     // 20s for socket operations
    // Connection pooling for better performance
    pool: true,
    maxConnections: 3,        // Allow multiple connections
    maxMessages: 100,         // More messages per connection
    // Retry settings
    rateDelta: 1000,          // 1 second
    rateLimit: 5,             // Max 5 messages per second
    // TLS settings optimized for Zoho
    requireTLS: override.requireTLS || (port === 587), // Force TLS for port 587
    name: override.name || 'spectraautoart.nl', // Proper SMTP hostname
    tls: { 
      rejectUnauthorized: false, // Accept self-signed certs in production
      minVersion: 'TLSv1.2',
      // Add specific cipher suites for Zoho compatibility
      ciphers: 'HIGH:MEDIUM:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
    }
  })
}

// Initialize multiple transporters with different configurations
const initializeTransporters = () => {
  const configs = [
    // Primary: Zoho SMTP Pro with port 465 (SSL)
    {
      host: process.env.ZOHO_SMTP_HOST || 'smtppro.zoho.eu',
      port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
      secure: true,
      priority: 1
    },
    // Fallback 1: Zoho SMTP Pro with port 587 (STARTTLS)
    {
      host: process.env.ZOHO_SMTP_HOST || 'smtppro.zoho.eu',
      port: 587,
      secure: false,
      requireTLS: true,
      priority: 2
    },
    // Fallback 2: Alternative Zoho host
    {
      host: 'smtp.zoho.eu',
      port: 587,
      secure: false,
      requireTLS: true,
      priority: 3
    }
  ]

  const user = process.env.ZOHO_SMTP_USER || process.env.EMAIL_USER
  const pass = process.env.ZOHO_SMTP_PASS || process.env.EMAIL_PASS

  if (!user || !pass) {
    console.warn('⚠️ Email credentials not found - email service disabled')
    return
  }

  // Try primary configuration first
  try {
    transporter = makeTransport(configs[0])
    console.log(`📧 Primary email transporter initialized for ${configs[0].host}:${configs[0].port}`)
  } catch (error) {
    console.error('❌ Failed to create primary email transporter:', error.message)
  }

  // Create fallback transporters
  fallbackTransporters = configs.slice(1).map(config => {
    try {
      const transport = makeTransport(config)
      console.log(`📧 Fallback transporter configured for ${config.host}:${config.port}`)
      return transport
    } catch (error) {
      console.warn(`⚠️ Failed to create fallback transporter for ${config.host}:${config.port}:`, error.message)
      return null
    }
  }).filter(Boolean)

  console.log(`📧 Total transporters configured: ${(transporter ? 1 : 0) + fallbackTransporters.length}`)
}

// Initialize transporters with Railway-specific logic
try {
  // For Railway production environment, use only Resend API to avoid SMTP timeouts
  if (process.env.RAILWAY_PROJECT_ID) {
    console.log('🏭 Detected Railway environment - using Resend API only, skipping SMTP setup')
    // Don't initialize SMTP transporters in Railway to prevent timeouts
    transporter = null
    fallbackTransporters = []
  } else {
    // For non-Railway environments, use normal SMTP initialization
    initializeTransporters()
  }
} catch (error) {
  console.error('❌ Failed to initialize email transporters:', error.message)
}

// Verify transporter configuration with intelligent fallback
const verifyTransporter = async (retries = 3) => {
  // Skip verification in Railway environment
  if (process.env.RAILWAY_PROJECT_ID) {
    console.log('🏭 Railway environment detected - skipping SMTP verification')
    // Check if Resend API is available instead
    if (process.env.RESEND_API_KEY) {
      console.log('✅ Resend API key available - email service ready')
      return true
    } else {
      console.warn('⚠️ No Resend API key available in Railway environment')
      return false
    }
  }
  
  const allTransporters = [transporter, ...fallbackTransporters].filter(Boolean)
  
  if (allTransporters.length === 0) {
    console.warn('⚠️ No email transporters available')
    return false
  }
  
  for (let transporterIndex = 0; transporterIndex < allTransporters.length; transporterIndex++) {
    const currentTransporter = allTransporters[transporterIndex]
    const isPrimary = transporterIndex === 0
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔍 Verifying ${isPrimary ? 'primary' : 'fallback'} transporter (attempt ${attempt}/${retries})...`)
        await currentTransporter.verify()
        console.log(`✅ Email transporter verified successfully (${isPrimary ? 'primary' : 'fallback'})`)
        
        // If fallback worked, make it the primary
        if (!isPrimary && transporterIndex > 0) {
          console.log(`🔄 Switching to fallback transporter as primary`)
          transporter = currentTransporter
        }
        
        return true
      } catch (error) {
        console.error(`❌ Email transporter verification failed (${isPrimary ? 'primary' : 'fallback'}, attempt ${attempt}):`, error.message)
        
        if (attempt === retries) {
          console.warn(`⚠️ All attempts failed for ${isPrimary ? 'primary' : 'fallback'} transporter`)
          break // Try next transporter
        }
        
        // Wait before retry with exponential backoff
        const waitTime = Math.min(attempt * 2000, 10000) // Max 10s
        console.log(`⏱️  Retrying in ${waitTime}ms...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }
  
  console.error('❌ All transporters failed verification')
  return false
}

// Email templates
const emailTemplates = {
  // Client confirmation email template
  clientConfirmation: (bookingData, services) => {
    const lang = String(bookingData?.locale || 'nl').toLowerCase()
    const t = (function(){
      const M = {
        nl: {
          titleConfirm: 'Afspraakbevestiging',
          confirmHeader: 'Afspraak bevestigd',
          bookingDetails: 'Afspraak Details',
          selectedServices: 'Geselecteerde Diensten',
          name: 'Naam', email: 'Email', phone: 'Telefoon', date: 'Datum', time: 'Tijd', vehicle: 'Voertuig', body: 'Carrosserie',
          autoNote: 'Dit e-mailbericht is automatisch gegenereerd.'
        },
        en: {
          titleConfirm: 'Booking Confirmation',
          confirmHeader: 'Booking confirmed',
          bookingDetails: 'Booking Details',
          selectedServices: 'Selected Services',
          name: 'Name', email: 'Email', phone: 'Phone', date: 'Date', time: 'Time', vehicle: 'Vehicle', body: 'Body Type',
          autoNote: 'This email was generated automatically.'
        },
        es: {
          titleConfirm: 'Confirmación de Reserva',
          confirmHeader: 'Reserva confirmada',
          bookingDetails: 'Detalles de la Reserva',
          selectedServices: 'Servicios Seleccionados',
          name: 'Nombre', email: 'Correo', phone: 'Teléfono', date: 'Fecha', time: 'Hora', vehicle: 'Vehículo', body: 'Tipo de Carrocería',
          autoNote: 'Este correo fue generado automáticamente.'
        },
        pl: {
          titleConfirm: 'Potwierdzenie Rezerwacji',
          confirmHeader: 'Rezerwacja potwierdzona',
          bookingDetails: 'Szczegóły Rezerwacji',
          selectedServices: 'Wybrane Usługi',
          name: 'Imię', email: 'Email', phone: 'Telefon', date: 'Data', time: 'Godzina', vehicle: 'Pojazd', body: 'Typ Nadwozia',
          autoNote: 'Ten email został wygenerowany automatycznie.'
        },
        ro: {
          titleConfirm: 'Confirmare Programare',
          confirmHeader: 'Confirmare Programare',
          bookingDetails: 'Detalii Programare',
          selectedServices: 'Servicii Selectate',
          name: 'Nume', email: 'Email', phone: 'Telefon', date: 'Data', time: 'Ora', vehicle: 'Vehicul', body: 'Tip Caroserie',
          autoNote: 'Acest email a fost generat automat. Nu răspunde la acest mesaj.'
        }
      }
      return M[lang] || M.nl
    })()
    const formatServices = (services) => {
      return services.map(service => `
        <div style="margin-bottom: 10px; padding: 12px; background-color: #f8f9fa; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; color: #212529;">${service.name}</span>
          ${service.price ? `<span style="color: #007bff; font-weight: 700;">€${service.price}</span>` : ''}
        </div>
      `).join('')
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.titleConfirm} - Spectra AutoArt</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #00bcd4 0%, #2196f3 100%); color: white; padding: 18px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 500; }
          .content { padding: 30px; }
          .booking-details { background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #495057; }
          .value { color: #212529; text-align: right; }
          .services-section { margin: 20px 0; }
          .services-title { font-size: 18px; font-weight: 600; color: #495057; margin-bottom: 15px; }
          .footer { background-color: #343a40; color: white; padding: 20px; text-align: center; }
          .contact-info { margin-top: 15px; font-size: 14px; }
          .highlight { background-color: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Spectra AutoArt</h1>
            <p>${t.confirmHeader}</p>
          </div>
          
          <div class="content">
            <div class="highlight">
              <h3>✅ ${t.confirmHeader}!</h3>
              <p>${bookingData.user.name},</p>
              <p></p>
            </div>

            <div class="booking-details">
              <h3>📋 ${t.bookingDetails}</h3>
              <div class="detail-row">
                <span class="label">${t.name}:</span>
                <span class="value">${bookingData.user.name}</span>
              </div>
              <div class="detail-row">
                <span class="label">${t.email}:</span>
                <span class="value">${bookingData.user.email}</span>
              </div>
              <div class="detail-row">
                <span class="label">${t.phone}:</span>
                <span class="value">${bookingData.user.phone}</span>
              </div>
              <div class="detail-row">
                <span class="label">${t.date}:</span>
                <span class="value">${new Date(bookingData.date).toLocaleDateString(({nl:'nl-NL',en:'en-GB',es:'es-ES',pl:'pl-PL',ro:'ro-RO'})[lang] || 'nl-NL')}</span>
              </div>
              <div class="detail-row">
                <span class="label">${t.time}:</span>
                <span class="value">${bookingData.time}</span>
              </div>
              <div class="detail-row">
                <span class="label">${t.vehicle}:</span>
                <span class="value">${bookingData.make} ${bookingData.model}</span>
              </div>
              <div class="detail-row">
                <span class="label">${t.body}:</span>
                <span class="value">${bookingData.body}</span>
              </div>
            </div>

            <div class="services-section">
              <h3 class="services-title">🔧 ${t.selectedServices}</h3>
              ${formatServices(services)}
            </div>

            <div class="highlight">
              <h4>📍</h4>
              <p></p>
            </div>
          </div>

          <div class="footer">
            <p><strong>Spectra AutoArt - Detailing Auto Premium</strong></p>
            <div class="contact-info">
              <p>📧 Email: contact@spectraautoart.nl</p>
              <p>📞 Telefon: +40 712 345 678</p>
              <p>🌐 Website: www.spectraautoart.ro</p>
            </div>
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
              ${t.autoNote}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  clientUpdate: (bookingData, services) => {
    const lang = String(bookingData?.locale || 'nl').toLowerCase()
    const t = (function(){
      const M = {
        nl: {
          titleUpdate: 'Afspraak Gewijzigd',
          updateHeader: 'Afspraak gewijzigd',
          updateNotice: 'De details van uw afspraak zijn bijgewerkt. Controleer de informatie hieronder.',
          bookingDetails: 'Afspraak Details',
          services: 'Diensten',
          date: 'Datum', time: 'Tijd', vehicle: 'Voertuig', body: 'Carrosserie', name: 'Naam', email: 'Email', phone: 'Telefoon',
          autoNote: 'Dit e-mailbericht is automatisch gegenereerd.'
        },
        en: {
          titleUpdate: 'Booking Updated',
          updateHeader: 'Booking updated',
          updateNotice: 'Your booking details have been updated. Please review the information below.',
          bookingDetails: 'Booking Details',
          services: 'Services',
          date: 'Date', time: 'Time', vehicle: 'Vehicle', body: 'Body Type', name: 'Name', email: 'Email', phone: 'Phone',
          autoNote: 'This email was generated automatically.'
        },
        es: {
          titleUpdate: 'Reserva Actualizada',
          updateHeader: 'Reserva actualizada',
          updateNotice: 'Los detalles de su reserva han sido actualizados. Revise la información abajo.',
          bookingDetails: 'Detalles de la Reserva',
          services: 'Servicios',
          date: 'Fecha', time: 'Hora', vehicle: 'Vehículo', body: 'Tipo de Carrocería', name: 'Nombre', email: 'Correo', phone: 'Teléfono',
          autoNote: 'Este correo fue generado automáticamente.'
        },
        pl: {
          titleUpdate: 'Zaktualizowano Rezerwację',
          updateHeader: 'Rezerwacja zaktualizowana',
          updateNotice: 'Szczegóły Twojej rezerwacji zostały zaktualizowane. Sprawdź informacje poniżej.',
          bookingDetails: 'Szczegóły Rezerwacji',
          services: 'Usługi',
          date: 'Data', time: 'Godzina', vehicle: 'Pojazd', body: 'Typ Nadwozia', name: 'Imię', email: 'Email', phone: 'Telefon',
          autoNote: 'Ten email został wygenerowany automatycznie.'
        },
        ro: {
          titleUpdate: 'Programare Modificată',
          updateHeader: 'Programarea ta a fost actualizată',
          updateNotice: 'Detaliile programării au fost modificate conform solicitării.',
          bookingDetails: 'Detalii Programare',
          services: 'Servicii',
          date: 'Data', time: 'Ora', vehicle: 'Vehicul', body: 'Tip Caroserie', name: 'Nume', email: 'Email', phone: 'Telefon',
          autoNote: 'Acest email a fost generat automat.'
        }
      }
      return M[lang] || M.nl
    })()
    const formatServices = (services) => {
      return services.map(service => `
        <div style="margin-bottom: 10px; padding: 12px; background-color: #f8f9fa; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
          <span style="font-weight: 600; color: #212529;">${service.name}</span>
          ${service.price ? `<span style="color: #007bff; font-weight: 700; margin-left: 12px;">€${service.price}</span>` : ''}
        </div>
      `).join('')
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.titleUpdate} - Spectra AutoArt</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 500; }
          .content { padding: 30px; }
          .booking-details { background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #495057; }
          .value { color: #212529; text-align: right; }
          .services-section { margin: 20px 0; }
          .services-title { font-size: 18px; font-weight: 600; color: #495057; margin-bottom: 15px; }
          .footer { background-color: #343a40; color: white; padding: 20px; text-align: center; }
          .contact-info { margin-top: 15px; font-size: 14px; }
          .highlight { background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Spectra AutoArt</h1>
            <p>${t.updateHeader}</p>
          </div>
          
          <div class="content">
            <div class="highlight">
              <h3>ℹ️ ${t.updateHeader}</h3>
              <p>${t.updateNotice}</p>
            </div>

            <div class="booking-details">
              <h3>📋 ${t.bookingDetails}</h3>
              <div class="detail-row">
                <span class="label">${t.date}:</span>
                <span class="value">${new Date(bookingData.date).toLocaleDateString(({nl:'nl-NL',en:'en-GB',es:'es-ES',pl:'pl-PL',ro:'ro-RO'})[lang] || 'nl-NL')}</span>
              </div>
              <div class="detail-row">
                <span class="label">${t.time}:</span>
                <span class="value">${bookingData.time}</span>
              </div>
              <div class="detail-row">
                <span class="label">${t.vehicle}:</span>
                <span class="value">${bookingData.make || ''} ${bookingData.model || ''}</span>
              </div>
              <div class="detail-row">
                <span class="label">${t.body}:</span>
                <span class="value">${bookingData.body || ''}</span>
              </div>
            </div>

            <div class="services-section">
              <h3 class="services-title">🔧 ${t.services}</h3>
              ${formatServices(services)}
            </div>
          </div>

          <div class="footer">
            <p><strong>Spectra AutoArt - Detailing Auto Premium</strong></p>
            <div class="contact-info">
              <p>📧 Email: contact@spectraautoart.nl</p>
              <p>🌐 Website: www.spectraautoart.ro</p>
            </div>
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">${t.autoNote}</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  // Admin notification email template
  adminNotification: (bookingData, services) => {
    const lang = String(bookingData?.locale || 'nl').toLowerCase()
    const t = (function(){
      const M = {
        nl: { titleNew: 'Nieuwe Afspraak', adminSystem: 'Spectra AutoArt - Notificatiesysteem', clientInfo: 'Klantinformatie', vehicleDetails: 'Voertuig Details', bookingTitle: 'Afspraak', date: 'Datum', time: 'Tijd', vehicle: 'Voertuig', body: 'Carrosserie', services: 'Diensten', name: 'Naam', email: 'Email', phone: 'Telefoon', model: 'Model', alertTitle: 'Let op!', alertBody: 'Er is een nieuwe afspraak gemaakt via het online boekingssysteem.', quickActionsTitle: 'Snelle Acties', quickActionsBody: 'Neem contact op met de klant voor definitieve bevestiging of wijzigingen:', btnEmail: '📧 E-mail Klant', btnCall: '📞 Bel Klant', btnWhatsApp: '💬 WhatsApp', timestampLabel: 'Afspraak gemaakt op:', footerTitle: 'Spectra AutoArt - Afsprakenbeheersysteem', footerNote: 'Deze e-mail wordt automatisch verzonden wanneer een nieuwe afspraak is gemaakt.', newsletter: 'Nieuwsbrief', subscribed: 'Geabonneerd', unsubscribed: 'Niet abonat' },
        en: { titleNew: 'New Booking', adminSystem: 'Spectra AutoArt - Notification System', clientInfo: 'Client Information', vehicleDetails: 'Vehicle Details', bookingTitle: 'Booking', date: 'Date', time: 'Time', vehicle: 'Vehicle', body: 'Body Type', services: 'Services', name: 'Name', email: 'Email', phone: 'Phone', model: 'Model', alertTitle: 'Attention!', alertBody: 'A new booking has been made through the online booking system.', quickActionsTitle: 'Quick Actions', quickActionsBody: 'Contact the client for final confirmation or changes:', btnEmail: '📧 Email Client', btnCall: '📞 Call Client', btnWhatsApp: '💬 WhatsApp', timestampLabel: 'Booking made at:', footerTitle: 'Spectra AutoArt - Booking Management System', footerNote: 'This email is sent automatically when a new booking is made.', newsletter: 'Newsletter', subscribed: 'Subscribed', unsubscribed: 'Unsubscribed' },
        es: { titleNew: 'Nueva Reserva', adminSystem: 'Spectra AutoArt - Sistema de Notificaciones', clientInfo: 'Información del Cliente', vehicleDetails: 'Detalles del Vehículo', bookingTitle: 'Reserva', date: 'Fecha', time: 'Hora', vehicle: 'Vehículo', body: 'Tipo de Carrocería', services: 'Servicios', name: 'Nombre', email: 'Correo', phone: 'Teléfono', model: 'Modelo', alertTitle: '¡Atención!', alertBody: 'Se ha realizado una nueva reserva mediante el sistema de reservas en línea.', quickActionsTitle: 'Acciones Rápidas', quickActionsBody: 'Contacte al cliente para confirmación final o cambios:', btnEmail: '📧 Email Cliente', btnCall: '📞 Llamar al Cliente', btnWhatsApp: '💬 WhatsApp', timestampLabel: 'Reserva realizada en:', footerTitle: 'Spectra AutoArt - Sistema de Gestión de Reservas', footerNote: 'Este correo se envía automáticamente cuando se realiza una nueva reserva.', newsletter: 'Boletín', subscribed: 'Suscrito', unsubscribed: 'No suscrito' },
        pl: { titleNew: 'Nowa Rezerwacja', adminSystem: 'Spectra AutoArt - System Powiadomień', clientInfo: 'Informacje o Kliencie', vehicleDetails: 'Szczegóły Pojazdu', bookingTitle: 'Rezerwacja', date: 'Data', time: 'Godzina', vehicle: 'Pojazd', body: 'Typ Nadwozia', services: 'Usługi', name: 'Imię', email: 'Email', phone: 'Telefon', model: 'Model', alertTitle: 'Uwaga!', alertBody: 'Nowa rezerwacja została dokonana przez system rezerwacji online.', quickActionsTitle: 'Szybkie Akcje', quickActionsBody: 'Skontaktuj się z klientem w celu ostatecznego potwierdzenia lub zmian:', btnEmail: '📧 Email do Klienta', btnCall: '📞 Zadzwoń do Klienta', btnWhatsApp: '💬 WhatsApp', timestampLabel: 'Rezerwacja dokonana o:', footerTitle: 'Spectra AutoArt - System Zarządzania Rezerwacjami', footerNote: 'Ten email jest wysyłany automatycznie po dokonaniu nowej rezerwacji.', newsletter: 'Newsletter', subscribed: 'Zapisany', unsubscribed: 'Niezapisany' },
        ro: { titleNew: 'Nouă Programare', adminSystem: 'Spectra AutoArt - Sistem de Notificare', clientInfo: 'Informații Client', vehicleDetails: 'Detalii Vehicul', bookingTitle: 'Programare', date: 'Data', time: 'Ora', vehicle: 'Vehicul', body: 'Tip Caroserie', services: 'Servicii Solicitate', name: 'Nume', email: 'Email', phone: 'Telefon', model: 'Model', alertTitle: 'ATENȚIE!', alertBody: 'O nouă programare a fost efectuată prin sistemul de rezervări online.', quickActionsTitle: 'Acțiuni Rapide', quickActionsBody: 'Contactează clientul pentru confirmare finală sau modificări:', btnEmail: '📧 Email Client', btnCall: '📞 Apelează Client', btnWhatsApp: '💬 WhatsApp', timestampLabel: 'Programare efectuată la:', footerTitle: 'Spectra AutoArt - Sistem de Management al Programărilor', footerNote: 'Acest email este trimis automat când o programare nouă este efectuată.', newsletter: 'Newsletter', subscribed: 'Abonat', unsubscribed: 'Neabonat' }
      }
      return M[lang] || M.nl
    })()
    const formatServices = (services) => {
      return services.map(service => `
        <div style="margin-bottom: 8px; padding: 8px; background-color: #fff3cd; border-radius: 4px; border-left: 3px solid #ffc107;">
          <strong>${service.name}</strong> - €${service.price || 'N/A'}
          ${service.description ? `<br><small>${service.description}</small>` : ''}
        </div>
      `).join('')
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.titleNew} - Spectra AutoArt</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 25px; }
          .alert { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .booking-info { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 15px 0; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-item { margin-bottom: 10px; }
          .info-label { font-weight: 600; color: #495057; display: block; font-size: 14px; text-transform: uppercase; }
          .info-value { color: #212529; font-size: 16px; }
          .services-section { margin: 20px 0; }
          .services-title { font-size: 16px; font-weight: 600; color: #495057; margin-bottom: 10px; }
          .action-buttons { margin-top: 25px; padding: 20px; background-color: #e9ecef; border-radius: 8px; text-align: center; }
          .btn { display: inline-block; padding: 10px 20px; margin: 5px; text-decoration: none; border-radius: 5px; font-weight: 600; }
          .btn-primary { background-color: #007bff; color: white; }
          .btn-success { background-color: #28a745; color: white; }
          .btn-danger { background-color: #dc3545; color: white; }
          .footer { background-color: #343a40; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .timestamp { color: #6c757d; font-size: 12px; text-align: right; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 ${t.titleNew}</h1>
            <p>${t.adminSystem}</p>
          </div>
          
          <div class="content">
            <div class="alert">
              <strong>⚡ ${t.alertTitle}</strong> ${t.alertBody}
            </div>

            <div class="booking-info">
              <h3>👤 ${t.clientInfo}</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">${t.name || 'Nume'}</span>
                  <span class="info-value">${bookingData.user.name}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${t.email || 'Email'}</span>
                  <span class="info-value">${bookingData.user.email}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${t.phone || 'Telefon'}</span>
                  <span class="info-value">${bookingData.user.phone}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${t.newsletter}</span>
                  <span class="info-value">${bookingData.newsletter ? `✅ ${t.subscribed}` : `❌ ${t.unsubscribed}`}</span>
                </div>
              </div>
            </div>

            <div class="booking-info">
              <h3>🚗 ${t.vehicleDetails}</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">${t.vehicle}</span>
                  <span class="info-value">${bookingData.make}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${t.model}</span>
                  <span class="info-value">${bookingData.model}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${t.body}</span>
                  <span class="info-value">${bookingData.body}</span>
                </div>
              </div>
            </div>

            <div class="booking-info">
              <h3>📅 ${t.bookingTitle}</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">${t.date}</span>
                  <span class="info-value">${new Date(bookingData.date).toLocaleDateString(({nl:'nl-NL',en:'en-GB',es:'es-ES',pl:'pl-PL',ro:'ro-RO'})[lang] || 'nl-NL')}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${t.time}</span>
                  <span class="info-value">${bookingData.time}</span>
                </div>
              </div>
            </div>

            <div class="services-section">
              <h3 class="services-title">🔧 ${t.services}</h3>
              ${formatServices(services)}
            </div>

            <div class="action-buttons">
              <h4>⚡ ${t.quickActionsTitle}</h4>
              <p>${t.quickActionsBody}</p>
              <a href="mailto:${bookingData.user.email}" class="btn btn-primary">${t.btnEmail}</a>
              <a href="tel:${bookingData.user.phone}" class="btn btn-success">${t.btnCall}</a>
              <a href="https://wa.me/${bookingData.user.phone.replace(/\D/g, '')}" class="btn btn-success">${t.btnWhatsApp}</a>
            </div>

            <div class="timestamp">
              <p>⏰ ${t.timestampLabel} ${new Date().toLocaleString(({nl:'nl-NL',en:'en-GB',es:'es-ES',pl:'pl-PL',ro:'ro-RO'})[lang] || 'nl-NL')}</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>${t.footerTitle}</strong></p>
            <p>${t.footerNote}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Send email function with intelligent fallback
export const sendEmail = async (to, subject, html, text = '') => {
  const allTransporters = [transporter, ...fallbackTransporters].filter(Boolean)
  
  if (allTransporters.length === 0 && !process.env.RESEND_API_KEY) {
    console.warn(`⚠️ No email transporters available and RESEND_API_KEY missing, skipping email to ${to}`)
    console.warn(`⚠️ Email configuration check - USER: ${(process.env.ZOHO_SMTP_USER || process.env.EMAIL_USER) ? 'SET' : 'MISSING'}, PASS: ${(process.env.ZOHO_SMTP_PASS || process.env.EMAIL_PASS) ? 'SET' : 'MISSING'}`)
    return { success: false, error: 'Email service not configured' }
  }
  
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM_ADDRESS ? `${process.env.MAIL_FROM_NAME || 'Spectra AutoArt'} <${process.env.MAIL_FROM_ADDRESS}>` : (process.env.ZOHO_SMTP_USER || process.env.EMAIL_USER),
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Fallback to HTML stripped of tags
      html
    }

    console.log(`📧 Attempting to send email to ${to} from ${process.env.MAIL_FROM_ADDRESS || process.env.ZOHO_SMTP_USER || process.env.EMAIL_USER}`)
    
    // For Railway environment, prioritize Resend API to avoid SMTP timeouts
    if (process.env.RAILWAY_PROJECT_ID) {
      if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('re_Y5xBHWfG')) {
        console.error('❌ INVALID RESEND_API_KEY in Railway - please get a valid key from https://resend.com')
        console.error('❌ Current key is placeholder or missing - emails cannot be sent!')
        return { success: false, error: 'Invalid Resend API key - please configure a valid key' }
      }
      
      console.log('🏭 Railway environment detected - using Resend API as primary')
      
      // Apply rate limiting before making the request
      await resendRateLimiter.throttle()
      
      try {
        // Use your verified domain sender address
        const fromAddress = process.env.MAIL_FROM_ADDRESS || 'contact@spectraautoart.nl'
        console.log(`📧 Using verified domain sender: ${fromAddress}`)
        console.log(`📧 Domain spectraautoart.nl is verified - emails will show your brand!`)
        
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromAddress,
            to: Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to],
            subject: mailOptions.subject,
            html: mailOptions.html,
            text: mailOptions.text
          })
        })
        
        if (r.ok) {
          const data = await r.json()
          const messageId = data?.id || data?.data?.id || 'resend'
          console.log(`✅ Email sent via Resend API to ${to} with id: ${messageId}`)
          return { success: true, messageId }
        } else {
          const body = await r.text()
          throw new Error(`Resend API failed: ${r.status} ${body}`)
        }
      } catch (resendErr) {
        console.error(`❌ Resend API failed:`, resendErr.message)
        console.log('🔄 Falling back to SMTP transporters...')
      }
    }
    
    // Try each transporter in order (for non-Railway or if Resend failed)
    for (let i = 0; i < allTransporters.length; i++) {
      const currentTransporter = allTransporters[i]
      const isPrimary = i === 0
      
      try {
        console.log(`📧 Trying ${isPrimary ? 'primary' : 'fallback'} transporter (${i + 1}/${allTransporters.length})...`)
        const result = await currentTransporter.sendMail(mailOptions)
        console.log(`✅ Email sent successfully to ${to} with messageId: ${result.messageId}`)
        return { success: true, messageId: result.messageId }
      } catch (err) {
        const isLastTransporter = i === allTransporters.length - 1
        const isNetworkTimeout = err && (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET' || err.code === 'ENETUNREACH' || err.code === 'EAI_AGAIN')
        const isAuthError = err && (err.code === 'EAUTH' || String(err.responseCode) === '554')
        
        console.error(`❌ ${isPrimary ? 'Primary' : 'Fallback'} transporter failed:`, err.message)
        
        if (isLastTransporter) {
          console.warn(`⚠️ All SMTP transporters failed, attempting Resend API fallback...`)
          break // Continue to Resend fallback
        } else {
          console.log(`🔄 Trying next transporter...`)
          continue // Try next transporter
        }
      }
    }
    
    // Final fallback: Resend API
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      try {
        console.log(`📧 Attempting Resend API as final fallback...`)
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: mailOptions.from,
            to: Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to],
            subject: mailOptions.subject,
            html: mailOptions.html,
            text: mailOptions.text
          })
        })
        
        if (r.ok) {
          const data = await r.json()
          const messageId = data?.id || data?.data?.id || 'resend'
          console.log(`✅ Email sent via Resend API to ${to} with id: ${messageId}`)
          return { success: true, messageId }
        } else {
          const body = await r.text()
          throw new Error(`Resend API failed: ${r.status} ${body}`)
        }
      } catch (resendErr) {
        console.error(`❌ Resend API also failed:`, resendErr.message)
        throw new Error(`All email methods failed. Last error: ${resendErr.message}`)
      }
    } else {
      throw new Error('All SMTP transporters failed and no Resend API key available')
    }
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message)
    console.error(`❌ Email config error details:`, {
      code: error.code,
      response: error.response,
      responseCode: error.responseCode
    })
    return { success: false, error: error.message }
  }
}

// Send booking confirmation email to client
export const sendBookingConfirmation = async (bookingData, services) => {
  const html = emailTemplates.clientConfirmation(bookingData, services)
  const subject = html.match(/<title>(.*?)<\/title>/)?.[1] || 'Spectra AutoArt'
  return await sendEmail(bookingData.user.email, subject, html)
}

// Send booking notification email to admin
export const sendAdminNotification = async (bookingData, services) => {
  const html = emailTemplates.adminNotification(bookingData, services)
  const subject = html.match(/<title>(.*?)<\/title>/)?.[1] || `New booking`
  const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'contact@spectraautoart.nl'
  return await sendEmail(adminRecipient, subject, html)
}

export const sendBookingUpdate = async (bookingData, services) => {
  const html = emailTemplates.clientUpdate(bookingData, services)
  const subject = html.match(/<title>(.*?)<\/title>/)?.[1] || 'Programare Modificată'
  return await sendEmail(bookingData.user.email, subject, html)
}

export const sendAdminUpdate = async (bookingData, services) => {
  const html = emailTemplates.clientUpdate(bookingData, services)
  const subject = html.match(/<title>(.*?)<\/title>/)?.[1] || 'Programare Modificată'
  const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MAIL_FROM_ADDRESS || 'contact@spectraautoart.nl'
  return await sendEmail(adminRecipient, subject, html)
}

// Initialize and verify email service
export const initializeEmailService = async () => {
  const hasUser = !!(process.env.ZOHO_SMTP_USER || process.env.EMAIL_USER)
  const hasPass = !!(process.env.ZOHO_SMTP_PASS || process.env.EMAIL_PASS)
  if (!hasUser || !hasPass) {
    console.warn('⚠️ Email credentials not configured - email service disabled')
    return false
  }
  try {
    const isVerified = await verifyTransporter()
    if (!isVerified) {
      console.warn('⚠️ Email service verification failed - emails may not be sent')
    }
    return isVerified
  } catch (error) {
    console.error('❌ Email service initialization error:', error.message)
    return false
  }
}

// Test email function
export const testEmailService = async () => {
  console.log('🔧 Testing email service configuration...');
  const hasUser = !!(process.env.ZOHO_SMTP_USER || process.env.EMAIL_USER);
  const hasPass = !!(process.env.ZOHO_SMTP_PASS || process.env.EMAIL_PASS);
  const hasHost = !!(process.env.ZOHO_SMTP_HOST || process.env.SMTP_HOST);
  const hasPort = !!(process.env.ZOHO_SMTP_PORT || process.env.SMTP_PORT);
  console.log('📧 Email configuration status:');
  console.log(`   USER: ${hasUser ? '✅ SET' : '❌ MISSING'}`);
  console.log(`   PASS: ${hasPass ? '✅ SET' : '❌ MISSING'}`);
  console.log(`   HOST: ${hasHost ? '✅ SET' : '❌ MISSING'} (${process.env.ZOHO_SMTP_HOST || process.env.SMTP_HOST || 'default'})`);
  console.log(`   PORT: ${hasPort ? '✅ SET' : '❌ MISSING'} (${process.env.ZOHO_SMTP_PORT || process.env.SMTP_PORT || 'default'})`);
  if (!hasUser || !hasPass) {
    console.warn('⚠️ Email service not properly configured');
    return false;
  }
  if (!transporter) {
    console.error('❌ Email transporter not initialized');
    return false;
  }
  try {
    const isVerified = await verifyTransporter();
    if (isVerified) {
      console.log('✅ Email service is ready');
      return true;
    } else {
      console.warn('⚠️ Email transporter verification failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Email service test failed:', error.message);
    return false;
  }
};

export default {
  sendEmail,
  sendBookingConfirmation,
  sendAdminNotification,
  sendBookingUpdate,
  sendAdminUpdate,
  initializeEmailService,
  testEmailService
}
