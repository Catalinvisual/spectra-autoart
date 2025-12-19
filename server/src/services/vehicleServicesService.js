import GoogleSheetsService from './googleSheetsService.js';
import { BODY_TYPES, getActiveBodyTypes } from '../config/bodyTypesConfig.js';
import { translateMultipleWithDeepL, detectLanguageWithDeepL } from './deeplTranslationService.js';

class VehicleServicesService {
  constructor() {
    this.services = [];
    this.servicePrices = [];
    try {
      this.bodyTypes = getActiveBodyTypes();
      console.log('✅ VehicleServicesService constructor - bodyTypes loaded:', this.bodyTypes?.length || 0);
      if (!this.bodyTypes || this.bodyTypes.length === 0) {
        console.warn('⚠️  No active body types found, using fallback');
        this.bodyTypes = BODY_TYPES.filter(bt => bt.is_active);
      }
    } catch (error) {
      console.error('❌ Error loading body types in constructor:', error);
      this.bodyTypes = BODY_TYPES.filter(bt => bt.is_active);
    }
  }

  // Map frontend string keys to body type objects
  mapFrontendKeyToBodyType(frontendKey) {
    // Common frontend key mappings - accept both English and Dutch terms
    const keyMappings = {
      'sedan': 'berlina',      // English sedan -> Dutch berlina
      'berlina': 'berlina',     // Dutch berlina
      'suv': 'suv',
      'hatchback': 'hatchback',
      'break': 'break',
      'wagon': 'break',         // English wagon -> Dutch break
      'coupe': 'coupe',
      'cabrio': 'cabrio',
      'van': 'van',
      'estate': 'break'        // English estate -> Dutch break
    };

    const mappedKey = keyMappings[frontendKey.toLowerCase()];
    if (!mappedKey) {
      console.warn(`⚠️  No mapping found for frontend key: ${frontendKey}`);
      return null;
    }

    const bodyType = this.bodyTypes.find(bt => bt.key === mappedKey);
    if (!bodyType) {
      console.warn(`⚠️  No body type found for mapped key: ${mappedKey}`);
      return null;
    }

    return bodyType;
  }

