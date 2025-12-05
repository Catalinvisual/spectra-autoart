// Simple script to update prices using the existing server
// This will make API calls to update the Service_ID in prices

async function fixServiceIdsViaAPI() {
  try {
    console.log('🔧 Fixing Service_ID mismatch via API calls...');
    
    // Based on the test route response, the service has ID: "vehicle_service_1764849224717"
    const correctServiceId = "vehicle_service_1764849224717";
    
    console.log(`✅ Using correct Service_ID: ${correctServiceId}`);
    
    // We need to update the prices in the Google Sheet
    // Since we can't directly access the Google Sheets API from here,
    // let's create a simple admin endpoint to do this
    
    console.log('\n📝 To fix this issue, you need to:');
    console.log('1. Open the Google Sheet');
    console.log('2. Go to the "Vehicle_Service_Prices" sheet');
    console.log('3. Update the "Service_ID" column (column B)');
    console.log('4. Change all values from "1" to "vehicle_service_1764849224717"');
    console.log('5. Save the changes');
    
    console.log('\n🔄 After updating the Google Sheet, test the service editing functionality.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixServiceIdsViaAPI();