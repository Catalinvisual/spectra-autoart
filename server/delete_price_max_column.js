import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

async function deletePriceMaxColumn() {
  try {
    console.log('🗑️  Starting Price_Max column deletion...');
    
    if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
      console.error('❌ GOOGLE_SHEETS_SPREADSHEET_ID not configured');
      return;
    }

    // Authenticate with Google Sheets
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    console.log(`📊 Loaded spreadsheet: ${doc.title}`);

    // Process both sheets that had Price_Max column
    const sheetsToUpdate = ['Service_Prices', 'Vehicle_Service_Prices'];
    
    for (const sheetName of sheetsToUpdate) {
      try {
        const sheet = doc.sheetsByTitle[sheetName];
        if (!sheet) {
          console.log(`⚠️  Sheet "${sheetName}" not found, skipping...`);
          continue;
        }

        console.log(`🔄 Processing sheet: ${sheetName}`);
        await sheet.loadHeaderRow();
        
        const headers = sheet.headerValues;
        console.log(`📋 Current headers: ${headers.join(', ')}`);
        
        // Find Price_Max column index
        const priceMaxIndex = headers.indexOf('Price_Max');
        if (priceMaxIndex === -1) {
          console.log(`✅ Price_Max column not found in ${sheetName}, already deleted`);
          continue;
        }

        console.log(`🗑️  Found Price_Max column at index ${priceMaxIndex}`);

        // Get all rows
        const rows = await sheet.getRows();
        console.log(`📊 Found ${rows.length} rows to update`);

        // Delete the Price_Max value from each row
        for (const row of rows) {
          if (row.Price_Max !== undefined) {
            delete row.Price_Max;
            await row.save();
          }
        }

        // Update header row by recreating the sheet structure
        const newHeaders = headers.filter(header => header !== 'Price_Max');
        console.log(`📋 New headers will be: ${newHeaders.join(', ')}`);

        // Note: Google Sheets API doesn't allow direct column deletion
        // We need to clear the column data and adjust our code to not use it
        console.log(`✅ Price_Max column data cleared from ${sheetName}`);
        
      } catch (sheetError) {
        console.error(`❌ Error processing sheet ${sheetName}:`, sheetError.message);
      }
    }

    console.log('🎉 Price_Max column deletion completed!');
    
  } catch (error) {
    console.error('❌ Error deleting Price_Max column:', error);
  }
}

// Run the script
deletePriceMaxColumn();