  // Inițializează datele din Google Sheets (fără date demo)
  async initializeDemoData() {
    // Încarcă doar din Google Sheets, fără date demo
    const loadedFromSheets = await this.loadFromGoogleSheets();
    if (loadedFromSheets) {
      console.log('✅ Using data from Google Sheets');
      return {
        services: this.services.length,
        prices: this.servicePrices.length,
        source: 'google_sheets'
      };
    }
    
    // Dacă Google Sheets este gol, nu folosi date demo
    console.log('⚠️  No data found in Google Sheets, initializing empty arrays');
    this.services = [];
    this.servicePrices = [];
    
    // Premium Wash - prețuri diferite în funcție de caroserie
    const premiumWashPrices = {
      'suv': { price_min: 35, duration_minutes: 45 },
      'berlina': { price_min: 25, duration_minutes: 40 },
      'break': { price_min: 30, duration_minutes: 45 },
      'hatchback': { price_min: 20, duration_minutes: 35 },
      'coupe': { price_min: 25, duration_minutes: 40 },
      'cabrio': { price_min: 25, duration_minutes: 40 },
      'van': { price_min: 40, duration_minutes: 50 }
    };

    // Interior Detail - prețuri
    const interiorDetailPrices = {
      'suv': { price_min: 120, price_max: 150, duration_minutes: 150 },
      'berlina': { price_min: 100, price_max: 130, duration_minutes: 120 },
      'break': { price_min: 110, price_max: 140, duration_minutes: 135 },
      'hatchback': { price_min: 90, price_max: 120, duration_minutes: 105 },
      'coupe': { price_min: 95, price_max: 125, duration_minutes: 110 },
      'cabrio': { price_min: 85, price_max: 115, duration_minutes: 100 },
      'van': { price_min: 140, price_max: 170, duration_minutes: 165 }
    };

    // Engine Detailing - prețuri
    const engineDetailPrices = {
      'suv': { price_min: 80, price_max: 100, duration_minutes: 70 },
      'berlina': { price_min: 60, price_max: 80, duration_minutes: 60 },
      'break': { price_min: 70, price_max: 90, duration_minutes: 65 },
      'hatchback': { price_min: 50, price_max: 70, duration_minutes: 55 },
      'coupe': { price_min: 70, price_max: 90, duration_minutes: 65 },
      'cabrio': { price_min: 55, price_max: 75, duration_minutes: 60 },
      'van': { price_min: 90, price_max: 110, duration_minutes: 75 }
    };

    // Ceramic Coating - prețuri premium
    const ceramicCoatingPrices = {
      'suv': { price_min: 500, price_max: 600, duration_minutes: 300 },
      'berlina': { price_min: 400, price_max: 500, duration_minutes: 240 },
      'break': { price_min: 450, price_max: 550, duration_minutes: 270 },
      'hatchback': { price_min: 350, price_max: 450, duration_minutes: 210 },
      'coupe': { price_min: 380, price_max: 480, duration_minutes: 225 },
      'cabrio': { price_min: 320, price_max: 420, duration_minutes: 195 },
      'van': { price_min: 550, price_max: 650, duration_minutes: 330 }
    };

    // Headlight Restoration - prețuri
    const headlightPrices = {
      'suv': { price_min: 90, price_max: 110, duration_minutes: 100 },
      'berlina': { price_min: 80, price_max: 100, duration_minutes: 90 },
      'break': { price_min: 85, price_max: 105, duration_minutes: 95 },
      'hatchback': { price_min: 75, price_max: 95, duration_minutes: 85 },
      'coupe': { price_min: 85, price_max: 105, duration_minutes: 95 },
      'cabrio': { price_min: 80, price_max: 100, duration_minutes: 90 },
      'van': { price_min: 95, price_max: 115, duration_minutes: 105 }
    };

    // Generează prețuri pentru toate serviciile
    let priceId = 1;
    
    // Premium Wash
    Object.entries(premiumWashPrices).forEach(([bodyTypeKey, priceData]) => {
      this.servicePrices.push({
        id: priceId++,
        service_id: 1,
        body_type_id: this.bodyTypes.find(bt => bt.key === bodyTypeKey)?.id,
        price_min: priceData.price_min,
        price_max: priceData.price_max,
        currency: 'EUR',
        duration_minutes: priceData.duration_minutes,
        promo_percent: 0,
        is_active: true
      });
    });

    // Interior Detail
    Object.entries(interiorDetailPrices).forEach(([bodyTypeKey, priceData]) => {
      this.servicePrices.push({
        id: priceId++,
        service_id: 2,
        body_type_id: this.bodyTypes.find(bt => bt.key === bodyTypeKey)?.id,
        price_min: priceData.price_min,
        price_max: priceData.price_max,
        currency: 'EUR',
        duration_minutes: priceData.duration_minutes,
        promo_percent: 0,
        is_active: true
      });
    });

    // Engine Detailing
    Object.entries(engineDetailPrices).forEach(([bodyTypeKey, priceData]) => {
      this.servicePrices.push({
        id: priceId++,
        service_id: 3,
        body_type_id: this.bodyTypes.find(bt => bt.key === bodyTypeKey)?.id,
        price_min: priceData.price_min,
        price_max: priceData.price_max,
        currency: 'EUR',
        duration_minutes: priceData.duration_minutes,
        promo_percent: 0,
        is_active: true
      });
    });

    // Ceramic Coating
    Object.entries(ceramicCoatingPrices).forEach(([bodyTypeKey, priceData]) => {
      this.servicePrices.push({
        id: priceId++,
        service_id: 4,
        body_type_id: this.bodyTypes.find(bt => bt.key === bodyTypeKey)?.id,
        price_min: priceData.price_min,
        price_max: priceData.price_max,
        currency: 'EUR',
        duration_minutes: priceData.duration_minutes,
        promo_percent: 0,
        is_active: true
      });
    });

    // Headlight Restoration
    Object.entries(headlightPrices).forEach(([bodyTypeKey, priceData]) => {
      this.servicePrices.push({
        id: priceId++,
        service_id: 5,
        body_type_id: this.bodyTypes.find(bt => bt.key === bodyTypeKey)?.id,
        price_min: priceData.price_min,
        price_max: priceData.price_max,
        currency: 'EUR',
        duration_minutes: priceData.duration_minutes,
        promo_percent: 0,
        is_active: true
      });
    });

    return { services: this.services, servicePrices: this.servicePrices };
  }

