import * as nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify()
    console.log('✅ Email transporter verified successfully')
    return true
  } catch (error) {
    console.error('❌ Email transporter verification failed:', error)
    return false
  }
}

// Email templates
const emailTemplates = {
  // Client confirmation email template
  clientConfirmation: (bookingData, services) => {
    const formatServices = (services) => {
      return services.map(service => `
        <div style="margin-bottom: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
          <strong>${service.name}</strong><br>
          <span style="color: #666;">${service.description}</span>
          ${service.price ? `<br><span style="color: #007bff; font-weight: bold;">€${service.price}</span>` : ''}
        </div>
      `).join('')
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmare Programare - Spectra AutoArt</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
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
            <h1>🚗 Spectra AutoArt</h1>
            <p>Confirmare Programare</p>
          </div>
          
          <div class="content">
            <div class="highlight">
              <h3>✅ Programarea a fost confirmată!</h3>
              <p>Dragă ${bookingData.user.name},</p>
              <p>Îți mulțumim pentru încrederea acordată! Programarea ta a fost înregistrată cu succes și confirmată pentru data și ora selectate.</p>
            </div>

            <div class="booking-details">
              <h3>📋 Detalii Programare</h3>
              <div class="detail-row">
                <span class="label">Nume:</span>
                <span class="value">${bookingData.user.name}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${bookingData.user.email}</span>
              </div>
              <div class="detail-row">
                <span class="label">Telefon:</span>
                <span class="value">${bookingData.user.phone}</span>
              </div>
              <div class="detail-row">
                <span class="label">Data:</span>
                <span class="value">${new Date(bookingData.date).toLocaleDateString('ro-RO')}</span>
              </div>
              <div class="detail-row">
                <span class="label">Ora:</span>
                <span class="value">${bookingData.time}</span>
              </div>
              <div class="detail-row">
                <span class="label">Vehicul:</span>
                <span class="value">${bookingData.make} ${bookingData.model}</span>
              </div>
              <div class="detail-row">
                <span class="label">Tip Caroserie:</span>
                <span class="value">${bookingData.body}</span>
              </div>
            </div>

            <div class="services-section">
              <h3 class="services-title">🔧 Servicii Selectate</h3>
              ${formatServices(services)}
            </div>

            <div class="highlight">
              <h4>📍 Ne vedem curând!</h4>
              <p>Te așteptăm la Spectra AutoArt pentru a-ți oferi serviciile noastre de calitate superioară.</p>
              <p><strong>Adresa:</strong> Strada Exemplu 123, București</p>
              <p><strong>Program:</strong> Luni-Vineri: 09:00-18:00</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>Spectra AutoArt - Detailing Auto Premium</strong></p>
            <div class="contact-info">
              <p>📧 Email: spectraautoart@gmail.com</p>
              <p>📞 Telefon: +40 712 345 678</p>
              <p>🌐 Website: www.spectraautoart.ro</p>
            </div>
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
              Acest email a fost generat automat. Nu răspunde la acest mesaj.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  // Admin notification email template
  adminNotification: (bookingData, services) => {
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
        <title>Nouă Programare - Spectra AutoArt</title>
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
            <h1>🚨 Nouă Programare</h1>
            <p>Spectra AutoArt - Sistem de Notificare</p>
          </div>
          
          <div class="content">
            <div class="alert">
              <strong>⚡ ATENȚIE!</strong> O nouă programare a fost efectuată prin sistemul de rezervări online.
            </div>

            <div class="booking-info">
              <h3>👤 Informații Client</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Nume Complet</span>
                  <span class="info-value">${bookingData.user.name}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email</span>
                  <span class="info-value">${bookingData.user.email}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Telefon</span>
                  <span class="info-value">${bookingData.user.phone}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Newsletter</span>
                  <span class="info-value">${bookingData.newsletter ? '✅ Abonat' : '❌ Neabonat'}</span>
                </div>
              </div>
            </div>

            <div class="booking-info">
              <h3>🚗 Detalii Vehicul</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Marcă</span>
                  <span class="info-value">${bookingData.make}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Model</span>
                  <span class="info-value">${bookingData.model}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Tip Caroserie</span>
                  <span class="info-value">${bookingData.body}</span>
                </div>
              </div>
            </div>

            <div class="booking-info">
              <h3>📅 Programare</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Data Programării</span>
                  <span class="info-value">${new Date(bookingData.date).toLocaleDateString('ro-RO')}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Ora Programării</span>
                  <span class="info-value">${bookingData.time}</span>
                </div>
              </div>
            </div>

            <div class="services-section">
              <h3 class="services-title">🔧 Servicii Solicitate</h3>
              ${formatServices(services)}
            </div>

            <div class="action-buttons">
              <h4>⚡ Acțiuni Rapide</h4>
              <p>Contactează clientul pentru confirmare finală sau modificări:</p>
              <a href="mailto:${bookingData.user.email}" class="btn btn-primary">📧 Email Client</a>
              <a href="tel:${bookingData.user.phone}" class="btn btn-success">📞 Apelează Client</a>
              <a href="https://wa.me/${bookingData.user.phone.replace(/\D/g, '')}" class="btn btn-success">💬 WhatsApp</a>
            </div>

            <div class="timestamp">
              <p>⏰ Programare efectuată la: ${new Date().toLocaleString('ro-RO')}</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>Spectra AutoArt - Sistem de Management al Programărilor</strong></p>
            <p>Acest email este trimis automat când o programare nouă este efectuată.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Send email function
export const sendEmail = async (to, subject, html, text = '') => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Fallback to HTML stripped of tags
      html
    }

    const result = await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent successfully to ${to}`)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error)
    return { success: false, error: error.message }
  }
}

// Send booking confirmation email to client
export const sendBookingConfirmation = async (bookingData, services) => {
  const subject = '✅ Confirmare Programare - Spectra AutoArt'
  const html = emailTemplates.clientConfirmation(bookingData, services)
  
  return await sendEmail(bookingData.user.email, subject, html)
}

// Send booking notification email to admin
export const sendAdminNotification = async (bookingData, services) => {
  const subject = `🚨 Nouă Programare: ${bookingData.user.name} - ${new Date(bookingData.date).toLocaleDateString('ro-RO')}`
  const html = emailTemplates.adminNotification(bookingData, services)
  
  return await sendEmail('spectraautoart@gmail.com', subject, html)
}

// Initialize and verify email service
export const initializeEmailService = async () => {
  const isVerified = await verifyTransporter()
  if (!isVerified) {
    console.warn('⚠️ Email service initialization failed - emails may not be sent')
  }
  return isVerified
}

export default {
  sendEmail,
  sendBookingConfirmation,
  sendAdminNotification,
  initializeEmailService
}