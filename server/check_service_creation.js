import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configure database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'spectra_autoart',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

async function checkService(serviceId) {
  try {
    console.log(`🔍 Checking service with ID: ${serviceId}`);
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Check if service exists
    const [services] = await sequelize.query(
      'SELECT * FROM "Vehicle_Services" WHERE id = :serviceId',
      { replacements: { serviceId: serviceId }, type: Sequelize.QueryTypes.SELECT }
    );
    
    if (services.length === 0) {
      console.log('❌ Service not found in database');
      return;
    }
    
    const service = services[0];
    console.log('✅ Service found:');
    console.log(`   ID: ${service.id}`);
    console.log(`   Name: ${service.name}`);
    console.log(`   Slug: ${service.slug}`);
    console.log(`   Category: ${service.category}`);
    console.log(`   Duration: ${service.duration_minutes} minutes`);
    console.log(`   Active: ${service.is_active}`);
    
    // Check service prices
    const [prices] = await sequelize.query(
      'SELECT * FROM "Service_Prices" WHERE service_id = :serviceId ORDER BY body_type_id',
      { replacements: { serviceId: serviceId }, type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log(`\n💰 Found ${prices.length} prices for this service:`);
    prices.forEach(price => {
      console.log(`   Body Type ID: ${price.body_type_id}, Price: €${price.price_min}${price.price_max ? '-' + price.price_max : ''}, Duration: ${price.duration_minutes}min`);
    });
    
    // Check body types
    const [bodyTypes] = await sequelize.query(
      'SELECT bt.id, bt.key, bt.name FROM "Body_Types" bt ORDER BY bt.id',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log(`\n🚗 Available body types in database:`);
    bodyTypes.forEach(bt => {
      console.log(`   ID: ${bt.id}, Key: ${bt.key}, Name: ${bt.name}`);
    });
    
    // Check which body types have prices
    const bodyTypesWithPrices = prices.map(p => p.body_type_id);
    const missingBodyTypes = bodyTypes.filter(bt => !bodyTypesWithPrices.includes(bt.id));
    
    if (missingBodyTypes.length > 0) {
      console.log(`\n⚠️  Missing prices for body types:`);
      missingBodyTypes.forEach(bt => {
        console.log(`   ID: ${bt.id}, Key: ${bt.key}, Name: ${bt.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await sequelize.close();
  }
}

// Get service ID from command line
const serviceId = process.argv[2];
if (!serviceId) {
  console.log('Usage: node check_service_creation.js <service_id>');
  process.exit(1);
}

checkService(serviceId);