  // Obține toate tipurile de caroserie active
  getBodyTypes() {
    return this.bodyTypes;
  }

  // Obține toate serviciile cu prețurile lor
  getServicesWithPrices(includeInactive = false) {
    return this.services
      .filter(service => includeInactive || service.is_active)
      .map(service => {
        const prices = this.servicePrices
          .filter(price => price.service_id === service.id && (includeInactive || price.is_active))
          .map(price => {
            const bodyType = this.bodyTypes.find(bt => bt.id === price.body_type_id);
            console.log(`DEBUG: Price ID ${price.id}, body_type_id ${price.body_type_id}, found bodyType:`, bodyType);
            return {
              id: price.id,
              bodyTypeKey: bodyType?.key,
              bodyTypeName: bodyType?.name,
              price_min: price.price_min,
              price_max: price.price_max,
              currency: price.currency,
              duration_minutes: price.duration_minutes,
              promo_percent: price.promo_percent,
              is_active: price.is_active
            };
          });

        return {
          ...service,
          prices
        };
      });
  }

  // Obține servicii filtrate după tipul de caroserie
  getServicesByBodyType(bodyTypeKey) {
    const bodyType = this.bodyTypes.find(bt => bt.key === bodyTypeKey);
    if (!bodyType) {
      return [];
    }

    return this.services
      .filter(service => service.is_active)
      .map(service => {
        const price = this.servicePrices.find(
          price => price.service_id === service.id && 
                   price.body_type_id === bodyType.id && 
                   price.is_active
        );

        if (!price) {
          return null;
        }

        return {
          ...service,
          prices: [{
            id: price.id,
            service_id: service.id,
            body_type_key: bodyType.key,
            price_min: price.price_min,
            price_max: price.price_max,
            currency: price.currency,
            duration_minutes: price.duration_minutes,
            promo_percent: price.promo_percent,
            is_active: price.is_active
          }]
        };
      })
      .filter(service => service !== null);
  }

  // Obține un serviciu specific cu toate prețurile sale
  getServiceBySlug(slug) {
    const service = this.services.find(s => s.slug === slug && s.is_active);
    if (!service) {
      return null;
    }

    const prices = this.servicePrices
      .filter(price => price.service_id === service.id && price.is_active)
      .map(price => {
        const bodyType = this.bodyTypes.find(bt => bt.id === price.body_type_id);
        return {
          id: price.id,
          bodyTypeKey: bodyType?.key,
          bodyTypeName: bodyType?.name,
          price_min: price.price_min,
          price_max: price.price_max,
          currency: price.currency,
          duration_minutes: price.duration_minutes,
          promo_percent: price.promo_percent,
          is_active: price.is_active
        };
      });

    return {
      ...service,
      prices
    };
  }

  // Calculează prețul minim pentru un serviciu
  getMinPriceForService(serviceId) {
    const prices = this.servicePrices
      .filter(price => price.service_id === serviceId && price.is_active)
      .map(price => price.price_min);
    
    return prices.length > 0 ? Math.min(...prices) : null;
  }

