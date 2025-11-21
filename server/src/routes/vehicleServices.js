import express from 'express';
import { vehicleServicesService } from '../services/vehicleServicesService.js';
import { getActiveBodyTypes } from '../config/bodyTypesConfig.js';
import GoogleSheetsService from '../services/googleSheetsService.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/body-types - Obține toate tipurile de caroserie active
router.get('/body-types', async (req, res) => {
  try {
    const bodyTypes = getActiveBodyTypes();
    res.json({
      success: true,
      data: bodyTypes
    });
  } catch (error) {
    console.error('Error fetching body types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch body types'
    });
  }
});

// GET /api/services-with-prices - Obține servicii cu prețuri (pentru booking wizard)
router.get('/services-with-prices', async (req, res) => {
  try {
    const { include, bodyType, lang } = req.query;
    
    // Always use Google Sheets directly for real-time data (both production and development)
    try {
      console.log('📥 Fetching services with prices from Google Sheets...');
      console.log('📋 Query params:', { include, bodyType, lang });
      
      const services = await GoogleSheetsService.getServicesWithPrices();
      console.log(`✅ Found ${services.length} services from Google Sheets`);
      if (services.length > 0) {
        console.log(`📋 First service:`, JSON.stringify(services[0], null, 2));
      }
      
      // Filter by body type if requested
      if (bodyType) {
        console.log(`🔍 Filtering by body type: ${bodyType}`);
        const filteredServices = services.filter(service => {
          const hasMatchingPrice = service.prices && service.prices.some(price => {
            console.log(`🔍 Checking service ${service.id} price body_type_key: ${price.body_type_key} vs ${bodyType}`);
            return price.body_type_key === bodyType;
          });
          console.log(`🔍 Service ${service.id} has matching price: ${hasMatchingPrice}`);
          return hasMatchingPrice;
        }).map(service => {
          const filteredPrices = service.prices.filter(price => {
            console.log(`🔍 Filtering price ${price.id}: ${price.body_type_key} === ${bodyType} = ${price.body_type_key === bodyType}`);
            return price.body_type_key === bodyType;
          });
          console.log(`🔍 Service ${service.id} filtered prices count: ${filteredPrices.length}`);
          return {
            ...service,
            prices: filteredPrices
          };
        });
        console.log(`🔍 Filtered ${filteredServices.length} services for body type ${bodyType}`);
        console.log(`🔍 First filtered service prices count: ${filteredServices[0]?.prices?.length || 0}`);
        return res.json({
          success: true,
          data: filteredServices
        });
      }
      
      console.log(`📤 Returning ${services.length} services`);
      return res.json({
        success: true,
        data: services
      });
    } catch (sheetsError) {
      console.error('❌ Failed to fetch from Google Sheets, falling back to local service:', sheetsError);
      console.error('❌ Error details:', sheetsError.message);
      console.error('❌ Error stack:', sheetsError.stack);
      // Fall back to local service if Google Sheets fails
    }
    
    // Original implementation for development or fallback
    // Dacă se cere filtrare după tipul de caroserie
    if (bodyType) {
      const services = vehicleServicesService.getServicesByBodyType(bodyType);
      res.json({
        success: true,
        data: services
      });
      return;
    }

    // Dacă se include parametrul lang (frontend compatibility)
    // Returnăm toate serviciile cu prețuri
    if (lang) {
      const services = vehicleServicesService.getServicesWithPrices();
      res.json({
        success: true,
        data: services
      });
      return;
    }

    // Dacă se includ prețurile
    if (include === 'prices') {
      const services = vehicleServicesService.getServicesWithPrices();
      res.json({
        success: true,
        data: services
      });
      return;
    }

    // Servicii de bază fără prețuri
    const services = vehicleServicesService.getServicesWithPrices().map(service => {
      const { prices, ...serviceWithoutPrices } = service;
      return serviceWithoutPrices;
    });

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services'
    });
  }
});

// GET /api/services/:slug - Obține detalii pentru un serviciu specific
router.get('/services/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const service = vehicleServicesService.getServiceBySlug(slug);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service details'
    });
  }
});

// POST /api/services/initialize - Inițializează datele demo (doar pentru development)
router.post('/services/initialize', async (req, res) => {
  try {
    // Verifică dacă suntem în modul development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'This endpoint is only available in development mode'
      });
    }

    const result = await vehicleServicesService.initializeDemoData();
    
    // Salvează în Google Sheets dacă este disponibil
    const syncSuccess = await vehicleServicesService.syncWithGoogleSheets();

    res.json({
      success: true,
      data: result,
      synced: syncSuccess
    });
  } catch (error) {
    console.error('Error initializing services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize services'
    });
  }
});

// POST /api/vehicle-services - Adaugă un serviciu nou cu prețuri pentru toate tipurile de caroserie
router.post('/vehicle-services', auth, async (req, res) => {
  try {
    const { name, description, category, duration_minutes, default_prices } = req.body;
    
    // Validare date de intrare
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Service name is required'
      });
    }
    
    // Creează serviciul cu prețuri
    const result = await vehicleServicesService.addServiceWithPrices({
      name,
      description,
      category,
      duration_minutes
    }, default_prices || {});

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add service'
    });
  }
});

export default router;