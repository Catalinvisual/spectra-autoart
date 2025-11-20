import twilio from 'twilio';
import { google } from 'googleapis';

class NotificationService {
  constructor() {
    this.twilioClient = null;
    this.gmailAuth = null;
    this.initializeServices();
  }

  initializeServices() {
    // Initialize Twilio if credentials are available
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER) {
      try {
        this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        console.log('✅ Twilio WhatsApp service initialized');
      } catch (error) {
        console.warn('⚠️ Twilio initialization failed:', error.message);
      }
    } else {
      console.log('ℹ️ Twilio credentials not configured - using demo mode');
    }

    // Initialize Gmail if credentials are available
    if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN) {
      try {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GMAIL_CLIENT_ID,
          process.env.GMAIL_CLIENT_SECRET,
          process.env.GMAIL_REDIRECT_URI || 'http://localhost:3001/oauth2callback'
        );
        
        oauth2Client.setCredentials({
          refresh_token: process.env.GMAIL_REFRESH_TOKEN
        });
        
        this.gmailAuth = oauth2Client;
        console.log('✅ Gmail service initialized');
      } catch (error) {
        console.warn('⚠️ Gmail initialization failed:', error.message);
      }
    } else {
      console.log('ℹ️ Gmail credentials not configured - using demo mode');
    }
  }

  async sendWhatsAppNotification(to, message) {
    if (!this.twilioClient) {
      console.log('📱 Demo WhatsApp notification:', { to, message });
      return { success: true, demo: true, message: 'Demo mode - no actual message sent' };
    }

    try {
      const result = await this.twilioClient.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${to}`,
        body: message
      });

      console.log('📱 WhatsApp message sent:', result.sid);
      return { success: true, messageId: result.sid };
    } catch (error) {
      console.error('❌ WhatsApp notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEmailNotification(to, subject, htmlContent, textContent = null) {
    if (!this.gmailAuth) {
      console.log('📧 Demo email notification:', { to, subject, htmlContent });
      return { success: true, demo: true, message: 'Demo mode - no actual email sent' };
    }

    try {
      const gmail = google.gmail({ version: 'v1', auth: this.gmailAuth });
      
      const message = [
        'From: Spectra AutoArt <' + process.env.GMAIL_USER + '>',
        'To: ' + to,
        'Subject: ' + subject,
        'Content-Type: text/html; charset=utf-8',
        '',
        htmlContent
      ].join('\n');

      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });

      console.log('📧 Email sent:', result.data.id);
      return { success: true, messageId: result.data.id };
    } catch (error) {
      console.error('❌ Email notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendBookingConfirmation(bookingData) {
    const { user, date, make, model, services, locale = 'nl' } = bookingData;
    
    // Multilingual messages
    const messages = {
      nl: {
        whatsapp: `Beste ${user.name},\n\nUw afspraak bij Spectra AutoArt is bevestigd!\n\nDatum: ${new Date(date).toLocaleDateString('nl-NL')}\nVoertuig: ${make} ${model}\nServices: ${services.join(', ')}\n\nBedankt voor uw vertrouwen!\n\nMet vriendelijke groet,\nSpectra AutoArt`,
        email: {
          subject: 'Afspraakbevestiging - Spectra AutoArt',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00e5ff;">Afspraakbevestiging</h2>
              <p>Beste ${user.name},</p>
              <p>Uw afspraak bij Spectra AutoArt is bevestigd!</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #00e5ff;">Afspraakdetails:</h3>
                <p><strong>Datum:</strong> ${new Date(date).toLocaleDateString('nl-NL')}</p>
                <p><strong>Voertuig:</strong> ${make} ${model}</p>
                <p><strong>Services:</strong> ${services.join(', ')}</p>
              </div>
              <p>Bedankt voor uw vertrouwen!</p>
              <p>Met vriendelijke groet,<br><strong>Spectra AutoArt</strong></p>
            </div>
          `
        }
      },
      en: {
        whatsapp: `Dear ${user.name},\n\nYour appointment at Spectra AutoArt is confirmed!\n\nDate: ${new Date(date).toLocaleDateString('en-US')}\nVehicle: ${make} ${model}\nServices: ${services.join(', ')}\n\nThank you for your trust!\n\nBest regards,\nSpectra AutoArt`,
        email: {
          subject: 'Appointment Confirmation - Spectra AutoArt',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00e5ff;">Appointment Confirmation</h2>
              <p>Dear ${user.name},</p>
              <p>Your appointment at Spectra AutoArt is confirmed!</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #00e5ff;">Appointment Details:</h3>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US')}</p>
                <p><strong>Vehicle:</strong> ${make} ${model}</p>
                <p><strong>Services:</strong> ${services.join(', ')}</p>
              </div>
              <p>Thank you for your trust!</p>
              <p>Best regards,<br><strong>Spectra AutoArt</strong></p>
            </div>
          `
        }
      },
      ro: {
        whatsapp: `Dragă ${user.name},\n\nProgramarea dvs. la Spectra AutoArt este confirmată!\n\nData: ${new Date(date).toLocaleDateString('ro-RO')}\nVehicul: ${make} ${model}\nServicii: ${services.join(', ')}\n\nVă mulțumim pentru încredere!\n\nCu respect,\nSpectra AutoArt`,
        email: {
          subject: 'Confirmare Programare - Spectra AutoArt',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00e5ff;">Confirmare Programare</h2>
              <p>Dragă ${user.name},</p>
              <p>Programarea dvs. la Spectra AutoArt este confirmată!</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #00e5ff;">Detalii Programare:</h3>
                <p><strong>Data:</strong> ${new Date(date).toLocaleDateString('ro-RO')}</p>
                <p><strong>Vehicul:</strong> ${make} ${model}</p>
                <p><strong>Servicii:</strong> ${services.join(', ')}</p>
              </div>
              <p>Vă mulțumim pentru încredere!</p>
              <p>Cu respect,<br><strong>Spectra AutoArt</strong></p>
            </div>
          `
        }
      }
    };

    const messageSet = messages[locale] || messages.nl;
    
    // Send WhatsApp notification if phone number is available
    let whatsappResult = null;
    if (user.phone) {
      whatsappResult = await this.sendWhatsAppNotification(
        user.phone,
        messageSet.whatsapp
      );
    }

    // Send email notification
    const emailResult = await this.sendEmailNotification(
      user.email,
      messageSet.email.subject,
      messageSet.email.html
    );

    return {
      success: true,
      notifications: {
        whatsapp: whatsappResult,
        email: emailResult
      }
    };
  }

  async sendNewsletter(recipients, subject, htmlContent, textContent = null) {
    const results = [];
    
    for (const recipient of recipients) {
      const result = await this.sendEmailNotification(
        recipient.email,
        subject,
        htmlContent,
        textContent
      );
      
      results.push({
        email: recipient.email,
        name: recipient.name,
        success: result.success,
        error: result.error,
        demo: result.demo
      });
    }

    return {
      success: true,
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }
}

export default new NotificationService();