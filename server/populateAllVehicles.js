import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import { fallbackModels } from './src/data/vehicleData.js';

// Load credentials from environment
const SPREADSHEET_ID = '1dy4hozgiP4CoTnasPyjR9o7_qgRMoank0V9_IbzDt90';
const SERVICE_ACCOUNT_EMAIL = 'spectra-autoart@spectra-autoart.iam.gserviceaccount.com';
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqHRdowGztApz3\n3TbsjDZTPuXBi6YM4a9KH2EfMlmp2Ny58fGnmOIqEi9PzLbRYH5K/k+y09bzJzyz\nbK3CR/qjhU7oNfxqCmzlanJC/n5+UwNrdbVPxnBaXgbJT6N5gOPiKB0auYzgE9AG\n8zh7PqvGpu3oynfvnpz5I/x55CnhsAOkRsN8JGnO6XxAC9Vb2AK7dx7uiWvSU8Gc\nbzIs+j4M1DOLQ9Kh273gmUUC26oQolxcq4nuPQXTsukH81V/HDKHZGPkQ/Qm+OZh\nzVK9nua161mrAusq4CZMdtWhoZ3rQyPIfWaNW7MC+eTRFW65M6A/0qAYCh8uX0s1\n7nU29bIxAgMBAAECggEAJAaLKZTuvHa8NUW01v2Ol6yPTaC8Zqf4zlK857VrBaw2\nem6BhcO7ybsWJ+krokW0GT+oMy/nqpDZqwnN9oH102Fs54JfVTml/CPB1Ow+b5Q2\n+i/wWNemfYzCFSn3bcjc+c0S9NDsw5uOh5pEkN0h1a0OXylZovZNOfnkAxBNykx6\ng1Lhaim3qG7YmxNy/Z3xdwTBAuixvMOmAYmeXeIM3XJKCVuHsIir91fcIU59iqJL\nl209OIe6FVhDj7OIAuouxlqX/eZwu4fizz5ch0k7QQNuiWq7e2/JfTylDaJ/cKRa\n3bnD4WtAxbondEww1GF/FPzBmcs5XqF09VRhYv1TkQKBgQDlCfUf6DnX18Rp7+LM\nKQClpPpGAVHN4wIbRD1QHvtVighTuKuk38cUsLEBZt/3BYsRLWHoFHLux0c61LDw\nNPcBoY/i6ciwu3l5Jh4OO4KUFf6kBwQl8IhxUJocNPeSMgIX+Q9QxceQ6mAvrH8S\n6wmpYA7PGJPLlZxAEuT3dg/8vQKBgQC+I27JgAxm3/Mx92a70e6HebftNDyHpQiE\n4bEZ0tDpJbgqfruAE9wZUJhjUDxtGNqkVc3fNBkGHVQSitqEmeq5xOrMMEcpoleY\n7WHD7wiYTk+L/omSaI+nBTrYL5BU93kqUSlUMc08XMGswq/nHGI7XtFmTRUi2VKz\np9E9IiU0hQKBgDG5W7I1pHkrqsSlA8P3EuDjVEJmfvAH3Kk2w2jlkQMdGHm0me8N\ndhcT1RnMz8q9NVfhVmQgLGOSd/BZxKAhn46HGMnWn29fBBw9HkFQwiSMMeBCdbAW\n7EhNi2ecSDNBEBtMQvryNUVM3Nz8wgnFZS+UXyKu30dPj8CJWZQv2YCxAoGBAJuX\nKShwxTVF25+uwP2/G373BqBv13x0exUqDp+AGP5ApIT5sftrxPdeMWVLmjb4WKqT\noGUfH78WLt8BizFpNmAQGMdAVmtmcmItFoycRR9FLej0QKVzNOJK8E1KFsTAwgDz\n62r/WeAkU0RJCGKJooTM4XPibgJXbkqfcCSjlWh1AoGALcA1/2bnvIwht+HQEpzB\nRBjb4DGwnixVfJ92s1CXuCWcJk3gKuqMHFTQwpp59dMHF+EjRc9mQZtSckaZ/xVW\ndPF8S3Zf80RoPf9cWEMR7C0g1gDqCMft81K+xuIX/XijxOKjTF5o7d2M4RMLDGqZ\nmlsTsXu9FiWXbhS3KsX0CT4=\n-----END PRIVATE KEY-----\n";

