# Development Guide - Spectra AutoArt

## 🚀 Rulare Locală (Development)

### Server (Backend)
```bash
cd server
npm run dev
```
- Rulează pe portul: **3001**
- Folosește: `.env.local` pentru configurare
- API URL: `http://localhost:3001/api`

### Client (Frontend)
```bash
cd client
npm run dev
```
- Rulează pe portul: **5174** (sau următorul disponibil)
- Folosește: `.env.local` pentru configurare
- Aplicație: `http://localhost:5174`

## 🌐 Producție (Railway)

### Build pentru Railway
```bash
cd client
npm run build:railway
```
- Folosește API-ul de producție: `https://spectra-autoart-production.up.railway.app/api`

### Build Local (pentru testare)
```bash
cd client
npm run build:local
```
- Folosește API-ul local: `http://localhost:3001/api`

## 📁 Fișiere de Configurare

### Server
- `.env` - Producție (Railway)
- `.env.local` - Development local

### Client
- `.env.local` - Development local (vite)
- Variabilele sunt setate în `package.json` pentru build

## 🔧 Comenzi Utile

### Development Local (ambele aplicații)
1. Server: `cd server && npm run dev`
2. Client: `cd client && npm run dev`

### Build Production
- Railway: `npm run build:railway`
- Local test: `npm run build:local`

### Verificare Porturi
```bash
# Vezi ce procese folosesc porturile
netstat -ano | findstr :8080
netstat -ano | findstr :3001
netstat -ano | findstr :5173
```

## ⚙️ Configurare Medii

### Development (.env.local)
```env
PORT=3001
NODE_ENV=development
VITE_API_URL=http://localhost:3001/api
```

### Producție (.env)
```env
PORT=8080
NODE_ENV=production
# Railway setează automat variabilele
```