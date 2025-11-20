import twilio from 'twilio'
import { google } from 'googleapis'

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function sendWhatsAppNotification(message) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log('Demo WhatsApp:', message)
    return
  }
  
  try {
    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${process.env.ADMIN_WHATSAPP_TO}`,
      body: message
    })
    console.log('WhatsApp trimis cu succes')
  } catch (error) {
    console.error('Eroare WhatsApp:', error.message)
  }
}

let gmailAuth
let gmail

function initGmail() {
  if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET) {
    console.log('Gmail neconfigurat, folosesc consola')
    return false
  }
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  )
  
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  })
  
  gmailAuth = oauth2Client
  gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  return true
}

export async function sendEmail(to, subject, htmlBody) {
  if (!initGmail()) {
    console.log(`Demo Email: To: ${to}, Subject: ${subject}`)
    return
  }
  
  try {
    const message = [
      `To: ${to}`,
      `From: ${process.env.GMAIL_SENDER_EMAIL}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      htmlBody
    ].join('\r\n')
    
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage }
    })
    
    console.log('Email trimis cu succes')
  } catch (error) {
    console.error('Eroare email:', error.message)
  }
}