  // Adaugă un serviciu nou cu prețuri pentru toate tipurile de caroserie
  async addServiceWithPrices(serviceData, defaultPrices = {}) {
    try {
      // Generează ID unic bazat pe timestamp pentru servicii noi
      const timestamp = Date.now();
      const newServiceId = Math.floor(timestamp / 10000) + 1000; // Reducem la secunde și adăugăm offset pentru a evita numere prea mari
      
      // Creează slug din nume
      const slug = this.createSlug(serviceData.name);
      
      // Verifică dacă există deja un serviciu cu același slug
      const existingService = this.services.find(s => s.slug === slug);
      if (existingService) {
        throw new Error(`Service with slug '${slug}' already exists`);
      }
      
      const hasProvidedTranslations = (
        serviceData.name_nl || serviceData.name_en || serviceData.name_es || serviceData.name_pl || serviceData.name_ro ||
        serviceData.description_nl || serviceData.description_en || serviceData.description_es || serviceData.description_pl || serviceData.description_ro
      );
      const targetLanguages = ['NL', 'EN', 'ES', 'PL', 'RO'];
      const nameTranslations = {};
      const descTranslations = {};

      if (hasProvidedTranslations) {
        nameTranslations['NL'] = serviceData.name_nl || serviceData.name;
        nameTranslations['EN'] = serviceData.name_en || serviceData.name;
        nameTranslations['ES'] = serviceData.name_es || serviceData.name;
        nameTranslations['PL'] = serviceData.name_pl || serviceData.name;
        nameTranslations['RO'] = serviceData.name_ro || serviceData.name;

        descTranslations['NL'] = serviceData.description_nl || serviceData.description || '';
        descTranslations['EN'] = serviceData.description_en || serviceData.description || '';
        descTranslations['ES'] = serviceData.description_es || serviceData.description || '';
        descTranslations['PL'] = serviceData.description_pl || serviceData.description || '';
        descTranslations['RO'] = serviceData.description_ro || serviceData.description || '';
      } else {
        let detectedNameLang = 'EN';
        let detectedDescLang = 'EN';
        try {
          detectedNameLang = await detectLanguageWithDeepL(serviceData.name);
          detectedDescLang = serviceData.description ? await detectLanguageWithDeepL(serviceData.description) : 'EN';
        } catch (error) {
          detectedNameLang = 'EN';
          detectedDescLang = 'EN';
        }
        try {
          const nameTranslationsResult = await translateMultipleWithDeepL(serviceData.name, targetLanguages, detectedNameLang);
          targetLanguages.forEach(lang => {
            nameTranslations[lang] = nameTranslationsResult[lang] || serviceData.name;
          });
        } catch (error) {
          targetLanguages.forEach(lang => { nameTranslations[lang] = serviceData.name; });
        }
        if (serviceData.description) {
          try {
            const descTranslationsResult = await translateMultipleWithDeepL(serviceData.description, targetLanguages, detectedDescLang);
            targetLanguages.forEach(lang => {
              descTranslations[lang] = descTranslationsResult[lang] || serviceData.description;
            });
          } catch (error) {
            targetLanguages.forEach(lang => { descTranslations[lang] = serviceData.description; });
          }
        } else {
          targetLanguages.forEach(lang => { descTranslations[lang] = ''; });
        }
      }
      
      // Creează serviciul nou cu traduceri
      const newService = {
        id: newServiceId,
        slug: slug,
        name: serviceData.name,
        name_nl: nameTranslations['NL'] || serviceData.name,
        name_en: nameTranslations['EN'] || serviceData.name,
        name_es: nameTranslations['ES'] || serviceData.name,
        name_pl: nameTranslations['PL'] || serviceData.name,
        name_ro: nameTranslations['RO'] || serviceData.name,
        description: serviceData.description || '',
        description_nl: descTranslations['NL'] || serviceData.description || '',
        description_en: descTranslations['EN'] || serviceData.description || '',
        description_es: descTranslations['ES'] || serviceData.description || '',
        description_pl: descTranslations['PL'] || serviceData.description || '',
        description_ro: descTranslations['RO'] || serviceData.description || '',
        category: serviceData.category || 'general',
        image_url: serviceData.image_url || '/images/services/default.jpg',
        duration_minutes: serviceData.duration_minutes || 60,
        is_active: serviceData.is_active !== undefined ? serviceData.is_active : true
      };
      
      // Adaugă serviciul în array
      this.services.push(newService);
      
      // Creează prețuri pentru fiecare tip de caroserie activă
      const activeBodyTypes = this.bodyTypes.filter(bt => bt.is_active);
      const newPrices = [];
      
      console.log('🔍 Processing default_prices:', JSON.stringify(defaultPrices, null, 2));
      console.log('📋 Available body types:', activeBodyTypes.map(bt => ({id: bt.id, key: bt.key})));
      console.log(`🆔 newServiceId before loop: ${newServiceId}, type: ${typeof newServiceId}`); // Log suplimentar
      
      // Găsește prețul pentru fiecare tip de caroserie activă
      // Pentru fiecare body type, caută în prețurile furnizate unul care se potrivește
      console.log('🔍 Processing prices for each body type...');
      
      // Procesează fiecare tip de caroserie activă
      for (let index = 0; index < activeBodyTypes.length; index++) {
        const bodyType = activeBodyTypes[index];
        let providedPrice = null;
        let frontendKeyUsed = null;
        
        // Caută prețul pentru acest body type în prețurile furnizate
        for (const [frontendKey, priceData] of Object.entries(defaultPrices)) {
          const mappedBodyType = this.mapFrontendKeyToBodyType(frontendKey);
          if (mappedBodyType && mappedBodyType.key === bodyType.key) {
            providedPrice = priceData;
            frontendKeyUsed = frontendKey;
            break; // Găsit, nu mai căuta
          }
        }
        
        console.log(`🔍 BodyType ${bodyType.key} (ID: ${bodyType.id}): providedPrice=${providedPrice}, frontendKeyUsed=${frontendKeyUsed}`);
        console.log(`🔍 newServiceId value: ${newServiceId}, type: ${typeof newServiceId}`); // Log pentru debug
        
        let priceData;
        if (providedPrice !== null && providedPrice !== undefined) {
          // Folosește strict prețurile furnizate din frontend
          if (typeof providedPrice === 'object') {
            const hasValidMin = providedPrice.price_min !== undefined && providedPrice.price_min !== null && providedPrice.price_min !== ''
            if (!hasValidMin) {
              console.log(`⏭️  Skipping ${bodyType.key} - missing price_min in provided object`)
              continue
            }
            priceData = {
              price_min: providedPrice.price_min,
              price_max: providedPrice.price_max !== undefined ? providedPrice.price_max : null,
              duration_minutes: providedPrice.duration_minutes || serviceData.duration_minutes || 60
            };
          } else if (typeof providedPrice === 'number') {
            // Dacă este doar un număr (preț simplu)
            priceData = {
              price_min: providedPrice,
              price_max: null,
              duration_minutes: serviceData.duration_minutes || 60
            };
          } else {
            console.log(`⏭️  Skipping ${bodyType.key} - unsupported price format`)
            continue
          }
        } else {
          // Nu mai folosi default 50; sărim tipurile fără preț explicit
          console.log(`⏭️  Skipping ${bodyType.key} - no price provided`)
          continue
        }
        
        const newPrice = {
          id: newServiceId * 100 + index, // ID unic bazat pe service ID + index
          service_id: Number(newServiceId), // Convertim la număr pentru a evita NaN
          body_type_id: bodyType.id,
          body_type_key: bodyType.key, // Stochează string key pentru consistență
          price_min: priceData.price_min,
          price_max: priceData.price_max,
          currency: 'EUR',
          duration_minutes: priceData.duration_minutes,
          promo_percent: 0,
          is_active: true
        };
        
        this.servicePrices.push(newPrice);
        newPrices.push(newPrice);
      }
      
      // Sincronizează doar noul serviciu și prețurile cu Google Sheets (operațiune rapidă)
      console.log(`🔄 Syncing new service to Google Sheets...`);
      
      GoogleSheetsService.updateServices([newService])
        .then(() => { console.log(`✅ Successfully synced new service to Google Sheets`); })
        .catch(syncError => { console.warn(`⚠️  Failed to sync to Google Sheets immediately:`, syncError.message); });
      GoogleSheetsService.updateServicePrices(newPrices)
        .catch(syncError => { console.warn(`⚠️  Failed to sync prices to Google Sheets:`, syncError.message); });
      
      // Returnăm direct rezultatul fără să reîncărcăm toate datele
      console.log(`✅ Service created successfully with local ID: ${newServiceId}`);
      
      // Asigură-te că serviciul are ID-ul corect înainte de returnare
      newService.id = newServiceId;
      
      return {
        service: newService,
        prices: newPrices
      };
      
      console.log(`✅ Added service "${newService.name}" with ${newPrices.length} price entries`);
      console.log(`📊 Price data used:`, defaultPrices);
      console.log(`🆔 Service ID: ${newServiceId}`);
      console.log(`🔍 Service object before return:`, JSON.stringify(newService, null, 2)); // Log suplimentar
      console.log(`💰 Prices before return:`, JSON.stringify(newPrices.slice(0, 2), null, 2)); // Log suplimentar pentru primele 2 prețuri
      
      return {
        service: newService,
        prices: newPrices
      };
    } catch (error) {
      console.error('❌ Error adding service with prices:', error);
      throw error;
    }
  }

