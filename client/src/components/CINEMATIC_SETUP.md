# Cinematic Background Setup

## Fișiere necesare pentru implementare:

### 1. Video-uri (crează folderul `/public/videos/`)
Recomandări pentru conținut video cinematic:

**ceramic-detailing-cinematic.mp4**
- Durată: 15-30 secunde (loop)
- Rezoluție: 1920x1080 (Full HD) sau 1280x720 (HD)
- Format: MP4 (H.264 codec)
- Dimensiune optimă: sub 10MB pentru performanță

**Idei de conținut:**
- Slow-motion cu apă care curge pe suprafața vopsită
- Reflexii cinematice pe ceramic coating
- Close-up cu aplicarea ceramicii
- Lumină care dansează pe caroserie
- Detalii cu jante și faruri premium

### 2. Imagini fallback (crează folderul `/public/images/`)

**ceramic-coating-hero.jpg**
- Rezoluție: 2560x1440 (2K) sau 1920x1080
- Format: JPG optimizat (calitate 80-90%)
- Dimensiune: sub 500KB
- Conținut: imagine high-quality cu ceramic coating

## Generare conținut (opțiuni):

### Opțiunea 1: Stock Video Gratuit
```bash
# Poți descărca de pe:
- Pexels.com (caută "ceramic coating car")
- Pixabay.com (caută "car detailing cinematic")
- Coverr.co (caută "automotive cinematic")
```

### Opțiunea 2: AI Video Generation
```bash
# Utilizează servicii precum:
- Runway ML (text-to-video)
- Pika Labs (AI video generation)
- Stable Video Diffusion

Prompt sugerat:
"Cinematic slow-motion shot of water flowing over a glossy ceramic-coated car surface, 
professional automotive detailing, premium luxury feel, soft lighting, shallow depth of field, 
4K quality, seamless loop"
```

### Opțiunea 3: Filmare Reală
```bash
# Echipament necesar:
- Smartphone cu capacitate 4K + stabilizator
- Sau camera DSLR/mirrorless
- Iluminare naturală sau softbox
- Microfon extern (opțional)

Tips filmare:
- Folosește slow-motion (60fps sau 120fps)
- Iluminare difuză (zînnic sau umbrelă)
- Unghiuri creative: close-up, wide, detail shots
- Mișcare lentă și fluidă
```

## Optimizare pentru web:

### Compresie video:
```bash
# FFmpeg (gratuit)
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset slow -profile:v high -level 4.0 -movflags +faststart output.mp4

# HandBrake (GUI)
- Preset: "Web > Vimeo YouTube 1080p"
- RF: 20-23 pentru balanță calitate/dimensiune
```

### Optimizare imagine:
```bash
# TinyPNG.com (online)
# Sau Photoshop: Export > Save for Web
- Quality: 70-80%
- Progressive: enabled
- Metadata: removed
```

## Implementare:

1. Adaugă fișierele în folderele respective:
   - `/public/videos/ceramic-detailing-cinematic.mp4`
   - `/public/images/ceramic-coating-hero.jpg`

2. Componenta va detecta automat:
   - Conexiune lentă → folosește imagine
   - Mobile → folosește imagine
   - Prefers-reduced-motion → folosește imagine
   - Desktop performant → folosește video

3. Fallback-uri implementate:
   - Video nu se încarcă → imagine fallback
   - Autoplay blocat → buton de play (opțional)
   - Eroare încărcare → gradient background

## Performance tips:
- Video-ul se oprește când nu e în viewport
- Încărcare lazy pentru performanță
- Dimensiuni optimizate pentru fiecare device
- Cache browser pentru re-visit

## Testing:
```bash
# Testează pe:
- Chrome DevTools > Network > Throttle
- Firefox > Responsive Design Mode
- Safari > Develop > Network Link Conditioner

# Verifică:
- Timp încărcare (sub 3 secunde ideal)
- CPU usage (Task Manager)
- Memory usage (DevTools Performance)
```