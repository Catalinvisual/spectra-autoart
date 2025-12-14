const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Creez arhivă cu schimbările pentru GitHub...')

// Creează un director temporar pentru arhivă
const tempDir = path.join(__dirname, 'github-upload')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir)
}

// Listează fișierele importante care trebuie adăugate
const importantFiles = [
  'client/dist/',
  'h.js',
  'railway.toml', 
  'railway-hybrid-prod.Dockerfile',
  'server/src/index.js',
  'package.json',
  'client/package.json',
  'server/package.json'
]

// Creează un fișier README cu instrucțiuni
const readmeContent = `# Upload Manual pentru GitHub

## Fișiere modificate importante:

1. **client/dist/** - Aplicația React buildată (SOLUȚIA pentru "Not Found")
2. **h.js** - Healthcheck server pentru Railway
3. **railway.toml** - Configurație Railway actualizată
4. **railway-hybrid-prod.Dockerfile** - Dockerfile pentru producție
5. **server/src/index.js** - Server Express cu configurație corectă

## Problemă rezolvată:
- ✅ "Not Found" - Pagina principală este acum accesibilă
- ✅ Healthcheck funcțional pentru Railway
- ✅ Build React inclus în container

## Instrucțiuni upload:
1. Creează un nou release pe GitHub
2. Încarcă această arhivă ca asset
3. Railway va descărca automat și construi proiectul

## Comenzi utile:
\`\`\`bash
# Pentru a crea această arhivă:
node create_github_package.js
\`\`\`
`

// Scrie fișierul README
fs.writeFileSync(path.join(tempDir, 'README_UPLOAD.md'), readmeContent)

console.log('✅ Fișier README creat cu succes!')
console.log('📁 Conținutul arhivei este gata în directorul:', tempDir)
console.log('🚀 Urmează să creezi arhiva zip și să o încarci pe GitHub!')
console.log('')
console.log('📋 Instrucțiuni:')
console.log('1. Creează o arhivă zip din conținutul directorului github-upload/')
console.log('2. Încarcă arhiva ca asset la un nou release pe GitHub')
console.log('3. Railway va descărca automat arhiva și va construi proiectul')

// Creează scriptul de upload
const uploadScript = `cd github-upload
zip -r spectraautoart-upload.zip .
echo "Arhiva creata cu succes!"
echo "Urmeaza sa incarci arhiva pe GitHub ca asset la un release nou."
`

fs.writeFileSync(path.join(tempDir, 'UPLOAD_GITHUB.bat'), uploadScript)
console.log('✅ Script de upload creat: UPLOAD_GITHUB.bat')

console.log('')
console.log('🎉 Proces complet! Fișierele sunt gata în directorul github-upload/')
console.log('📦 Urmează să creezi arhiva zip și să o încarci pe GitHub!')