  // Creează slug din nume
  createSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Încarcă datele din Google Sheets
  async loadFromGoogleSheets() {
    try {
      console.log('📥 Loading vehicle services from Google Sheets...');
      
      // Load services from Google Sheets with force reload
      const sheetsServices = await GoogleSheetsService.getServicesWithPrices('nl', true);
      
      if (sheetsServices && sheetsServices.length > 0) {
        console.log(`✅ Loaded ${sheetsServices.length} services from Google Sheets`);
        
        // Map Google Sheets data to our format
        this.services = sheetsServices.map(service => ({
          id: service.id,
          slug: service.slug,
          name: service.name,
          name_en: service.name_en,
          description: service.description,
          description_en: service.description_en,
          category: service.category,
          image_url: service.image_url,
          duration_minutes: service.duration_minutes,
          is_active: service.is_active
        }));
        
        // Map service prices
        this.servicePrices = [];
        sheetsServices.forEach(service => {
          if (service.prices && Array.isArray(service.prices)) {
            service.prices.forEach(price => {
              this.servicePrices.push({
                id: price.id,
                service_id: service.id,
                body_type_id: price.body_type_id,
                price_min: price.price_min,
                price_max: price.price_max,
                currency: price.currency || 'EUR',
                duration_minutes: price.duration_minutes,
                promo_percent: price.promo_percent || 0,
                is_active: price.is_active
              });
            });
          }
        });
        
        console.log(`✅ Loaded ${this.servicePrices.length} service prices from Google Sheets`);
        return true;
      } else {
        console.log('⚠️  No services found in Google Sheets, using demo data');
        return false;
      }
    } catch (error) {
      console.error('❌ Error loading from Google Sheets:', error);
      return false;
    }
  }

  // Actualizează datele în Google Sheets (pentru persistență)
  async syncWithGoogleSheets() {
    try {
      // Sincronizează serviciile
      await GoogleSheetsService.updateServices(this.services);
      
      // Sincronizează prețurile
      await GoogleSheetsService.updateServicePrices(this.servicePrices);
      
      return true;
    } catch (error) {
      console.error('Error syncing with Google Sheets:', error);
      return false;
    }
  }
}

export const vehicleServicesService = new VehicleServicesService();
