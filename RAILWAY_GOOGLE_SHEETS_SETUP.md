# 🚀 Google Sheets Configuration for Railway Production

## ✅ Current Status: LOCAL WORKING
- Server local funcționează cu Google Sheets ✅
- Toate variabilele sunt încărcate corect ✅
- Conexiunea la Google Sheets API este funcțională ✅

## 📋 Pași pentru Railway Production

### 1. Verifică variabilele în Railway Dashboard
Accesează: https://railway.app/project/{your-project}/variables

**Variabile necesare:**
```
GOOGLE_SHEETS_SPREADSHEET_ID=1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90
GOOGLE_SERVICE_ACCOUNT_EMAIL=spectra-autoart@spectra-autoart.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEA...\n-----END PRIVATE KEY-----\n
PORT=8080
NODE_ENV=production
```

**⚠️ IMPORTANT pentru GOOGLE_PRIVATE_KEY:**
- Înlocuiește `\n` cu newline-uri reale în Railway
- Nu lăsa `\n` escaped, ci introdu newline-uri fizice
- Cheia trebuie să conțină exact formatul:
```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEA...
-----END PRIVATE KEY-----
```

### 2. Testează configurația locală
Rulează scriptul de test:
```bash
cd server
node test-production-gsheets.js
```

### 3. Verifică în Railway
După ce adaugi variabilele:
1. Fă redeploy la aplicație
2. Verifică logs în Railway Dashboard
3. Caută mesajele: "✅ Google Sheets service initialized successfully"

### 4. Debug în producție
Dacă nu funcționează, rulează în Railway:
```bash
node scripts/check-railway-config.js
```

## 🔍 Troubleshooting Common Issues

### Problemă: Variabilele sunt undefined în logs
**Soluție:** Verifică că:
- Toate variabilele sunt setate în Railway Dashboard
- Nu ai spații înainte/după valori
- GOOGLE_PRIVATE_KEY are newline-uri reale, nu `\n`

### Problemă: Eroare 403 Forbidden
**Soluție:** Service account-ul trebuie să aibă acces la spreadsheet:
1. Deschide Google Sheet: `1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90`
2. Click pe "Share" → "Add people"
3. Adaugă: `spectra-autoart@spectra-autoart.iam.gserviceaccount.com`
4. Dă rolul "Editor"

### Problemă: Eroare 404 Not Found
**Soluție:** Verifică că Spreadsheet ID este corect

## 📊 Rezultate așteptate
Când totul funcționează, în logs vei vedea:
```
🔍 Checking Google Sheets credentials...
📊 SPREADSHEET_ID: 1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90
📧 SERVICE_ACCOUNT_EMAIL: spectra-autoart@spectra-autoart.iam.gserviceaccount.com
🔑 PRIVATE_KEY exists: true
✅ Google Sheets service initialized successfully
```

## 🎯 Next Steps
1. Adaugă variabilele în Railway Dashboard
2. Fă redeploy
3. Verifică logs pentru confirmare
4. Testează API endpoints în producție
5. Confirmă că datele din Google Sheets sunt returnate

## 📞 Support
Dacă întâmpini probleme:
1. Rulează scripturile de debug create
2. Verifică logs în Railway
3. Asigură-te că service account-ul are acces la spreadsheet
4. Re-verifică formatul GOOGLE_PRIVATE_KEY