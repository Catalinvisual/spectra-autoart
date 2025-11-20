# Spectra AutoArt - Sistem de Programări Auto

O aplicație completă pentru programări auto detailing, dezvoltată cu React, Node.js și Express.

## 🚀 Caracteristici

- **Frontend Modern**: React cu TypeScript, design responsive și animații GSAP
- **Backend Robust**: API REST cu Node.js, Express și autentificare JWT
- **Sistem de Programări**: Programări online cu gestionare completă
- **Administrare**: Panou admin pentru gestionarea serviciilor și programărilor
- **Notificări**: Integrare WhatsApp și email pentru notificări
- **Multi-lingv**: Suport pentru limba română și engleză
- **Hartă Interactivă**: Integrare Google Maps pentru locație

## 📋 Cerințe

- Node.js (v18 sau superior)
- npm sau yarn
- Cont Google Cloud pentru Google Sheets API
- Cont Twilio pentru notificări WhatsApp (opțional)

## 🛠️ Instalare Locală

### 1. Clonează repository-ul
```bash
git clone https://github.com/Catalinvisual/spectra-autoart.git
cd spectra-autoart
```

### 2. Instalează dependințele
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Configurează variabilele de mediu

#### Server (.env)
Copiază fișierul `.env.example` și completează cu valorile tale:
```bash
cd server
cp .env.example .env
```

**Variabile necesare pentru Railway:**
```env
PORT=8080
CLIENT_ORIGIN=https://numele-tau-app.railway.app
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
JWT_SECRET=your_jwt_secret
ADMIN_DEFAULT_EMAIL=admin@yourdomain.com
ADMIN_DEFAULT_PASSWORD=your_admin_password
```

#### Client (.env)
```bash
cd client
cp .env.example .env
```

```env
VITE_API_URL=https://numele-tau-app.railway.app/api
```

### 4. Rulează aplicația

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

## 🚢 Deployment pe Railway

### Metoda 1: Deployment Automat cu Dockerfile

Railway va detecta automat Dockerfile și va construi aplicația.

### Metoda 2: Deployment Manual

1. **Crează cont pe Railway**: https://railway.app
2. **Conectează GitHub**: Conectează-ți contul GitHub la Railway
3. **Crează nou proiect**: Selectează "Deploy from GitHub repo"
4. **Configurează variabilele de mediu**: Adaugă toate variabilele din `.env.example`
5. **Deploy**: Railway va construi și lansa automat aplicația

### Configurare Google Sheets API

1. Accesează [Google Cloud Console](https://console.cloud.google.com/)
2. Crează un nou proiect sau selectează unul existent
3. Activează Google Sheets API
4. Crează un service account și descarcă cheia privată
5. Partajează spreadsheet-ul cu email-ul service account-ului

### Configurare Twilio (Opțional)

1. Crează cont pe [Twilio](https://www.twilio.com/)
2. Obține Account SID și Auth Token
3. Configurează numărul WhatsApp

## 📁 Structura Proiectului

```
spectra-autoart/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componente React
│   │   ├── pages/         # Pagini principale
│   │   ├── contexts/      # Context API
│   │   ├── hooks/         # Custom hooks
│   │   └── services/      # Servicii API
│   └── package.json
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── routes/        # Rute API
│   │   ├── services/      # Servicii backend
│   │   └── middleware/    # Middleware Express
│   └── package.json
└── README.md
```

## 🔧 Tehnologii Folosite

### Frontend
- React 19 cu TypeScript
- Vite pentru build și dezvoltare
- GSAP pentru animații
- i18next pentru internaționalizare
- Axios pentru API calls

### Backend
- Node.js cu Express
- Google Sheets API pentru stocare
- JWT pentru autentificare
- Twilio pentru notificări
- Google Translate API

## 📝 Script-uri Disponibile

### Client
- `npm run dev` - Dezvoltare locală
- `npm run build` - Build pentru producție
- `npm run preview` - Preview build

### Server
- `npm run dev` - Dezvoltare locală
- `npm start` - Start producție

## 🔒 Securitate

- Autentificare JWT pentru admin
- CORS configurat pentru origini specifice
- Validare input pe toate rutele
- Rate limiting implementat

## 📞 Suport

Pentru probleme sau întrebări:
- Deschide un issue pe GitHub
- Contact: admin@spectraautoart.com

## 📄 Licență

Acest proiect este proprietar și destinat exclusiv uzului comercial pentru Spectra AutoArt.