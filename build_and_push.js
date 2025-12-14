const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Încep procesul de build și push...')

try {
  // 1. Build client React
  console.log('📦 Build client React...')
  process.chdir(path.join(__dirname, 'client'))
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Client buildat cu succes!')
  
  // 2. Verificăm dacă directorul dist există
  const distPath = path.join(__dirname, 'client', 'dist')
  if (!fs.existsSync(distPath)) {
    throw new Error('❌ Directorul dist nu a fost creat!')
  }
  console.log('✅ Director dist confirmat:', distPath)
  
  // 3. Întoarcem la directorul rădăcină
  process.chdir(__dirname)
  
  // 4. Adăugăm fișierele în git (inclusiv cele noi)
  console.log('📋 Adaug fișierele în git...')
  execSync('git add -A', { stdio: 'inherit' })
  
  // 5. Commit
  console.log('💾 Fac commit...')
  execSync('git commit -m "Build client și pregătire pentru producție - fix Not Found"', { stdio: 'inherit' })
  
  // 6. Push
  console.log('📤 Push la GitHub...')
  execSync('git push origin main', { stdio: 'inherit' })
  
  console.log('🎉 SUCCESS! Proiectul a fost buildat și împins în GitHub!')
  console.log('🌐 Acum spectraautoart.nl ar trebui să afișeze aplicația React corect.')
  
} catch (error) {
  console.error('❌ Eroare în timpul procesului:', error.message)
  process.exit(1)
}