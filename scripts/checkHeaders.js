// Simple test to check Google Sheets headers using server environment
import { execSync } from 'child_process'

// Set environment variables from server .env file
const envContent = execSync('cd c:\\Catalin\\Proiecte fullstack 2025\\spectraautoart\\server && type .env', { encoding: 'utf8' })
envContent.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, value] = line.split('=')
    if (key && value) {
      process.env[key.trim()] = value.trim()
    }
  }
})

console.log('Environment loaded. SPREADSHEET_ID:', process.env.SPREADSHEET_ID ? 'Set' : 'Not set')

// Now import GoogleSheetsService with proper environment
const GoogleSheetsService = await import('../server/src/services/googleSheetsService.js').then(m => m.default)

async function checkHeaders() {
  try {
    await GoogleSheetsService.initialize()
    const data = await GoogleSheetsService.getData('Vehicles')
    
    console.log('Raw data structure:')
    console.log('Total rows:', data.length)
    
    if (data.length > 0) {
      console.log('Headers (first row):', JSON.stringify(data[0]))
      console.log('First data row:', JSON.stringify(data[1]))
      
      // Check for our expected columns
      const headers = data[0]
      const columns = ['ID', 'Make', 'Model', 'Type', 'Body']
      columns.forEach(col => {
        const index = headers.indexOf(col)
        console.log(`${col}: index ${index}, value in row 2: ${index >= 0 ? data[1][index] : 'N/A'}`)
      })
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

checkHeaders()