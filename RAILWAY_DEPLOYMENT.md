# Railway Deployment Guide for Spectra AutoArt

## Quick Start

1. **Create Railway Account**: https://railway.app
2. **Connect GitHub**: Link your GitHub account to Railway
3. **Deploy**: Click "Deploy from GitHub repo" and select this repository

## Environment Variables Required

Copy these variables to your Railway dashboard:

```env
# Server Configuration
PORT=8080
CLIENT_ORIGIN=https://your-app-url.up.railway.app

# Google Sheets API (Required)
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key

# Security
JWT_SECRET=your_32_character_secret_key

# Admin Access
ADMIN_DEFAULT_EMAIL=admin@yourdomain.com
ADMIN_DEFAULT_PASSWORD=your_secure_password

# Optional: Twilio for WhatsApp
TWILIO_ACCOUNT_SID=optional
TWILIO_AUTH_TOKEN=optional
TWILIO_WHATSAPP_FROM=optional
ADMIN_WHATSAPP_TO=optional

# Optional: Gmail for emails
GMAIL_CLIENT_ID=optional
GMAIL_CLIENT_SECRET=optional
GMAIL_REFRESH_TOKEN=optional
GMAIL_SENDER_EMAIL=optional
```

## Setup Steps

### 1. Google Sheets Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Sheets API
4. Create a service account
5. Download the private key JSON
6. Share your spreadsheet with the service account email

### 2. Railway Deployment
1. Click "New Project" in Railway
2. Select "Deploy from GitHub repo"
3. Choose this repository
4. Add all environment variables
5. Click "Deploy"

### 3. Post-Deployment
1. Update `CLIENT_ORIGIN` with your actual Railway URL
2. Test the API endpoint: `https://your-app-url.up.railway.app/api/health`
3. Access admin panel: `https://your-app-url.up.railway.app/admin`

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Google Sheets credentials are correct
- Check Railway logs for specific errors

### API Not Working
- Verify `CLIENT_ORIGIN` matches your Railway URL
- Check CORS configuration
- Test individual API endpoints

### Google Sheets Issues
- Ensure spreadsheet is shared with service account
- Verify spreadsheet ID is correct
- Check service account permissions

## Support

For issues, please open a GitHub issue or contact support.