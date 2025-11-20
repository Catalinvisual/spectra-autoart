# Backend API pentru Spectra AutoArt

Acesta este backend-ul pentru sistemul de programări auto Spectra AutoArt.

## Configurare

1. Copiază fișierul `.env.example` în `.env`
2. Completează variabilele de mediu necesare
3. Rulează `npm install` pentru a instala dependențele
4. Rulează `npm run dev` pentru a porni serverul

## Structura proiectului

- `src/index.js` - Server principal Express
- `src/routes/` - Rutele API
- `src/services/` - Servicii pentru traduceri, Google Sheets, notificări
- `src/middleware/` - Middleware pentru autentificare și validare

## API Endpoints

### Public
- `GET /public/vehicles` - Lista vehiculelor
- `GET /public/services` - Lista serviciilor
- `GET /public/bookings/availability` - Disponibilitate programări
- `POST /public/bookings` - Creare programare
- `POST /public/newsletter/subscribe` - Abonare newsletter

### Admin
- `POST /admin/auth/login` - Login admin
- `GET /admin/bookings` - Lista programărilor
- `CRUD /admin/services` - Gestionare servicii
- `CRUD /admin/vehicles` - Gestionare vehicule
- `CRUD /admin/gallery` - Gestionare galerie