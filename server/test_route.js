// Adaugă această rută de test în server/src/routes/admin.js
// După celelalte rute existente

// Route pentru testarea structurii Google Sheets
router.get('/test-sheets-structure', requireAuth, async (req, res) => {
  try {
    console.log('📊 Testing Google Sheets structure...');
    
    // Test Vehicle_Services sheet
    console.log('\n📋 Vehicle_Services sheet:');
    const servicesData = await GoogleSheetsService.getData('Vehicle_Services');
    if (servicesData.length > 0) {
      console.log('Headers:', servicesData[0]);
      console.log('First row:', servicesData[1] || 'No data');
      console.log('Total rows:', servicesData.length - 1);
    } else {
      console.log('No data in Vehicle_Services');
    }
    
    // Test Vehicle_Service_Prices sheet
    console.log('\n💰 Vehicle_Service_Prices sheet:');
    const pricesData = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    if (pricesData.length > 0) {
      console.log('Headers:', pricesData[0]);
      console.log('First row:', pricesData[1] || 'No data');
      console.log('Total rows:', pricesData.length - 1);
    } else {
      console.log('No data in Vehicle_Service_Prices');
    }
    
    // Test getServicesWithPrices
    console.log('\n🚗 Testing getServicesWithPrices...');
    const servicesWithPrices = await GoogleSheetsService.getServicesWithPrices();
    console.log(`Found ${servicesWithPrices.length} services`);
    if (servicesWithPrices.length > 0) {
      console.log('First service:', JSON.stringify(servicesWithPrices[0], null, 2));
    }

    res.json({
      success: true,
      message: 'Sheets structure tested successfully',
      data: {
        servicesCount: servicesData.length - 1,
        servicesHeaders: servicesData[0] || [],
        pricesCount: pricesData.length - 1,
        pricesHeaders: pricesData[0] || [],
        servicesWithPricesCount: servicesWithPrices.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error testing sheets structure:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to test sheets structure',
      details: error.message 
    });
  }
});