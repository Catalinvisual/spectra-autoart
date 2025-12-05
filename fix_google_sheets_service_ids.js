// Simple script to fix Service_ID mismatch
// This will update all prices to use the correct service ID

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function fixServiceIds() {
  try {
    console.log('🔧 Fixing Service_ID mismatch in Google Sheets...');
    
    // Load credentials from environment
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    
    // Create JWT client
    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // Load the spreadsheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    console.log(`📊 Loaded spreadsheet: ${doc.title}`);
    
    // Get the prices sheet
    const pricesSheet = doc.sheetsByTitle['Vehicle_Service_Prices'];
    if (!pricesSheet) {
      console.log('❌ Vehicle_Service_Prices sheet not found');
      return;
    }
    
    console.log(`💰 Found prices sheet: ${pricesSheet.title}`);
    
    // Get the services sheet
    const servicesSheet = doc.sheetsByTitle['Vehicle_Services'];
    if (!servicesSheet) {
      console.log('❌ Vehicle_Services sheet not found');
      return;
    }
    
    console.log(`📋 Found services sheet: ${servicesSheet.title}`);
    
    // Get services data to find the correct service ID
    const servicesRows = await servicesSheet.getRows();
    let targetServiceId = null;
    
    console.log('\n📋 Available Services:');
    for (const row of servicesRows) {
      const id = row.ID;
      const name = row.Name_EN;
      const isActive = row.Is_Active;
      
      console.log(`Service: ID="${id}", Name="${name}", Is_Active="${isActive}"`);
      
      if (isActive === 'true' || isActive === true) {
        if (!targetServiceId) {
          targetServiceId = id;
          console.log(`✅ Will use this service ID for prices: ${targetServiceId}`);
        }
      }
    }
    
    if (!targetServiceId) {
      console.log('❌ No active services found');
      return;
    }
    
    // Get prices data
    const pricesRows = await pricesSheet.getRows();
    console.log(`\n💰 Found ${pricesRows.length} prices`);
    
    let updatedCount = 0;
    
    for (const row of pricesRows) {
      const currentServiceId = row.Service_ID;
      const priceId = row.ID;
      const isActive = row.Is_Active;
      
      // Only update active prices with wrong service ID
      if ((isActive === 'true' || isActive === true) && currentServiceId !== targetServiceId) {
        console.log(`Updating price ${priceId}: Service_ID "${currentServiceId}" → "${targetServiceId}"`);
        
        row.Service_ID = targetServiceId;
        await row.save();
        updatedCount++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`\n✅ Updated ${updatedCount} prices with correct Service_ID`);
    console.log('🔄 The service editing functionality should now work correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the fix
fixServiceIds();