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

  // Inițializează datele demo
  async initializeDemoData() {
    // First try to load from Google Sheets
    const loadedFromSheets = await this.loadFromGoogleSheets();
    if (loadedFromSheets) {
      console.log('✅ Using data from Google Sheets');
      return {
        services: this.services.length,
        prices: this.servicePrices.length,
        source: 'google_sheets'
      };
    }
    
    // If Google Sheets failed, use demo data
    console.log('⚠️  Using demo data');
    
    // Servicii demo
    this.services = [
      {
        id: 1,
        slug: 'premium-wash',
        name: 'Premium Wash',
        description: 'Spălare completă exterioară cu produse de calitate superioară',
        category: 'exterior',
        image_url: '/images/services/premium-wash.jpg',
        duration_minutes: 45,
        is_active: true
      },
      {
        id: 2,
        slug: 'interior-detail',
        name: 'Interior Detail',
        description: 'Curățare profundă interior cu extracție și deodorizare',
        category: 'interior',
        image_url: '/images/services/interior-detail.jpg',
        duration_minutes: 120,
        is_active: true
      },
      {
        id: 3,
        slug: 'engine-detailing',
        name: 'Engine Detailing',
        description: 'Curățare și protejare compartiment motor',
        category: 'engine',
        image_url: '/images/services/engine-detailing.jpg',
        duration_minutes: 60,
        is_active: true
      },
      {
        id: 4,
        slug: 'ceramic-coating',
        name: 'Ceramic Coating',
        description: 'Aplicare protecție ceramică pentru vopsea',
        category: 'protection',
        image_url: '/images/services/ceramic-coating.jpg',
        duration_minutes: 240,
        is_active: true
      },
      {
        id: 5,
        slug: 'headlight-restoration',
        name: 'Headlight Restoration',
        description: 'Restaurare faruri oxidate',
        category: 'restoration',
        image_url: '/images/services/headlight-restoration.jpg',
        duration_minutes: 90,
        is_active: true
      }
    ];

    // Prețuri demo pentru fiecare serviciu și tip de caroserie
    this.servicePrices = [];
    
    // Premium Wash - prețuri diferite în funcție de caroserie
    const premiumWashPrices = {
      'suv': { price_min: 35, price_max: 45, duration_minutes: 45 },
      'berlina': { price_min: 25, price_max: 35, duration_minutes: 40 },
      'break': { price_min: 30, price_max: 40, duration_minutes: 45 },
      'hatchback': { price_min: 20, price_max: 30, duration_minutes: 35 },
      'coupe': { price_min: 25, price_max: 35, duration_minutes: 40 },
      'cabrio': { price_min: 25, price_max: 35, duration_minutes: 40 },
      'van': { price_min: 40, price_max: 50, duration_minutes: 50 }
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
      // Generează ID unic pentru serviciu
      const maxId = Math.max(...this.services.map(s => s.id), 0);
      const newServiceId = maxId + 1;
      
      // Creează slug din nume
      const slug = this.createSlug(serviceData.name);
      
      // Detectează limba originală pentru nume și descriere folosind DeepL
      const detectedNameLang = await detectLanguageWithDeepL(serviceData.name);
      const detectedDescLang = serviceData.description ? await detectLanguageWithDeepL(serviceData.description) : 'EN';
      
      console.log(`🔍 DeepL detected languages - Name: ${detectedNameLang}, Description: ${detectedDescLang}`);
      
      // Traduce numele și descrierea în toate cele 5 limbi folosind DeepL
      const targetLanguages = ['NL', 'EN', 'ES', 'PL', 'RO'];
      const nameTranslations = {};
      const descTranslations = {};
      
      // Traduce numele folosind DeepL
      try {
        console.log(`🔄 DeepL translating name: "${serviceData.name}" from ${detectedNameLang} to all languages...`);
        const nameTranslationsResult = await translateMultipleWithDeepL(serviceData.name, targetLanguages, detectedNameLang);
        
        // Procesează rezultatele traducerii
        targetLanguages.forEach(lang => {
          if (lang === detectedNameLang) {
            nameTranslations[lang] = serviceData.name; // Păstrează originalul
            console.log(`✅ Keeping original name for ${lang}: ${serviceData.name}`);
          } else {
            nameTranslations[lang] = nameTranslationsResult[lang] || serviceData.name;
            console.log(`🔄 DeepL translated name to ${lang}: ${nameTranslations[lang]}`);
          }
        });
      } catch (error) {
        console.error('❌ DeepL name translation failed:', error);
        // Fallback: folosește textul original pentru toate limbile
        targetLanguages.forEach(lang => {
          nameTranslations[lang] = serviceData.name;
        });
      }
      
      // Traduce descrierea folosind DeepL
      if (serviceData.description) {
        try {
          console.log(`🔄 DeepL translating description: "${serviceData.description.substring(0, 50)}..." from ${detectedDescLang} to all languages...`);
          const descTranslationsResult = await translateMultipleWithDeepL(serviceData.description, targetLanguages, detectedDescLang);
          
          // Procesează rezultatele traducerii
          targetLanguages.forEach(lang => {
            if (lang === detectedDescLang) {
              descTranslations[lang] = serviceData.description; // Păstrează originalul
              console.log(`✅ Keeping original description for ${lang}: ${serviceData.description.substring(0, 50)}...`);
            } else {
              descTranslations[lang] = descTranslationsResult[lang] || serviceData.description;
              console.log(`🔄 DeepL translated description to ${lang}: ${descTranslations[lang].substring(0, 50)}...`);
            }
          });
        } catch (error) {
          console.error('❌ DeepL description translation failed:', error);
          // Fallback: folosește textul original pentru toate limbile
          targetLanguages.forEach(lang => {
            descTranslations[lang] = serviceData.description;
          });
        }
      } else {
        // Dacă nu există descriere, setează string gol pentru toate limbile
        targetLanguages.forEach(lang => {
          descTranslations[lang] = '';
        });
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
      
      activeBodyTypes.forEach((bodyType, index) => {
        // Verifică dacă există prețuri furnizate din frontend
        const providedPrice = serviceData.prices?.find(p => p.body_type_key === bodyType.key);
        
        let priceData;
        if (providedPrice) {
          // Folosește prețurile furnizate din frontend
          priceData = {
            price_min: providedPrice.price_min,
            price_max: providedPrice.price_max !== undefined ? providedPrice.price_max : null, // Dacă nu există price_max, setează null
            duration_minutes: providedPrice.duration_minutes || serviceData.duration_minutes || 60
          };
        } else if (defaultPrices[bodyType.key]) {
          // Folosește prețuri implicite dacă sunt furnizate
          priceData = defaultPrices[bodyType.key];
        } else {
          // Folosește valori implicite
          priceData = {
            price_min: 50,
            price_max: 70,
            duration_minutes: 60
          };
        }
        
        const newPrice = {
          id: Date.now() + index, // ID unic bazat pe timestamp
          service_id: newServiceId,
          body_type_id: bodyType.id,
          price_min: priceData.price_min,
          price_max: priceData.price_max,
          currency: 'EUR',
          duration_minutes: priceData.duration_minutes,
          promo_percent: 0,
          is_active: true
        };
        
        this.servicePrices.push(newPrice);
        newPrices.push(newPrice);
      });
      
      // Sincronizează cu Google Sheets
      await this.syncWithGoogleSheets();
      
      console.log(`✅ Added service "${newService.name}" with ${newPrices.length} price entries`);
      console.log(`📊 Price data used:`, serviceData.prices);
      
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
      
      // Load services from Google Sheets
      const sheetsServices = await GoogleSheetsService.getServicesWithPrices();
      
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