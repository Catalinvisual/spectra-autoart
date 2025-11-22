import GoogleSheetsService from './src/services/googleSheetsService.js';

async function checkGoogleSheetsStatus() {
  console.log('🔍 Verificare stare Google Sheets...');
  
  try {
    const initialized = await GoogleSheetsService.initialize();
    
    if (initialized) {
      console.log('✅ Google Sheets service initialized successfully');
      console.log(`📊 Demo mode: ${GoogleSheetsService.isDemoMode}`);
      console.log(`📊 Initialized: ${GoogleSheetsService.isInitialized}`);
      
      if (!GoogleSheetsService.isDemoMode) {
        console.log('📊 Testing connection to Google Sheets...');
        const data = await GoogleSheetsService.getData('Testimonials');
        console.log(`📊 Found ${data.length} rows in Testimonials sheet`);
        console.log('📊 First few rows:', data.slice(0, 10));
    
    // Check for active testimonials
    const activeTestimonials = data.slice(1).filter(row => {
      const activeColumn = row[8]; // Active column (index 8)
      return activeColumn === 'true' || activeColumn === true;
    });
    console.log(`📊 Active testimonials: ${activeTestimonials.length}`);
    if (activeTestimonials.length > 0) {
      console.log('📊 Active testimonials:', activeTestimonials.slice(0, 3));
    }
      } else {
        console.log('⚠️  Running in demo mode - using local data');
        const demoData = GoogleSheetsService.getDemoData('Testimonials');
        console.log(`📊 Demo data: ${demoData.length} rows`);
        console.log('📊 Demo data sample:', demoData.slice(0, 3));
      }
    } else {
      console.log('❌ Google Sheets service failed to initialize');
    }
  } catch (error) {
    console.error('❌ Error checking Google Sheets status:', error.message);
  }
}

checkGoogleSheetsStatus();