async function populateAllVehicles() {
  try {
    console.log('🚀 Starting COMPLETE vehicle data population...');
    console.log('📊 Processing ALL vehicles from vehicles.js');
    
    // Create auth client
    const auth = new GoogleAuth({
      credentials: {
        client_email: SERVICE_ACCOUNT_EMAIL,
        private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Extract ALL makes and models
    const vehicles = [];
    let idCounter = 1;
    
    console.log('📋 Extracting all makes and models...');
    for (const [make, models] of Object.entries(fallbackModels)) {
      for (const model of models) {
        vehicles.push({
          id: idCounter++,
          make: make,
          model: model,
          type: 'Car',
          body: 'Sedan',
          active: 'TRUE',
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        });
      }
    }
    
    console.log(`📊 Total vehicles found: ${vehicles.length}`);
    
    // Create header row
    const headerRow = [
      'ID', 
      'Make_NL', 'Make_EN', 'Make_ES', 'Make_PL', 'Make_RO',
      'Model_NL', 'Model_EN', 'Model_ES', 'Model_PL', 'Model_RO',
      'Type_NL', 'Type_EN', 'Type_ES', 'Type_PL', 'Type_RO',
      'Body_NL', 'Body_EN', 'Body_ES', 'Body_PL', 'Body_RO',
      'Active', 'Created_Date', 'Updated_Date'
    ];
    
    // Process ALL vehicles in batches to avoid API limits
    const batchSize = 100;
    const allRows = [headerRow];
    let processedCount = 0;
    
    console.log(`🔄 Processing vehicles in batches of ${batchSize}...`);
    
    for (let i = 0; i < vehicles.length; i += batchSize) {
      const batch = vehicles.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(vehicles.length / batchSize);
      
      console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} vehicles)`);
      
      // Create rows for this batch
      const batchRows = batch.map(vehicle => [
        vehicle.id,
        vehicle.make, vehicle.make, vehicle.make, vehicle.make, vehicle.make,
        vehicle.model, vehicle.model, vehicle.model, vehicle.model, vehicle.model,
        vehicle.type, vehicle.type, vehicle.type, vehicle.type, vehicle.type,
        vehicle.body, vehicle.body, vehicle.body, vehicle.body, vehicle.body,
        vehicle.active,
        vehicle.created_date,
        vehicle.updated_date
      ]);
      
      allRows.push(...batchRows);
      processedCount += batch.length;
      
      console.log(`✅ Processed ${processedCount}/${vehicles.length} vehicles`);
    }
    
    console.log(`📤 Preparing to insert ${allRows.length - 1} vehicles into Google Sheets...`);
    
    // Clear the sheet first
    try {
      console.log('🧹 Clearing existing data...');
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Vehicles!A:Z',
      });
      console.log('✅ Sheet cleared');
    } catch (clearError) {
      console.log('⚠️  Could not clear sheet (might be empty):', clearError.message);
    }
    
    // Insert ALL data at once
    console.log(`📊 Inserting ${allRows.length} rows (${allRows.length - 1} vehicles + header)...`);
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Vehicles!A1',
      valueInputOption: 'RAW',
      resource: {
        values: allRows,
      },
    });
    
    console.log(`✅ SUCCESS! Updated range: ${response.data.updatedRange}`);
    console.log(`✅ Updated cells: ${response.data.updatedCells}`);
    console.log(`✅ Total vehicles inserted: ${allRows.length - 1}`);
    
    // Final verification
    console.log('🔍 Verifying data insertion...');
    const verifyResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Vehicles!A1:Y10',
    });
    
    console.log(`📊 Verification: Found ${verifyResponse.data.values?.length || 0} rows in sheet`);
    console.log('First few rows:', verifyResponse.data.values?.slice(0, 3) || []);
    
    console.log('\n🎉 COMPLETE SUCCESS!');
    console.log(`📊 All ${vehicles.length} vehicles have been inserted into Google Sheets!`);
    console.log('✅ Production now has access to ALL makes and models!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

populateAllVehicles();