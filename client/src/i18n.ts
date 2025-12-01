import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  nl: {
    translation: {
      title: 'Spectra AutoArt',
      subtitle: 'Premium Auto Detailing\n& Styling',
      heroSecondaryText: 'Wij transformeren auto\'s tot kunstwerken met premium detailing en styling diensten!',
      bookNow: 'Maak een afspraak',
      ourServices: 'Onze Diensten',
      aboutUs: 'Over Ons',
      aboutUsTitle: 'Over Ons',
      aboutUsDescription: 'Spectra AutoArt is uw premium partner voor auto detailing en styling. Met jarenlange ervaring en passie voor perfectie, bieden wij hoogwaardige diensten die uw voertuig transformeren tot een ware showstopper. Ons team van gespecialiseerde professionals gebruikt alleen de beste producten en technieken om uitzonderlijke resultaten te leveren. We geloven in kwaliteit, aandacht voor detail en klanttevredenheid die uw verwachtingen overtreft.',
      gallery: 'Galerij',
      testimonials: 'Testimonials',
      testimonialPage: {
        title: 'Wat klanten zeggen',
        subtitle: 'De ervaringen van onze tevreden klanten',
        noTestimonials: 'Er zijn nog geen testimonials beschikbaar.',
        writeReview: 'Schrijf een recensie',
        yourName: 'Uw naam',
        yourRating: 'Uw beoordeling',
        yourReview: 'Uw recensie',
        namePlaceholder: 'Vul uw naam in',
        reviewPlaceholder: 'Vertel ons over uw ervaring...',
        submitReview: 'Recensie versturen',
        errorSubmit: 'Fout bij het versturen van de recensie',
        submitting: 'Bezig met versturen...',
        cancel: 'Annuleren',
        reviewSubmittedSuccessfully: 'Recensie succesvol verzonden!'
      },
      // Gallery translations
      galleryPage: {
        title: 'Galerij',
        subtitle: 'Bekijk ons premium auto detailing werk',
        categories: {
          all: 'Alles',
          'detailing-interior': 'Interieur Detailing',
          'detailing-exterior': 'Exterieur Detailing',
          'ambient-lights': 'Ambient Verlichting',
          'starlight-ceiling': 'Sterrenhemel Plafond',
          'chrome-delete': 'Chrome Delete',
          'trim-wrapping': 'Trim Wrapping',
          'polish-auto': 'Auto Polijsten',
          'ceramic-protection': 'Keramische Bescherming',
          'before-after': 'Voor & Na'
        },
        fallback: {
          premiumDetailing: 'Premium Detailing',
          completeDetailing: 'Complete Detailing',
          chromeDelete: 'Chrome Delete',
          chromeTransformation: 'Chrome Transformation',
          interiorDetail: 'Interior Detail',
          interiorCleaning: 'Interior Cleaning',
          exteriorPolish: 'Exterior Polish',
          paintCorrection: 'Paint Correction'
        }
      },
      premiumServices: {
        title: 'Premium auto detailing and styling services.',
        subtitle: 'Transform your vehicle with our expert care and attention to detail.',
        description: 'We transform cars into works of art with premium detailing and styling services!'
      },
      servicesPage: {
        fromPrice: 'Vanaf',
        minimumPrice: 'Minimale prijs'
      },
      contact: 'Contact',
      selectLanguage: 'Taal selecteren',
      vehicleBrand: 'Merk',
      vehicleModel: 'Model',
      vehicleType: 'Type',
      vehicleBody: 'Carrosserie',
      selectService: 'Selecteer Service',
      selectTime: 'Tijd selecteren',
      service: 'Service',
      personalDetails: 'Persoonlijke Gegevens',
      selectDate: 'Datum selecteren',
      name: 'Naam',
      email: 'Email',
      phone: 'Telefoon',
      newsletter: 'Nieuwsbrief',
      newsletterSubscription: 'Nieuwsbrief Abonnement',
      newsletterDescription: 'Blijf op de hoogte van onze nieuwste diensten en aanbiedingen!',
      subscribeNewsletter: 'Schrijf me in voor de nieuwsbrief',
      next: 'Volgende',
      back: 'Terug',
      confirm: 'Bevestigen',
      summary: 'Samenvatting',
      total: 'Totaal',
      dateUnavailable: 'Deze datum is niet beschikbaar',
      bookingConfirmed: 'Afspraak bevestigd!',
      send: 'Versturen',
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      chat: 'Chat',
      adminPanel: 'Admin Paneel',
      login: 'Inloggen',
      password: 'Wachtwoord',
      logout: 'Uitloggen',
      dashboard: 'Dashboard',
      bookings: 'Afspraken',
      services: 'Diensten',
      galleryAdmin: 'Galerij',
      newsletterSubscribers: 'Nieuwsbrief Abonnees',
      addService: 'Service Toevoegen',
      editService: 'Service Bewerken',
      serviceName: 'Service Naam',
      serviceDescription: 'Service Beschrijving',
      servicePrice: 'Service Prijs',
      areYouSure: 'Weet je het zeker?',
      serviceAdded: 'Service toegevoegd!',
      serviceUpdated: 'Service bijgewerkt!',
      serviceDeleted: 'Service verwijderd!',
      errorLoadingServices: 'Fout bij het laden van services',
      errorSavingService: 'Fout bij het opslaan van service',
      contactRequests: 'Contact Verzoeken',
      nameRequired: 'Naam is verplicht',
      emailRequired: 'Email is verplicht',
      phoneRequired: 'Telefoon is verplicht',
      serviceRequired: 'Service is verplicht',
      dateRequired: 'Datum is verplicht',
      sendToSubscribers: 'Verstuur naar abonnees',
      subscribers: 'Abonnees',
      forgotPassword: 'Wachtwoord vergeten?',
      loggingIn: 'Inloggen...',
      home: 'Home',
      loading: 'Laden...',
      pleaseEnter: 'Voer in',
      imageAdded: 'Afbeelding toegevoegd!',
      failedToAddImage: 'Afbeelding toevoegen mislukt',
      imageDeleted: 'Afbeelding verwijderd!',
      failedToDeleteImage: 'Afbeelding verwijderen mislukt',
      areYouSureDeleteImage: 'Weet je zeker dat je deze afbeelding wilt verwijderen?',
      pleaseEnterNewsletterSubject: 'Voer een onderwerp in voor de nieuwsbrief',
      pleaseEnterNewsletterContent: 'Voer inhoud in voor de nieuwsbrief (tekst of HTML)',
      newsletterSentSuccessfully: 'Nieuwsbrief succesvol verzonden!',
      failedToSendNewsletter: 'Verzenden nieuwsbrief mislukt',
      sendNewsletterToCountSubscribers: 'Nieuwsbrief versturen naar {{count}} abonnees?',
      newsletterManagement: 'Nieuwsbrief Beheer',
      subjectRequired: 'Onderwerp *',
      textContentForEmailClients: 'Tekstinhoud (voor email clients die geen HTML ondersteunen)',
      htmlContentOptional: 'HTML inhoud (optioneel - wordt gegenereerd uit tekst als leeg)',
      sendingDots: 'Versturen...',
      sendToCountSubscribers: 'Verstuur naar {{count}} abonnees',
      subscribersList: 'Abonnees Lijst',
      subscribersCount: 'Abonnees ({{count}})',
      loginFailed: 'Inloggen mislukt. Controleer je inloggegevens.',
      defaultAdminCredentials: 'Standaard admin inloggegevens:\nEmail: admin@spectra.com\nWachtwoord: admin123\n\nGebruik deze gegevens om in te loggen.',
      passwordResetInstructions: 'Als je je wachtwoord bent vergeten, neem dan contact op met de systeembeheerder.',
      passwordResetFailed: 'Wachtwoord reset mislukt.',

      failedToUpdateImageStatus: 'Status afbeelding bijwerken mislukt',
      imageStatusUpdated: 'Afbeeldingsstatus bijgewerkt!',
      imageNotFound: 'Afbeelding niet gevonden',
      imageUrlPlaceholder: 'https://voorbeeld.nl/afbeelding.jpg',
      enterNewsletterSubjectPlaceholder: 'Voer nieuwsbrief onderwerp in...',
      enterPlainTextContentPlaceholder: 'Voer platte tekst inhoud in...',
      enterHtmlContentPlaceholder: 'Voer HTML inhoud in...',
      vehicleServices: 'Voertuig Services',
      vehicleServicesManagement: 'Voertuig Services Beheer',
      addVehicleService: 'Voertuig Service Toevoegen',
      editVehicleService: 'Voertuig Service Bewerken',
      manageBodyTypes: 'Carrosserie Types Beheren',
      addBodyType: 'Carrosserie Type Toevoegen',
      editBodyType: 'Carrosserie Type Bewerken',
      bodyType: 'Carrosserie Type',
      bodyTypes: 'Carrosserie Types',
      servicePrices: 'Service Prijzen',
      priceForBodyType: 'Prijs voor {{bodyType}}',
      areYouSureDeleteVehicleService: 'Weet je zeker dat je deze voertuig service wilt verwijderen?',
      areYouSureDeleteBodyType: 'Weet je zeker dat je dit carrosserie type wilt verwijderen?',
      errorLoadingVehicleServices: 'Fout bij het laden van voertuig services',
      errorLoadingBodyTypes: 'Fout bij het laden van carrosserie types',
      errorSavingVehicleService: 'Fout bij het opslaan van voertuig service: {{message}}',
      errorSavingBodyType: 'Fout bij het opslaan van carrosserie type: {{message}}',
      vehicleServiceAdded: 'Voertuig service toegevoegd!',
      vehicleServiceUpdated: 'Voertuig service bijgewerkt!',
      vehicleServiceDeleted: 'Voertuig service verwijderd!',
      bodyTypeAdded: 'Carrosserie type toegevoegd!',
      bodyTypeUpdated: 'Carrosserie type bijgewerkt!',
      bodyTypeDeleted: 'Carrosserie type verwijderd!',
      
      // Admin dashboard and statistics
      totalBookings: 'Totaal Afspraken',
      pendingBookings: 'In Afwachting Afspraken',
      totalServices: 'Totaal Diensten',
      unknownService: 'Onbekende Service',
      

      loadingBookings: 'Laden van afspraken...',
      bookingsManagement: 'Afspraken Beheer',
      areYouSureDeleteBooking: 'Weet u zeker dat u deze afspraak wilt verwijderen?',
      servicesManagement: 'Diensten Beheer',
      serviceCreated: 'Dienst aangemaakt!',
      
      // Vehicle services
      basicInfo: 'Basis Informatie',
      durationMinutes: 'Duur (minuten)',
      duration: 'Duur',
      minutes: 'minuten',
      prices: 'Prijzen',
      
      // Gallery management
      loadingImages: 'Laden van afbeeldingen...',
      galleryImage: 'Galerij Afbeelding',
      status: 'Status',
      deactivate: 'Deactiveren',
      

      
      // Contact page translations
      contactPage: {
        title: 'Contacteer Ons',
        subtitle: 'We zijn hier om u te helpen met al uw auto detailing en styling behoeften',
        address: 'Adres',
        phone: 'Telefoon',
        email: 'Email',
        hours: 'Openingstijden',
        hoursText: 'Maandag - Vrijdag: 9:00 - 18:00\nZaterdag: 9:00 - 16:00\nZondag: Gesloten',
        name: 'Naam',
        subject: 'Onderwerp',
        message: 'Bericht',
        send: 'Verstuur',
        sending: 'Versturen...',
        selectSubject: 'Selecteer onderwerp',
        generalInquiry: 'Algemene Vraag',
        bookingInquiry: 'Afspraak Vraag',
        servicesInquiry: 'Diensten Vraag',
        pricingInquiry: 'Prijs Vraag',
        other: 'Anders',
        messagePlaceholder: 'Typ uw bericht hier...',
        successTitle: 'Bericht Verzonden!',
        successMessage: 'Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.',
        errorSending: 'Fout bij het versturen van het bericht. Probeer het opnieuw.',
        mapBlockedTitle: 'Kaart Geblokkeerd',
        mapBlockedMessage: 'De kaart kon niet worden geladen. Dit kan komen door een ad blocker. Schakel uw ad blocker uit voor deze site of vind onze locatie hieronder.',
        ourLocation: 'Onze Locatie',
        addressText: 'Tilburg Stadscentrum',
        openInGoogleMaps: 'Openen in Google Maps'
      },
      
      // Admin translations
      admin: {
        dashboard: 'Dashboard',
        totalBookings: 'Totaal Afspraken',
        pendingBookings: 'In Afwachting Afspraken',
        totalServices: 'Totaal Diensten',
        newsletterSubscribers: 'Nieuwsbrief Abonnees',
        servicesManagement: 'Diensten Beheer',
        addService: 'Service Toevoegen',
        edit: 'Bewerken',
        delete: 'Verwijderen',
        vehicleServicesManagement: 'Voertuig Services Beheer',
        manageBodyTypes: 'Carrosserie Types Beheren',
        addVehicleService: 'Voertuig Service Toevoegen',
        bodyTypes: 'Carrosserie Types',
        galleryManagement: 'Galerij Beheer',
        addNewImage: 'Nieuwe Afbeelding Toevoegen',
        imageUrl: 'Afbeelding URL',
        imageUrlPlaceholder: 'https://voorbeeld.nl/afbeelding.jpg',
        selectImage: 'Selecteer Afbeelding',
        uploadFile: 'Upload Bestand',
        useUrl: 'Gebruik URL',
        chooseImageFile: 'Kies Afbeeldingsbestand',
        chooseImageSource: 'Kies afbeeldingsbron',
        or: 'of',
        enterImageUrl: 'Voer Afbeeldings-URL in',
        altText: 'Alt Tekst',
        descriptionOfImage: 'Beschrijving van afbeelding',
        category: 'Categorie',
        general: 'Algemeen',
        detailingInterior: 'Detailing Interior',
        detailingExterior: 'Detailing Exterior',
        ambientLights: 'Ambient Verlichting',
        starlightCeiling: 'Sterrenhemel Plafond',
        trimWrapping: 'Trim Wrapping',
        polishAuto: 'Auto Polijsten',
        ceramicProtection: 'Keramische Bescherming',
        active: 'Actief',
        addImage: 'Afbeelding Toevoegen',
        existingImages: 'Bestaande Afbeeldingen ({{count}})',
        noImages: 'Geen afbeeldingen',
        newsletterManagement: 'Nieuwsbrief Beheer',
        sendNewsletter: 'Nieuwsbrief Versturen',
        subjectRequired: 'Onderwerp *',
        enterNewsletterSubjectPlaceholder: 'Voer nieuwsbrief onderwerp in...',
        textContentForEmailClients: 'Tekstinhoud (voor email clients die geen HTML ondersteunen)',
        htmlContentOptional: 'HTML inhoud (optioneel - wordt gegenereerd uit tekst als leeg)',
        enterPlainTextContentPlaceholder: 'Voer platte tekst inhoud in...',
        enterHtmlContentPlaceholder: 'Voer HTML inhoud in...',
        sendToCountSubscribers: 'Verstuur naar {{count}} abonnees',
        subscribersCount: 'Abonnees ({{count}})',
        loginFailed: 'Inloggen mislukt. Controleer je inloggegevens.',
        defaultAdminCredentials: 'Standaard admin inloggegevens:\nEmail: admin@spectra.com\nWachtwoord: admin123\n\nGebruik deze gegevens om in te loggen.',
        areYouSureDeleteBooking: 'Weet u zeker dat u deze afspraak wilt verwijderen?',
        bookingsManagement: 'Afspraken Beheer',
        loadingBookings: 'Laden van afspraken...',
        date: 'Datum',
        total: 'Totaal',
        serviceUpdated: 'Service bijgewerkt!',
        serviceCreated: 'Dienst aangemaakt!',
        errorSavingService: 'Fout bij het opslaan van service',
        areYouSureDeleteService: 'Weet je zeker dat je deze service wilt verwijderen?',
        editService: 'Service Bewerken',
        name: 'Naam',
        description: 'Beschrijving',
        price: 'Prijs',
        errorLoadingVehicleServices: 'Fout bij het laden van voertuig services',
        errorLoadingBodyTypes: 'Fout bij het laden van carrosserie types',
        vehicleServiceUpdated: 'Voertuig service bijgewerkt!',
        vehicleServiceCreated: 'Voertuig service aangemaakt!',
        errorSavingVehicleService: 'Fout bij het opslaan van voertuig service',
        bodyTypeUpdated: 'Carrosserie type bijgewerkt!',
        bodyTypeCreated: 'Carrosserie type aangemaakt!',
        errorSavingBodyType: 'Fout bij het opslaan van carrosserie type',
        areYouSureDeleteVehicleService: 'Weet je zeker dat je deze voertuig service wilt verwijderen?',
        areYouSureDeleteBodyType: 'Weet je zeker dat je dit carrosserie type wilt verwijderen?',
        vehicleServiceDeleted: 'Voertuig service verwijderd!',
        errorDeletingVehicleService: 'Fout bij het verwijderen van voertuig service',
        bodyTypeDeleted: 'Carrosserie type verwijderd!',
        errorDeletingBodyType: 'Fout bij het verwijderen van carrosserie type',
        editVehicleService: 'Voertuig Service Bewerken',
        basicInfo: 'Basis Informatie',
        durationMinutes: 'Duur (minuten)',
        pricingPerBodyType: 'Prijzen per Carrosserie Type',
        duration: 'Duur',
        minutes: 'minuten',
        prices: 'Prijzen',
        editBodyType: 'Carrosserie Type Bewerken',
        addBodyType: 'Carrosserie Type Toevoegen',
        bodyType: 'Carrosserie Type',
        key: 'Sleutel',
        sortOrder: 'Sorteer Volgorde',
        inactive: 'Inactief',
        vehicleServices: 'Voertuig Services',
        beforeAfter: 'Voor & Na',
        detailing: 'Detailing',
        interior: 'Interieur',
        exterior: 'Exterieur',
        adding: 'Toevoegen...',
        pleaseEnter: 'Voer in',
        imageAdded: 'Afbeelding toegevoegd!',
        failedToAddImage: 'Afbeelding toevoegen mislukt',
        imageDeleted: 'Afbeelding verwijderd!',
        failedToDeleteImage: 'Afbeelding verwijderen mislukt',
        areYouSureDeleteImage: 'Weet je zeker dat je deze afbeelding wilt verwijderen?',
        failedToUpdateImageStatus: 'Status afbeelding bijwerken mislukt',
        loadingImages: 'Laden van afbeeldingen...',
        galleryImage: 'Galerij Afbeelding',
        status: 'Status',
        deactivate: 'Deactiveren',
        activate: 'Activeren',
        unknownService: 'Onbekende Service',
        passwordResetInstructions: 'Als je je wachtwoord bent vergeten, neem dan contact op met de systeembeheerder.',
        passwordResetFailed: 'Wachtwoord reset mislukt.',
        pleaseSelectImageOrEnterUrl: 'Selecteer een afbeelding of voer een URL in',
        // Booking management translations
        noDate: 'Geen datum opgegeven',
        invalidDate: 'Ongeldige datum',
        noName: 'Geen naam opgegeven',
        noEmail: 'Geen email opgegeven',
        noPhone: 'Geen telefoon opgegeven',
        noServices: 'Geen services opgegeven',
        noVehicleInfo: 'Geen voertuiginformatie',
        viewDetails: 'Details Bekijken',
        details: 'Details',
        editBooking: 'Afspraak Bewerken',
        deleteBooking: 'Afspraak Verwijderen',
        pending: 'In Afwachting',
        confirmed: 'Bevestigd',
        cancelled: 'Geannuleerd',
        confirmDelete: 'Verwijderen Bevestigen',
        deleteBookingWarning: 'Weet je zeker dat je deze afspraak wilt verwijderen?',
        thisActionCannotBeUndone: 'Deze actie kan niet ongedaan worden gemaakt.',
        customerName: 'Klant Naam',
        customerInformation: 'Klant Informatie',
        bookingInformation: 'Afspraak Informatie',
        notSpecified: 'Niet Gespecificeerd'
      },
      
      // Chatbot translations
      chatbot: {
        title: 'Chat Assistent',
        welcome: 'Hallo! Hoe kan ik u vandaag helpen?',
        prices: 'Prețuri',
        bookings: 'Programări',
        services: 'Servicii',
        hours: 'Orar',
        pricesResponse: 'Voor prijsinformatie kunt u het beste een afspraak maken voor een gratis consultatie.',
        bookingsResponse: 'U kunt eenvoudig online een afspraak maken via onze website!',
        servicesResponse: 'We bieden verschillende detailing en styling diensten aan. Kijk op onze website voor meer details.',
        hoursResponse: 'We zijn geopend van maandag tot vrijdag van 9:00 tot 18:00 en op zaterdag van 9:00 tot 16:00.'
      },
      
      // Footer translations
      footer: {
        terms: 'Algemene Voorwaarden',
        privacy: 'Privacybeleid',
        cookies: 'Cookiebeleid',
        contact: 'Contact & Juridisch',
        gdpr: 'AVG / GDPR'
      },
      
      // Terms popup translations
      termsPopup: {
        title: 'Welkom bij Spectra AutoArt',
        description: 'Door onze website te gebruiken, gaat u akkoord met onze algemene voorwaarden en privacybeleid. Wij waarderen uw privacy en zijn toegewijd aan het beschermen van uw persoonlijke gegevens.',
        accept: 'Accepteren',
        decline: 'Afwijzen'
      },
      
      // Terms and Conditions page translations
      termsConditions: {
        title: 'Algemene Voorwaarden',
        lastUpdated: 'Laatst bijgewerkt: 27 november 2025',
        
        section1: {
          title: '1. Algemene Bepalingen',
          content: 'Deze algemene voorwaarden zijn van toepassing op alle diensten die worden aangeboden door Spectra AutoArt, gevestigd te Tilburg. Door gebruik te maken van onze diensten gaat u akkoord met deze voorwaarden.'
        },
        
        section2: {
          title: '2. Diensten',
          content: 'Spectra AutoArt biedt premium auto detailing en styling diensten aan, waaronder:',
          services: [
            'Interieur en exterieur detailing',
            'Lumini ambient verlichting installatie',
            'Sterrenhemel plafond installatie',
            'Plafon retapitatie',
            'Chrome delete services',
            'Trim colantare',
            'Auto polijsten',
            'Keramische beschermingscoating'
          ]
        },
        
        section3: {
          title: '3. Afspraken en Annulering',
          content: '3.1 Afspraken kunnen online worden gemaakt via onze website of telefonisch. 3.2 Voor annuleringen dient u minimaal 24 uur van tevoren contact op te nemen. Bij late annuleringen behouden wij ons het recht voor om 50% van de servicekosten in rekening te brengen. 3.3 Bij het niet verschijnen zonder annulering (no-show) wordt het volledige bedrag van de gereserveerde service in rekening gebracht.'
        },
        
        section4: {
          title: '4. Prijzen en Betaling',
          content: '4.1 Alle prijzen zijn inclusief BTW, tenzij anders vermeld. 4.2 Betaling vindt plaats na voltooiing van de dienst, tenzij anders is overeengekomen. 4.3 Wij accepteren contante betaling, pinbetaling en bankoverschrijving. 4.4 Prijzen kunnen wijzigen zonder voorafgaande kennisgeving. De prijs die geldt op het moment van boeking is bindend.'
        },
        
        section5: {
          title: '5. Garantie en Klachten',
          content: '5.1 Spectra AutoArt staat garant voor de kwaliteit van haar werkzaamheden gedurende 30 dagen na voltooiing, met uitzondering van normale slijtage. 5.2 Klachten dienen binnen 7 dagen na voltooiing van de dienst schriftelijk te worden gemeld. 5.3 Wij behouden ons het recht voor om klachten te onderzoeken en passende oplossingen te bieden, waaronder herstelwerkzaamheden of gedeeltelijke terugbetaling.'
        },
        
        section6: {
          title: '6. Aansprakelijkheid',
          content: '6.1 Spectra AutoArt is aansprakelijk voor schade die ontstaat tijdens het uitvoeren van onze diensten, met een maximum van de factuurwaarde van de betreffende dienst. 6.2 Wij zijn niet aansprakelijk voor: schade veroorzaakt door bestaande gebreken aan het voertuig, schade die ontstaat door extreme weersomstandigheden na het uitvoeren van de dienst, waardevermindering van het voertuig, en indirecte schade of gevolgschade.'
        },
        
        section7: {
          title: '7. Voertuig Inname',
          content: '7.1 Bij inname van het voertuig wordt een inspectie uitgevoerd en eventuele bestaande schade wordt genoteerd. 7.2 Persoonlijke bezittingen dienen vooraf te worden verwijderd. Spectra AutoArt is niet aansprakelijk voor verloren of beschadigde persoonlijke items. 7.3 Het voertuig dient op de afgesproken tijd en datum te worden afgeleverd en opgehaald. Bij late ophaling kunnen extra kosten in rekening worden gebracht.'
        },
        
        section8: {
          title: '8. Intellectueel Eigendom',
          content: 'Alle afbeeldingen, teksten en andere content op onze website en marketingmateriaal zijn eigendom van Spectra AutoArt en mogen niet zonder toestemming worden gebruikt.'
        },
        
        section9: {
          title: '9. Privacy en Gegevensbescherming',
          content: 'Wij behandelen uw persoonlijke gegevens vertrouwelijk volgens onze privacyverklaring en de Algemene Verordening Gegevensbescherming (AVG).'
        },
        
        section10: {
          title: '10. Wijzigingen in Voorwaarden',
          content: 'Spectra AutoArt behoudt zich het recht voor om deze algemene voorwaarden te wijzigen. Wijzigingen worden via onze website bekend gemaakt.'
        },
        
        section11: {
          title: '11. Toepasselijk Recht',
          content: 'Op deze algemene voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Tilburg.'
        },
        
        contact: {
          title: 'Contact',
          content: 'Heeft u vragen over deze algemene voorwaarden? Neem dan contact met ons op:',
          companyName: 'Spectra AutoArt',
          address: 'Tilburg Stadscentrum',
          email: 'Email: spectraautoart@gmail.com',
          phone: 'Telefoon: 0031685300906'
        }
      },
      
      // Privacy Policy page translations
      privacyPolicy: {
        title: 'Privacybeleid',
        lastUpdated: 'Laatst bijgewerkt: 27 november 2025',
        
        section1: {
          title: '1. Inleiding',
          content: 'Bij Spectra AutoArt hechten wij groot belang aan uw privacy en de bescherming van uw persoonsgegevens. Dit privacybeleid beschrijft hoe wij omgaan met uw persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG).'
        },
        
        section2: {
          title: '2. Verwerkingsverantwoordelijke',
          content: 'Spectra AutoArt<br>Gevestigd te Tilburg<br>KvK-nummer: [te registreren]<br>Email: privacy@spectraautoart.nl'
        },
        
        section3: {
          title: '3. Welke gegevens verzamelen wij?',
          intro: 'Wij verzamelen de volgende categorieën persoonsgegevens:',
          
          subsection1: {
            title: '3.1 Contactgegevens',
            items: [
              'Naam en achternaam',
              'Emailadres',
              'Telefoonnummer',
              'Adresgegevens'
            ]
          },
          
          subsection2: {
            title: '3.2 Voertuiggegevens',
            items: [
              'Kentekennummer',
              'Voertuigmerk en model',
              'Bouwjaar',
              'Carrosserietype'
            ]
          },
          
          subsection3: {
            title: '3.3 Dienstverleningsgegevens',
            items: [
              'Geboekte services',
              'Afspraakgegevens',
              'Betaalgegevens',
              'Servicegeschiedenis'
            ]
          },
          
          subsection4: {
            title: '3.4 Websitegebruik',
            items: [
              'IP-adres',
              'Browserinformatie',
              'Cookies (zie ons cookiebeleid)',
              'Bezoekgedrag op onze website'
            ]
          }
        },
        
        section4: {
          title: '4. Doeleinden van gegevensverwerking',
          intro: 'Wij verwerken uw gegevens voor de volgende doeleinden:',
          
          subsection1: {
            title: '4.1 Dienstverlening',
            items: [
              'Het uitvoeren van afspraken en services',
              'Communicatie over uw afspraken',
              'Facturering en betaling',
              'Kwaliteitsborging en garantie'
            ]
          },
          
          subsection2: {
            title: '4.2 Klantenservice',
            items: [
              'Beantwoorden van vragen',
              'Verwerken van klachten',
              'Nazorg en ondersteuning'
            ]
          },
          
          subsection3: {
            title: '4.3 Marketing (met toestemming)',
            items: [
              'Nieuwsbrieven versturen',
              'Acties en aanbiedingen communiceren',
              'Geïsoleerde marktonderzoek'
            ]
          },
          
          subsection4: {
            title: '4.4 Wettelijke verplichtingen',
            items: [
              'Belastingaangiften',
              'Administratieverplichtingen',
              'Juridische procedures'
            ]
          }
        },
        
        section5: {
          title: '5. Rechtsgrond voor verwerking',
          intro: 'Wij verwerken uw gegevens op basis van:',
          items: [
            '<strong>Overeenkomst:</strong> Voor het uitvoeren van onze dienstverlening',
            '<strong>Wettelijke verplichting:</strong> Voor belasting en administratie',
            '<strong>Gerechtvaardigd belang:</strong> Voor bedrijfsvoering en fraudepreventie',
            '<strong>Toestemming:</strong> Voor marketingactiviteiten'
          ]
        },
        
        section6: {
          title: '6. Bewaartermijnen',
          intro: 'Wij bewaren uw gegevens niet langer dan noodzakelijk:',
          items: [
            '<strong>Klantgegevens:</strong> 7 jaar na laatste transactie (belastingwet)',
            '<strong>Factuurgegevens:</strong> 7 jaar (belastingwet)',
            '<strong>Marketinggegevens:</strong> Tot uitschrijving of 2 jaar na laatste interactie',
            '<strong>Websitelogs:</strong> 1 jaar',
            '<strong>Cookies:</strong> Zie cookiebeleid'
          ]
        },
        
        section7: {
          title: '7. Delen van gegevens',
          intro: 'Wij delen uw gegevens alleen met:',
          items: [
            'IT-dienstverleners (hosting, email, software)',
            'Boekhoudsoftware en accountants',
            'Betaalproviders',
            'Overheidsinstanties bij wettelijke verplichting'
          ],
          outro: 'Al onze verwerkers zijn gebonden aan verwerkersovereenkomsten en mogen uw gegevens alleen gebruiken voor het afgesproken doel.'
        },
        
        section8: {
          title: '8. Beveiliging',
          intro: 'Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beveiligen:',
          items: [
            'Versleuteling van data (SSL/TLS)',
            'Toegangscontrole en authenticatie',
            'Regelmatige backups',
            'Beveiligingssoftware en firewalls',
            'Medewerkersscholing over privacy'
          ]
        },
        
        section9: {
          title: '9. Uw rechten',
          intro: 'U heeft de volgende rechten onder de AVG:',
          items: [
            '<strong>Recht op inzage:</strong> Inzien welke gegevens wij van u hebben',
            '<strong>Recht op rectificatie:</strong> Correctie van onjuiste gegevens',
            '<strong>Recht op verwijdering:</strong> Verwijdering van uw gegevens (onder voorwaarden)',
            '<strong>Recht op beperking:</strong> Beperking van verwerking',
            '<strong>Recht op dataportabiliteit:</strong> Overdracht van uw gegevens',
            '<strong>Recht van bezwaar:</strong> Bezwaar maken tegen verwerking',
            '<strong>Recht op intrekking:</strong> Intrekken van toestemming'
          ]
        },
        
        section10: {
          title: '10. Cookies',
          content: 'Wij gebruiken cookies voor een optimale website-ervaring. Zie ons <a href="/cookiebeleid">cookiebeleid</a> voor meer informatie.'
        },
        
        section11: {
          title: '11. Contact',
          intro: 'Voor vragen over dit privacybeleid of uw rechten kunt u contact opnemen:',
          contact: 'Spectra AutoArt<br>Email: privacy@spectraautoart.nl<br>Telefoon: +31 6 12345678',
          authority: 'U heeft ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens:',
          authorityAddress: 'Autoriteit Persoonsgegevens<br>Postbus 93374<br>2509 AJ Den Haag<br>Tel: 088 - 1805 250'
        }
      }
    }
  },
  en: {
    translation: {
      title: 'Spectra AutoArt',
      subtitle: 'Premium Auto Detailing\n& Styling',
      bookNow: 'Book Now',
      ourServices: 'Our Services',
      aboutUs: 'About Us',
      aboutUsTitle: 'About Us',
      aboutUsDescription: 'Spectra AutoArt is your premium partner for auto detailing and styling. With years of experience and passion for perfection, we offer high-quality services that transform your vehicle into a true showstopper. Our team of specialized professionals uses only the best products and techniques to deliver exceptional results. We believe in quality, attention to detail and customer satisfaction that exceeds your expectations.',
      gallery: 'Gallery',
      // Gallery translations
      galleryPage: {
        title: 'Gallery',
        subtitle: 'View our premium auto detailing work',
        categories: {
          all: 'All',
          'detailing-interior': 'Interieur Detailing',
          'detailing-exterior': 'Exterieur Detailing',
          'ambient-lights': 'Ambient Verlichting',
          'starlight-ceiling': 'Sterrenhemel Plafond',
          'chrome-delete': 'Chrome Delete',
          'trim-wrapping': 'Trim Wrapping',
          'polish-auto': 'Auto Polijsten',
          'ceramic-protection': 'Keramische Bescherming',
          'before-after': 'Voor & Na'
        },
        fallback: {
          premiumDetailing: 'Premium Detailing',
          completeDetailing: 'Complete Detailing',
          chromeDelete: 'Chrome Delete',
          chromeTransformation: 'Chrome Transformation',
          interiorDetail: 'Interior Detail',
          interiorCleaning: 'Interior Cleaning',
          exteriorPolish: 'Exterior Polish',
          paintCorrection: 'Paint Correction'
        }
      },
      testimonials: 'Testimonials',
      testimonialPage: {
        title: 'What customers say',
        subtitle: 'The experiences of our satisfied customers',
        noTestimonials: 'No testimonials available yet.',
        writeReview: 'Write a review',
        yourName: 'Your name',
        yourRating: 'Your rating',
        yourReview: 'Your review',
        namePlaceholder: 'Enter your name',
        reviewPlaceholder: 'Tell us about your experience...',
        submitReview: 'Submit review',
        errorSubmit: 'Error submitting the review',
        submitting: 'Submitting...',
        cancel: 'Cancel',
        reviewSubmittedSuccessfully: 'Review submitted successfully!'
      },
      premiumServices: {
        title: 'Premium auto detailing and styling services.',
        subtitle: 'Transform your vehicle with our expert care and attention to detail.',
        description: 'We transform cars into works of art with premium detailing and styling services!'
      },
      servicesPage: {
        fromPrice: 'From',
        minimumPrice: 'Minimum price'
      },
      contact: 'Contact',
      selectLanguage: 'Select Language',
      vehicleBrand: 'Brand',
      vehicleModel: 'Model',
      vehicleType: 'Type',
      vehicleBody: 'Body',
      selectService: 'Select Service',
      selectTime: 'Select Time',
      service: 'Service',
      personalDetails: 'Personal Details',
      selectDate: 'Select Date',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      newsletter: 'Newsletter',
      newsletterSubscription: 'Newsletter Subscription',
      newsletterDescription: 'Stay updated with our latest services and offers!',
      subscribeNewsletter: 'Subscribe me to the newsletter',
      next: 'Next',
      back: 'Back',
      confirm: 'Confirm',
      summary: 'Summary',
      total: 'Total',
      dateUnavailable: 'This date is unavailable',
      bookingConfirmed: 'Booking Confirmed!',
      send: 'Send',
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      chat: 'Chat',
      adminPanel: 'Admin Panel',
      login: 'Login',
      password: 'Password',
      logout: 'Logout',
      dashboard: 'Dashboard',
      bookings: 'Bookings',
      services: 'Services',
      galleryAdmin: 'Gallery',
      newsletterSubscribers: 'Newsletter Subscribers',
      addService: 'Add Service',
      editService: 'Edit Service',
      serviceName: 'Service Name',
      serviceDescription: 'Service Description',
      servicePrice: 'Service Price',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      areYouSure: 'Are you sure?',
      serviceAdded: 'Service added!',
      serviceUpdated: 'Service updated!',
      serviceDeleted: 'Service deleted!',
      errorLoadingServices: 'Error loading services',
      errorSavingService: 'Error saving service',
      contactRequests: 'Contact Requests',
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      phoneRequired: 'Phone is required',
      serviceRequired: 'Service is required',
      dateRequired: 'Date is required',
      sendToSubscribers: 'Send to subscribers',
      subscribers: 'Subscribers',
      forgotPassword: 'Forgot password?',
      loggingIn: 'Logging in...',
      home: 'Home',
      loading: 'Loading...',
      pleaseEnter: 'Please enter',
      imageAdded: 'Image added!',
      failedToAddImage: 'Failed to add image',
      imageDeleted: 'Image deleted!',
      failedToDeleteImage: 'Failed to delete image',
      areYouSureDeleteImage: 'Are you sure you want to delete this image?',
      pleaseEnterNewsletterSubject: 'Please enter a subject for the newsletter',
      pleaseEnterNewsletterContent: 'Please enter content for the newsletter (text or HTML)',
      newsletterSentSuccessfully: 'Newsletter sent successfully!',
      failedToSendNewsletter: 'Failed to send newsletter',
      sendNewsletterToCountSubscribers: 'Send newsletter to {{count}} subscribers?',
      newsletterManagement: 'Newsletter Management',
      subjectRequired: 'Subject *',
      textContentForEmailClients: 'Text Content (for email clients that don\'t support HTML)',
      htmlContentOptional: 'HTML Content (optional - will be generated from text if empty)',
      sendingDots: 'Sending...',
      sendToCountSubscribers: 'Send to {{count}} subscribers',
      subscribersList: 'Subscribers List',
      subscribersCount: 'Subscribers ({{count}})',
      loginFailed: 'Login failed. Please check your credentials.',
      defaultAdminCredentials: 'Default admin credentials:\nEmail: admin@spectra.com\nPassword: admin123\n\nPlease use these credentials to login.',
      passwordResetInstructions: 'If you forgot your password, please contact the system administrator.',
      passwordResetFailed: 'Password reset failed.',

      failedToUpdateImageStatus: 'Failed to update image status',
      imageStatusUpdated: 'Image status updated!',
      imageNotFound: 'Image not found',
      imageUrlPlaceholder: 'https://example.com/image.jpg',
      enterNewsletterSubjectPlaceholder: 'Enter newsletter subject...',
      enterPlainTextContentPlaceholder: 'Enter plain text content...',
      enterHtmlContentPlaceholder: 'Enter HTML content...',
      vehicleServicesManagement: 'Vehicle Services Management',
      addVehicleService: 'Add Vehicle Service',
      editVehicleService: 'Edit Vehicle Service',
      manageBodyTypes: 'Manage Body Types',
      addBodyType: 'Add Body Type',
      editBodyType: 'Edit Body Type',
      bodyType: 'Body Type',
      bodyTypes: 'Body Types',
      servicePrices: 'Service Prices',
      priceForBodyType: 'Price for {{bodyType}}',
      areYouSureDeleteVehicleService: 'Are you sure you want to delete this vehicle service?',
      areYouSureDeleteBodyType: 'Are you sure you want to delete this body type?',
      errorLoadingVehicleServices: 'Error loading vehicle services',
      errorLoadingBodyTypes: 'Error loading body types',
      errorSavingVehicleService: 'Error saving vehicle service: {{message}}',
      errorSavingBodyType: 'Error saving body type: {{message}}',
      vehicleServiceAdded: 'Vehicle service added!',
      vehicleServiceUpdated: 'Vehicle service updated!',
      vehicleServiceDeleted: 'Vehicle service deleted!',
      bodyTypeAdded: 'Body type added!',
      bodyTypeUpdated: 'Body type updated!',
      bodyTypeDeleted: 'Body type deleted!',
      
      // Contact page translations
      contactPage: {
        title: 'Contact Us',
        subtitle: 'We are here to help you with all your auto detailing and styling needs',
        address: 'Address',
        phone: 'Phone',
        email: 'Email',
        hours: 'Hours',
        hoursText: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed',
        name: 'Name',
        subject: 'Subject',
        message: 'Message',
        send: 'Send',
        sending: 'Sending...',
        selectSubject: 'Select subject',
        generalInquiry: 'General Inquiry',
        bookingInquiry: 'Booking Inquiry',
        servicesInquiry: 'Services Inquiry',
        pricingInquiry: 'Pricing Inquiry',
        other: 'Other',
        messagePlaceholder: 'Type your message here...',
        successTitle: 'Message Sent!',
        successMessage: 'Thank you for your message. We will get back to you as soon as possible.',
        errorSending: 'Error sending message. Please try again.',
        mapBlockedTitle: 'Map Blocked',
        mapBlockedMessage: 'The map could not be loaded. This might be due to an ad blocker. Please disable your ad blocker for this site or find our location below.',
        ourLocation: 'Our Location',
        addressText: 'Tilburg City Center',
        openInGoogleMaps: 'Open in Google Maps'
      },
      
      // Chatbot translations
      chatbot: {
        title: 'Chat Assistant',
        welcome: 'Hello! How can I help you today?',
        prices: 'Prices',
        bookings: 'Bookings',
        services: 'Services',
        hours: 'Hours',
        pricesResponse: 'For pricing information, it\'s best to schedule an appointment for a free consultation.',
        bookingsResponse: 'You can easily book online through our website!',
        servicesResponse: 'We offer various detailing and styling services. Check our website for more details.',
        hoursResponse: 'We are open Monday to Friday from 9:00 AM to 6:00 PM and Saturday from 9:00 AM to 4:00 PM.'
      },
      
      // Footer translations
      footer: {
        terms: 'Terms & Conditions',
        privacy: 'Privacy Policy',
        cookies: 'Cookie Policy',
        contact: 'Contact & Legal',
        gdpr: 'GDPR'
      },
      
      // Terms popup translations
      termsPopup: {
        title: 'Welcome to Spectra AutoArt',
        description: 'By using our website, you agree to our terms and conditions and privacy policy. We value your privacy and are committed to protecting your personal data.',
        accept: 'Accept',
        decline: 'Decline'
      },
      
      // Admin translations
      admin: {
        dashboard: 'Dashboard',
        totalBookings: 'Total Bookings',
        pendingBookings: 'Pending Bookings',
        totalServices: 'Total Services',
        newsletterSubscribers: 'Newsletter Subscribers',
        servicesManagement: 'Services Management',
        addService: 'Add Service',
        edit: 'Edit',
        delete: 'Delete',
        vehicleServicesManagement: 'Vehicle Services Management',
        manageBodyTypes: 'Manage Body Types',
        addVehicleService: 'Add Vehicle Service',
        bodyTypes: 'Body Types',
        galleryManagement: 'Gallery Management',
        addNewImage: 'Add New Image',
        imageUrl: 'Image URL',
        imageUrlPlaceholder: 'https://example.com/image.jpg',
        selectImage: 'Select Image',
        uploadFile: 'Upload File',
        useUrl: 'Use URL',
        chooseImageFile: 'Choose Image File',
        chooseImageSource: 'Choose Image Source',
        or: 'or',
        enterImageUrl: 'Enter Image URL',
        altText: 'Alt Text',
        descriptionOfImage: 'Description of image',
        category: 'Category',
        general: 'General',
        detailingInterior: 'Detailing Interior',
        detailingExterior: 'Detailing Exterior',
        ambientLights: 'Ambient Verlichting',
        starlightCeiling: 'Sterrenhemel Plafond',
        trimWrapping: 'Trim Wrapping',
        polishAuto: 'Auto Polijsten',
        ceramicProtection: 'Keramische Bescherming',
        active: 'Active',
        addImage: 'Add Image',
        existingImages: 'Existing Images ({{count}})',
        noImages: 'No images',
        newsletterManagement: 'Newsletter Management',
        sendNewsletter: 'Send Newsletter',
        subjectRequired: 'Subject *',
        enterNewsletterSubjectPlaceholder: 'Enter newsletter subject...',
        textContentForEmailClients: 'Text Content (for email clients that don\'t support HTML)',
        htmlContentOptional: 'HTML Content (optional - will be generated from text if empty)',
        enterPlainTextContentPlaceholder: 'Enter plain text content...',
        enterHtmlContentPlaceholder: 'Enter HTML content...',
        sendToCountSubscribers: 'Send to {{count}} subscribers',
        subscribersCount: 'Subscribers ({{count}})',
        loginFailed: 'Login failed. Please check your credentials.',
        defaultAdminCredentials: 'Default admin credentials:\nEmail: admin@spectra.com\nPassword: admin123\n\nPlease use these credentials to login.',
        areYouSureDeleteBooking: 'Are you sure you want to delete this booking?',
        bookingsManagement: 'Bookings Management',
        loadingBookings: 'Loading bookings...',
        date: 'Date',
        total: 'Total',
        serviceUpdated: 'Service updated!',
        serviceCreated: 'Service created!',
        errorSavingService: 'Error saving service',
        areYouSureDeleteService: 'Are you sure you want to delete this service?',
        editService: 'Edit Service',
        name: 'Name',
        description: 'Description',
        price: 'Price',
        errorLoadingVehicleServices: 'Error loading vehicle services',
        errorLoadingBodyTypes: 'Error loading body types',
        errorSavingVehicleService: 'Error saving vehicle service',
        errorSavingBodyType: 'Error saving body type',
        vehicleServiceUpdated: 'Vehicle service updated!',
        vehicleServiceCreated: 'Vehicle service created!',
        vehicleServiceDeleted: 'Vehicle service deleted!',
        bodyTypeUpdated: 'Body type updated!',
        bodyTypeCreated: 'Body type created!',
        bodyTypeDeleted: 'Body type deleted!',
        areYouSureDeleteVehicleService: 'Are you sure you want to delete this vehicle service?',
        areYouSureDeleteBodyType: 'Are you sure you want to delete this body type?',
        errorDeletingVehicleService: 'Error deleting vehicle service',
        errorDeletingBodyType: 'Error deleting body type',
        editVehicleService: 'Edit Vehicle Service',
        basicInfo: 'Basic Info',
        durationMinutes: 'Duration (minutes)',
        pricingPerBodyType: 'Pricing per Body Type',
        duration: 'Duration',
        minutes: 'minutes',
        prices: 'Prices',
        editBodyType: 'Edit Body Type',
        addBodyType: 'Add Body Type',
        bodyType: 'Body Type',
        key: 'Key',
        sortOrder: 'Sort Order',
        inactive: 'Inactive',
        vehicleServices: 'Vehicle Services',
        beforeAfter: 'Before & After',
        detailing: 'Detailing',
        interior: 'Interior',
        exterior: 'Exterior',
        adding: 'Adding...',
        pleaseEnter: 'Please enter',
        imageAdded: 'Image added!',
        failedToAddImage: 'Failed to add image',
        imageDeleted: 'Image deleted!',
        failedToDeleteImage: 'Failed to delete image',
        areYouSureDeleteImage: 'Are you sure you want to delete this image?',
        failedToUpdateImageStatus: 'Failed to update image status',
        loadingImages: 'Loading images...',
        galleryImage: 'Gallery Image',
        status: 'Status',
        deactivate: 'Deactivate',
        activate: 'Activate',
        unknownService: 'Unknown Service',
        passwordResetInstructions: 'If you forgot your password, please contact the system administrator.',
        passwordResetFailed: 'Password reset failed.',
        pleaseSelectImageOrEnterUrl: 'Please select an image or enter a URL',
        // Booking management translations
      noDate: 'No date specified',
      invalidDate: 'Invalid date',
      noName: 'No name provided',
      noEmail: 'No email provided',
      noPhone: 'No phone provided',
      noServices: 'No services provided',
      noVehicleInfo: 'No vehicle information',
      viewDetails: 'View Details',
      details: 'Details',
      editBooking: 'Edit Booking',
      deleteBooking: 'Delete Booking',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      confirmDelete: 'Confirm Delete',
      deleteBookingWarning: 'Are you sure you want to delete this booking?',
      thisActionCannotBeUndone: 'This action cannot be undone.',
      save: 'Save',
      cancel: 'Cancel',
      customerName: 'Customer Name',
      customerInformation: 'Customer Information',
      bookingInformation: 'Booking Information',
      notSpecified: 'Not Specified'
      },
      
      // Terms and Conditions page translations
      termsConditions: {
        title: 'Terms & Conditions',
        lastUpdated: 'Last updated: November 27, 2025',
        
        section1: {
          title: '1. General Provisions',
          content: 'These general terms and conditions apply to all services offered by Spectra AutoArt, located in Tilburg. By using our services, you agree to these terms and conditions.'
        },
        
        section2: {
          title: '2. Services',
          content: 'Spectra AutoArt offers premium car detailing and styling services, including: Interior and exterior detailing, Ambient lighting installation, Starlight ceiling installation, Ceiling reupholstery, Chrome delete services, Trim wrapping, Car polishing, Ceramic protective coating'
        },
        
        section3: {
          title: '3. Appointments and Cancellations',
          content: '3.1 Appointments can be made online via our website or by telephone. 3.2 For cancellations, you must contact us at least 24 hours in advance. In case of late cancellations, we reserve the right to charge 50% of the service costs. 3.3 In case of no-show without cancellation, the full amount of the reserved service will be charged.'
        },
        
        section4: {
          title: '4. Prices and Payment',
          content: '4.1 All prices include VAT, unless otherwise stated. 4.2 Payment takes place after completion of the service, unless otherwise agreed. 4.3 We accept cash payment, card payment and bank transfer. 4.4 Prices may change without prior notice. The price applicable at the time of booking is binding.'
        },
        
        section5: {
          title: '5. Warranty and Complaints',
          content: '5.1 Spectra AutoArt guarantees the quality of its work for 30 days after completion, with the exception of normal wear and tear. 5.2 Complaints must be reported in writing within 7 days of completion of the service. 5.3 We reserve the right to investigate complaints and offer appropriate solutions, including repair work or partial refund.'
        },
        
        section6: {
          title: '6. Liability',
          content: '6.1 Spectra AutoArt is liable for damage that occurs during the performance of our services, with a maximum of the invoice value of the relevant service. 6.2 We are not liable for: damage caused by existing defects in the vehicle, damage caused by extreme weather conditions after the service has been performed, depreciation of the vehicle, and indirect damage or consequential damage.'
        },
        
        section7: {
          title: '7. Vehicle Collection',
          content: '7.1 When the vehicle is collected, an inspection is carried out and any existing damage is noted. 7.2 Personal belongings must be removed in advance. Spectra AutoArt is not liable for lost or damaged personal items. 7.3 The vehicle must be delivered and collected at the agreed time and date. Late collection may incur additional charges.'
        },
        
        section8: {
          title: '8. Intellectual Property',
          content: 'All images, texts and other content on our website and marketing material are the property of Spectra AutoArt and may not be used without permission.'
        },
        
        section9: {
          title: '9. Privacy and Data Protection',
          content: 'We treat your personal data confidentially in accordance with our privacy statement and the General Data Protection Regulation (GDPR).'
        },
        
        section10: {
          title: '10. Changes to Terms',
          content: 'Spectra AutoArt reserves the right to change these general terms and conditions. Changes will be announced via our website.'
        },
        
        section11: {
          title: '11. Applicable Law',
          content: 'Dutch law applies to these general terms and conditions. Disputes will be submitted to the competent court in Tilburg.'
        },
        
        contact: {
          title: 'Contact',
          content: 'Do you have questions about these general terms and conditions? Please contact us:',
          companyName: 'Spectra AutoArt',
          address: 'Tilburg City Center',
          email: 'Email: spectraautoart@gmail.com',
          phone: 'Phone: 0031685300906'
        }
      },
      
      // Privacy Policy page translations
      privacyPolicy: {
        title: 'Privacy Policy',
        lastUpdated: 'Last updated: November 27, 2025',
        
        section1: {
          title: '1. Introduction',
          content: 'At Spectra AutoArt, we attach great importance to your privacy and the protection of your personal data. This privacy policy describes how we handle your personal data in accordance with the General Data Protection Regulation (GDPR).'
        },
        
        section2: {
          title: '2. Data Controller',
          content: 'Spectra AutoArt<br>Located in Tilburg<br>Chamber of Commerce number: [to be registered]<br>Email: privacy@spectraautoart.nl'
        },
        
        section3: {
          title: '3. What data do we collect?',
          intro: 'We collect the following categories of personal data:',
          
          subsection1: {
            title: '3.1 Contact Details',
            items: [
              'First and last name',
              'Email address',
              'Phone number',
              'Address details'
            ]
          },
          
          subsection2: {
            title: '3.2 Vehicle Data',
            items: [
              'License plate number',
              'Vehicle brand and model',
              'Year of construction',
              'Body type'
            ]
          },
          
          subsection3: {
            title: '3.3 Service Data',
            items: [
              'Booked services',
              'Appointment details',
              'Payment details',
              'Service history'
            ]
          },
          
          subsection4: {
            title: '3.4 Website Usage',
            items: [
              'IP address',
              'Browser information',
              'Cookies (see our cookie policy)',
              'Visit behavior on our website'
            ]
          }
        },
        
        section4: {
          title: '4. Purposes of data processing',
          intro: 'We process your data for the following purposes:',
          
          subsection1: {
            title: '4.1 Service Provision',
            items: [
              'Executing appointments and services',
              'Communication about your appointments',
              'Invoicing and payment',
              'Quality assurance and warranty'
            ]
          },
          
          subsection2: {
            title: '4.2 Customer Service',
            items: [
              'Answering questions',
              'Processing complaints',
              'Aftercare and support'
            ]
          },
          
          subsection3: {
            title: '4.3 Marketing (with consent)',
            items: [
              'Sending newsletters',
              'Communicating promotions and offers',
              'Isolated market research'
            ]
          },
          
          subsection4: {
            title: '4.4 Legal obligations',
            items: [
              'Tax returns',
              'Administrative obligations',
              'Legal procedures'
            ]
          }
        },
        
        section5: {
          title: '5. Legal basis for processing',
          intro: 'We process your data on the basis of:',
          items: [
            '<strong>Agreement:</strong> For the execution of our services',
            '<strong>Legal obligation:</strong> For taxes and administration',
            '<strong>Legitimate interest:</strong> For business operations and fraud prevention',
            '<strong>Consent:</strong> For marketing activities'
          ]
        },
        
        section6: {
          title: '6. Retention periods',
          intro: 'We do not keep your data longer than necessary:',
          items: [
            '<strong>Customer data:</strong> 7 years after last transaction (tax law)',
            '<strong>Invoice data:</strong> 7 years (tax law)',
            '<strong>Marketing data:</strong> Until unsubscribing or 2 years after last interaction',
            '<strong>Website logs:</strong> 1 year',
            '<strong>Cookies:</strong> See cookie policy'
          ]
        },
        
        section7: {
          title: '7. Sharing of data',
          intro: 'We only share your data with:',
          items: [
            'IT service providers (hosting, email, software)',
            'Accounting software and accountants',
            'Payment providers',
            'Government agencies when legally required'
          ],
          outro: 'All our processors are bound by processor agreements and may only use your data for the agreed purpose.'
        },
        
        section8: {
          title: '8. Security',
          intro: 'We take appropriate technical and organizational measures to secure your data:',
          items: [
            'Data encryption (SSL/TLS)',
            'Access control and authentication',
            'Regular backups',
            'Security software and firewalls',
            'Employee training on privacy'
          ]
        },
        
        section9: {
          title: '9. Your rights',
          intro: 'You have the following rights under the GDPR:',
          items: [
            '<strong>Right of access:</strong> View what data we have about you',
            '<strong>Right to rectification:</strong> Correction of incorrect data',
            '<strong>Right to erasure:</strong> Deletion of your data (under conditions)',
            '<strong>Right to restriction:</strong> Restriction of processing',
            '<strong>Right to data portability:</strong> Transfer of your data',
            '<strong>Right to object:</strong> Object to processing',
            '<strong>Right to withdraw:</strong> Withdraw consent'
          ]
        },
        
        section10: {
          title: '10. Cookies',
          content: 'We use cookies for an optimal website experience. See our <a href="/cookie-policy">cookie policy</a> for more information.'
        },
        
        section11: {
          title: '11. Contact',
          intro: 'For questions about this privacy policy or your rights, you can contact:',
          contact: 'Spectra AutoArt<br>Email: privacy@spectraautoart.nl<br>Phone: +31 6 12345678',
          authority: 'You also have the right to file a complaint with the Dutch Data Protection Authority:',
          authorityAddress: 'Dutch Data Protection Authority<br>PO Box 93374<br>2509 AJ The Hague<br>Tel: 088 - 1805 250'
        }
      }
    }
  },
  es: {
    translation: {
      title: 'Spectra AutoArt',
      subtitle: 'Premium Auto Detailing\n& Styling',
      bookNow: 'Reservar Ahora',
      ourServices: 'Nuestros Servicios',
      aboutUs: 'Sobre Nosotros',
      aboutUsTitle: 'Sobre Nosotros',
      aboutUsDescription: 'Spectra AutoArt es su socio premium para el detallado y estilizado de autos. Con años de experiencia y pasión por la perfección, ofrecemos servicios de alta calidad que transforman su vehículo en un verdadero espectáculo. Nuestro equipo de profesionales especializados utiliza solo los mejores productos y técnicas para ofrecer resultados excepcionales. Creemos en la calidad, la atención al detalle y la satisfacción del cliente que supera sus expectativas.',
      gallery: 'Galería',
      // Gallery translations
      galleryPage: {
        title: 'Galería',
        subtitle: 'Vea nuestro trabajo premium de detailing de autos',
        categories: {
          all: 'Todo',
          'detailing-interior': 'Interieur Detailing',
          'detailing-exterior': 'Exterieur Detailing',
          'ambient-lights': 'Ambient Verlichting',
          'starlight-ceiling': 'Sterrenhemel Plafond',
          'chrome-delete': 'Chrome Delete',
          'trim-wrapping': 'Trim Wrapping',
          'polish-auto': 'Auto Polijsten',
          'ceramic-protection': 'Keramische Bescherming',
          'before-after': 'Voor & Na'
        },
        fallback: {
          premiumDetailing: 'Detailing Premium',
          completeDetailing: 'Detailing Completo',
          chromeDelete: 'Chrome Delete',
          chromeTransformation: 'Transformación Chrome',
          interiorDetail: 'Detalle Interior',
          interiorCleaning: 'Limpieza Interior',
          exteriorPolish: 'Pulido Exterior',
          paintCorrection: 'Corrección de Pintura'
        }
      },
      testimonials: 'Testimonios',
      servicesPage: {
        fromPrice: 'Desde',
        minimumPrice: 'Precio mínimo'
      },
      contact: 'Contacto',
      selectLanguage: 'Seleccionar Idioma',
      vehicleBrand: 'Marca',
      vehicleModel: 'Modelo',
      vehicleType: 'Tipo',
      vehicleBody: 'Carrocería',
      selectService: 'Seleccionar Servicio',
      personalDetails: 'Datos Personales',
      selectDate: 'Seleccionar Fecha',
      name: 'Nombre',
      email: 'Email',
      phone: 'Teléfono',
      newsletter: 'Boletín',
      next: 'Siguiente',
      back: 'Atrás',
      confirm: 'Confirmar',
      summary: 'Resumen',
      total: 'Total',
      dateUnavailable: 'Esta fecha no está disponible',
      bookingConfirmed: '¡Reserva Confirmada!',
      subscribeNewsletter: 'Suscríbete a nuestro boletín',
      send: 'Enviar',
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      chat: 'Chat',
      adminPanel: 'Panel de Admin',
      login: 'Iniciar Sesión',
      password: 'Contraseña',
      logout: 'Cerrar Sesión',
      dashboard: 'Panel',
      bookings: 'Reservas',
      services: 'Servicios',
      galleryAdmin: 'Galería',
      newsletterSubscribers: 'Suscriptores del Boletín',
      addService: 'Añadir Servicio',
      editService: 'Editar Servicio',
      serviceName: 'Nombre del Servicio',
      serviceDescription: 'Descripción del Servicio',
      servicePrice: 'Precio del Servicio',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      areYouSure: '¿Estás seguro?',
      serviceAdded: '¡Servicio añadido!',
      serviceUpdated: '¡Servicio actualizado!',
      serviceDeleted: '¡Servicio eliminado!',
      errorLoadingServices: 'Error al cargar servicios',
      errorSavingService: 'Error al guardar servicio',
      contactRequests: 'Solicitudes de Contacto',
      nameRequired: 'El nombre es obligatorio',
      emailRequired: 'El email es obligatorio',
      phoneRequired: 'El teléfono es obligatorio',
      serviceRequired: 'El servicio es obligatorio',
      dateRequired: 'La fecha es obligatoria',
      sendToSubscribers: 'Enviar a suscriptores',
      subscribers: 'Suscriptores',
      forgotPassword: '¿Olvidaste tu contraseña?',
      loggingIn: 'Iniciando sesión...',
      home: 'Inicio',
      loading: 'Cargando...',
      pleaseEnter: 'Por favor ingrese',
      imageAdded: '¡Imagen añadida!',
      failedToAddImage: 'Error al añadir imagen',
      imageDeleted: '¡Imagen eliminada!',
      failedToDeleteImage: 'Error al eliminar imagen',
      areYouSureDeleteImage: '¿Estás seguro de que quieres eliminar esta imagen?',
      pleaseEnterNewsletterSubject: 'Por favor ingrese un asunto para el boletín',
      pleaseEnterNewsletterContent: 'Por favor ingrese contenido para el boletín (texto o HTML)',
      newsletterSentSuccessfully: '¡Boletín enviado exitosamente!',
      failedToSendNewsletter: 'Error al enviar boletín',
      sendNewsletterToCountSubscribers: '¿Enviar boletín a {{count}} suscriptores?',
      newsletterManagement: 'Gestión de Boletines',
      subjectRequired: 'Asunto *',
      textContentForEmailClients: 'Contenido de Texto (para clientes de email que no soportan HTML)',
      htmlContentOptional: 'Contenido HTML (opcional - se generará desde texto si está vacío)',
      sendingDots: 'Enviando...',
      sendToCountSubscribers: 'Enviar a {{count}} suscriptores',
      subscribersList: 'Lista de Suscriptores',
      subscribersCount: 'Suscriptores ({{count}})',
      loginFailed: 'Error al iniciar sesión. Por favor verifica tus credenciales.',
      defaultAdminCredentials: 'Credenciales de admin por defecto:\nEmail: admin@spectra.com\nContraseña: admin123\n\nPor favor usa estas credenciales para iniciar sesión.',

      failedToUpdateImageStatus: 'Error al actualizar estado de imagen',
      imageStatusUpdated: '¡Estado de imagen actualizado!',
      imageNotFound: 'Imagen no encontrada',
      imageUrlPlaceholder: 'https://ejemplo.com/imagen.jpg',
      enterNewsletterSubjectPlaceholder: 'Ingrese asunto del boletín...',
      enterPlainTextContentPlaceholder: 'Ingrese contenido de texto plano...',
      enterHtmlContentPlaceholder: 'Ingrese contenido HTML...',
      vehicleServicesManagement: 'Gestión de Servicios de Vehículos',
      addVehicleService: 'Añadir Servicio de Vehículo',
      editVehicleService: 'Editar Servicio de Vehículo',
      manageBodyTypes: 'Gestionar Tipos de Carrocería',
      addBodyType: 'Añadir Tipo de Carrocería',
      editBodyType: 'Editar Tipo de Carrocería',
      bodyType: 'Tipo de Carrocería',
      bodyTypes: 'Tipos de Carrocería',
      servicePrices: 'Precios de Servicios',
      priceForBodyType: 'Precio para {{bodyType}}',
      areYouSureDeleteVehicleService: '¿Estás seguro de que deseas eliminar este servicio de vehículo?',
      areYouSureDeleteBodyType: '¿Estás seguro de que deseas eliminar este tipo de carrocería?',
      errorLoadingVehicleServices: 'Error al cargar servicios de vehículos',
      errorLoadingBodyTypes: 'Error al cargar tipos de carrocería',
      errorSavingVehicleService: 'Error al guardar servicio de vehículo: {{message}}',
      errorSavingBodyType: 'Error al guardar tipo de carrocería: {{message}}',
      vehicleServiceAdded: '¡Servicio de vehículo añadido!',
      vehicleServiceUpdated: '¡Servicio de vehículo actualizado!',
      vehicleServiceDeleted: '¡Servicio de vehículo eliminado!',
      bodyTypeAdded: '¡Tipo de carrocería añadido!',
      bodyTypeUpdated: '¡Tipo de carrocería actualizado!',
      bodyTypeDeleted: '¡Tipo de carrocería eliminado!',
      
      // Contact page translations
      contactPage: {
        title: 'Contáctanos',
        subtitle: 'Estamos aquí para ayudarte con todas tus necesidades de detailing y estilizado de autos',
        address: 'Dirección',
        phone: 'Teléfono',
        email: 'Email',
        hours: 'Horarios',
        hoursText: 'Lunes - Viernes: 9:00 AM - 6:00 PM\nSábado: 9:00 AM - 4:00 PM\nDomingo: Cerrado',
        name: 'Nombre',
        subject: 'Asunto',
        message: 'Mensaje',
        send: 'Enviar',
        sending: 'Enviando...',
        selectSubject: 'Seleccionar asunto',
        generalInquiry: 'Consulta General',
        bookingInquiry: 'Consulta de Reserva',
        servicesInquiry: 'Consulta de Servicios',
        pricingInquiry: 'Consulta de Precios',
        other: 'Otro',
        messagePlaceholder: 'Escribe tu mensaje aquí...',
        successTitle: '¡Mensaje Enviado!',
        successMessage: 'Gracias por tu mensaje. Nos pondremos en contacto contigo lo antes posible.',
        errorSending: 'Error al enviar el mensaje. Por favor intenta nuevamente.',
        mapBlockedTitle: 'Mapa Bloqueado',
        mapBlockedMessage: 'El mapa no se pudo cargar. Esto puede deberse a un bloqueador de anuncios. Desactiva tu bloqueador de anuncios para este sitio o encuentra nuestra ubicación a continuación.',
        ourLocation: 'Nuestra Ubicación',
        addressText: 'Centro de la Ciudad de Tilburg',
        openInGoogleMaps: 'Abrir en Google Maps'
      },
      
      // Chatbot translations
      chatbot: {
        title: 'Asistente de Chat',
        welcome: '¡Hola! ¿Cómo puedo ayudarte hoy?',
        prices: 'Precios',
        bookings: 'Reservas',
        services: 'Servicios',
        hours: 'Horarios',
        pricesResponse: 'Para información de precios, es mejor programar una cita para una consulta gratuita.',
        bookingsResponse: '¡Puedes reservar fácilmente en línea a través de nuestro sitio web!',
        servicesResponse: 'Ofrecemos varios servicios de detailing y estilizado. Revisa nuestro sitio web para más detalles.',
        hoursResponse: 'Estamos abiertos de lunes a viernes de 9:00 AM a 6:00 PM y los sábados de 9:00 AM a 4:00 PM.'
      },
      
      // Footer translations
      footer: {
        terms: 'Términos y Condiciones',
        privacy: 'Política de Privacidad',
        cookies: 'Política de Cookies',
        contact: 'Contacto y Legal',
        gdpr: 'GDPR'
      },
      
      // Terms and Conditions page translations
      termsConditions: {
        title: 'Términos y Condiciones',
        lastUpdated: 'Última actualización: 27 de noviembre de 2025',
        
        section1: {
          title: '1. Disposiciones Generales',
          content: 'Estos términos y condiciones generales se aplican a todos los servicios ofrecidos por Spectra AutoArt, con sede en Tilburg. Al utilizar nuestros servicios, usted acepta estos términos y condiciones.'
        },
        
        section2: {
          title: '2. Servicios',
          content: 'Spectra AutoArt ofrece servicios premium de detailing y estilizado de autos, incluyendo: Detailing de interiores y exteriores, Instalación de iluminación ambiental, Instalación de techo de estrellas, Revestimiento de techo, Servicios de eliminación de cromado, Envoltura de molduras, Pulido de autos, Revestimiento de protección cerámica'
        },
        
        section3: {
          title: '3. Citas y Cancelaciones',
          content: '3.1 Las citas pueden realizarse en línea a través de nuestro sitio web o por teléfono. 3.2 Para cancelaciones, debe contactarnos al menos 24 horas antes. En caso de cancelaciones tardías, nos reservamos el derecho de cobrar el 50% de los costos del servicio. 3.3 En caso de no presentarse sin cancelación, se cobrará el monto completo del servicio reservado.'
        },
        
        section4: {
          title: '4. Precios y Pago',
          content: '4.1 Todos los precios incluyen IVA, a menos que se indique lo contrario. 4.2 El pago se realiza después de la finalización del servicio, a menos que se acuerde lo contrario. 4.3 Aceptamos pagos en efectivo, pagos con tarjeta y transferencia bancaria. 4.4 Los precios pueden cambiar sin previo aviso. El precio aplicable en el momento de la reserva es vinculante.'
        },
        
        section5: {
          title: '5. Garantía y Reclamaciones',
          content: '5.1 Spectra AutoArt garantiza la calidad de su trabajo durante 30 días después de la finalización, con excepción del desgaste normal. 5.2 Las reclamaciones deben ser notificadas por escrito dentro de los 7 días posteriores a la finalización del servicio. 5.3 Nos reservamos el derecho de investigar las reclamaciones y ofrecer soluciones apropiadas, incluyendo trabajos de reparación o reembolso parcial.'
        },
        
        section6: {
          title: '6. Responsabilidad',
          content: '6.1 Spectra AutoArt es responsable por daños que ocurran durante la realización de nuestros servicios, con un máximo del valor de la factura del servicio correspondiente. 6.2 No somos responsables por: daños causados por defectos existentes en el vehículo, daños causados por condiciones climáticas extremas después de realizado el servicio, depreciación del vehículo, y daños indirectos o consecuentes.'
        },
        
        section7: {
          title: '7. Entrega del Vehículo',
          content: '7.1 Cuando se entrega el vehículo, se realiza una inspección y se anota cualquier daño existente. 7.2 Los pertenencias personales deben ser retiradas con anticipación. Spectra AutoArt no es responsable por artículos personales perdidos o dañados. 7.3 El vehículo debe ser entregado y retirado en el tiempo y fecha acordados. La recolección tardía puede generar cargos adicionales.'
        },
        
        section8: {
          title: '8. Propiedad Intelectual',
          content: 'Todas las imágenes, textos y otro contenido en nuestro sitio web y material de marketing son propiedad de Spectra AutoArt y no pueden ser utilizados sin permiso.'
        },
        
        section9: {
          title: '9. Privacidad y Protección de Datos',
          content: 'Tratamos sus datos personales confidencialmente de acuerdo con nuestra declaración de privacidad y el Reglamento General de Protección de Datos (GDPR).'
        },
        
        section10: {
          title: '10. Cambios en los Términos',
          content: 'Spectra AutoArt se reserva el derecho de cambiar estos términos y condiciones generales. Los cambios serán anunciados a través de nuestro sitio web.'
        },
        
        section11: {
          title: '11. Ley Aplicable',
          content: 'El derecho neerlandés se aplica a estos términos y condiciones generales. Las disputas serán sometidas al tribunal competente en Tilburg.'
        },
        
        contact: {
          title: 'Contacto',
          content: '¿Tiene preguntas sobre estos términos y condiciones generales? Por favor contáctenos:',
          companyName: 'Spectra AutoArt',
          address: 'Centro de la Ciudad de Tilburg',
          email: 'Email: spectraautoart@gmail.com',
          phone: 'Teléfono: 0031685300906'
        }
      },
      
      // Privacy Policy page translations
      privacyPolicy: {
        title: 'Política de Privacidad',
        lastUpdated: 'Última actualización: 27 de noviembre de 2025',
        
        section1: {
          title: '1. Introducción',
          content: 'En Spectra AutoArt, concedemos gran importancia a su privacidad y la protección de sus datos personales. Esta política de privacidad describe cómo manejamos sus datos personales de conformidad con el Reglamento General de Protección de Datos (RGPD).'
        },
        
        section2: {
          title: '2. Responsable del Tratamiento',
          content: 'Spectra AutoArt<br>Ubicado en Tilburg<br>Número de Cámara de Comercio: [a registrar]<br>Email: privacy@spectraautoart.nl'
        },
        
        section3: {
          title: '3. ¿Qué datos recopilamos?',
          intro: 'Recopilamos las siguientes categorías de datos personales:',
          
          subsection1: {
            title: '3.1 Datos de Contacto',
            items: [
              'Nombre y apellidos',
              'Dirección de correo electrónico',
              'Número de teléfono',
              'Datos de dirección'
            ]
          },
          
          subsection2: {
            title: '3.2 Datos del Vehículo',
            items: [
              'Número de matrícula',
              'Marca y modelo del vehículo',
              'Año de construcción',
              'Tipo de carrocería'
            ]
          },
          
          subsection3: {
            title: '3.3 Datos de Servicios',
            items: [
              'Servicios reservados',
              'Datos de citas',
              'Datos de pago',
              'Historial de servicios'
            ]
          },
          
          subsection4: {
            title: '3.4 Uso del Sitio Web',
            items: [
              'Dirección IP',
              'Información del navegador',
              'Cookies (vea nuestra política de cookies)',
              'Comportamiento de visitas en nuestro sitio web'
            ]
          }
        },
        
        section4: {
          title: '4. Propósitos del procesamiento de datos',
          intro: 'Procesamos sus datos para los siguientes propósitos:',
          
          subsection1: {
            title: '4.1 Prestación de Servicios',
            items: [
              'Ejecución de citas y servicios',
              'Comunicación sobre sus citas',
              'Facturación y pago',
              'Garantía de calidad y garantía'
            ]
          },
          
          subsection2: {
            title: '4.2 Servicio al Cliente',
            items: [
              'Responder preguntas',
              'Procesar quejas',
              'Atención y soporte postventa'
            ]
          },
          
          subsection3: {
            title: '4.3 Marketing (con consentimiento)',
            items: [
              'Envío de boletines',
              'Comunicar promociones y ofertas',
              'Investigación de mercado aislada'
            ]
          },
          
          subsection4: {
            title: '4.4 Obligaciones legales',
            items: [
              'Declaraciones de impuestos',
              'Obligaciones administrativas',
              'Procedimientos legales'
            ]
          }
        },
        
        section5: {
          title: '5. Base legal para el tratamiento',
          intro: 'Procesamos sus datos sobre la base de:',
          items: [
            '<strong>Contrato:</strong> Para la ejecución de nuestros servicios',
            '<strong>Obligación legal:</strong> Para impuestos y administración',
            '<strong>Interés legítimo:</strong> Para operaciones comerciales y prevención de fraude',
            '<strong>Consentimiento:</strong> Para actividades de marketing'
          ]
        },
        
        section6: {
          title: '6. Plazos de conservación',
          intro: 'No conservamos sus datos durante más tiempo del necesario:',
          items: [
            '<strong>Datos de clientes:</strong> 7 años después de la última transacción (ley fiscal)',
            '<strong>Datos de facturas:</strong> 7 años (ley fiscal)',
            '<strong>Datos de marketing:</strong> Hasta la cancelación o 2 años después de la última interacción',
            '<strong>Registros del sitio web:</strong> 1 año',
            '<strong>Cookies:</strong> Vea política de cookies'
          ]
        },
        
        section7: {
          title: '7. Compartición de datos',
          intro: 'Solo compartimos sus datos con:',
          items: [
            'Proveedores de servicios IT (alojamiento, email, software)',
            'Software de contabilidad y contables',
            'Proveedores de pago',
            'Agencias gubernamentales cuando sea legalmente requerido'
          ],
          outro: 'Todos nuestros procesadores están obligados por acuerdos de procesamiento y solo pueden usar sus datos para el propósito acordado.'
        },
        
        section8: {
          title: '8. Seguridad',
          intro: 'Tomamos medidas técnicas y organizativas apropiadas para proteger sus datos:',
          items: [
            'Cifrado de datos (SSL/TLS)',
            'Control de acceso y autenticación',
            'Copias de seguridad regulares',
            'Software de seguridad y cortafuegos',
            'Capacitación de empleados sobre privacidad'
          ]
        },
        
        section9: {
          title: '9. Sus derechos',
          intro: 'Usted tiene los siguientes derechos bajo el RGPD:',
          items: [
            '<strong>Derecho de acceso:</strong> Ver qué datos tenemos sobre usted',
            '<strong>Derecho a la rectificación:</strong> Corrección de datos incorrectos',
            '<strong>Derecho al olvido:</strong> Eliminación de sus datos (bajo condiciones)',
            '<strong>Derecho a la limitación:</strong> Limitación del tratamiento',
            '<strong>Derecho a la portabilidad:</strong> Transferencia de sus datos',
            '<strong>Derecho de oposición:</strong> Oponerse al tratamiento',
            '<strong>Derecho a retirar:</strong> Retirar el consentimiento'
          ]
        },
        
        section10: {
          title: '10. Cookies',
          content: 'Usamos cookies para una experiencia óptima del sitio web. Vea nuestra <a href="/politica-cookies">política de cookies</a> para más información.'
        },
        
        section11: {
          title: '11. Contacto',
          intro: 'Para preguntas sobre esta política de privacidad o sus derechos, puede contactar:',
          contact: 'Spectra AutoArt<br>Email: privacy@spectraautoart.nl<br>Teléfono: +31 6 12345678',
          authority: 'También tiene derecho a presentar una queja ante la Autoridad de Protección de Datos:',
          authorityAddress: 'Autoridad de Protección de Datos<br>Apartado de Correos 93374<br>2509 AJ La Haya<br>Tel: 088 - 1805 250'
        }
      }
    }
  },
  pl: {
    translation: {
      title: 'Spectra AutoArt',
      subtitle: 'Premium Auto Detailing\n& Styling',
      bookNow: 'Umów wizytę',
      ourServices: 'Nasze Usługi',
      aboutUs: 'O Nas',
      aboutUsTitle: 'O Nas',
      aboutUsDescription: 'Spectra AutoArt to Twój premium partner w dziedzinie auto detailingu i stylizacji. Z wieloletnim doświadczeniem i pasją do perfekcji oferujemy wysokiej jakości usługi, które przekształcą Twój pojazd w prawdziwe dzieło sztuki. Nasz zespół wyspecjalizowanych profesjonalistów używa tylko najlepszych produktów i technik, aby dostarczyć wyjątkowe rezultaty. Wierzymy w jakość, dbałość o szczegóły i zadowolenie klienta, które przekracza Twoje oczekiwania.',
      gallery: 'Galeria',
      // Gallery translations
      galleryPage: {
        title: 'Galeria',
        subtitle: 'Zobacz naszą premium pracę detailingu samochodów',
        categories: {
          all: 'Wszystko',
          'detailing-interior': 'Interieur Detailing',
          'detailing-exterior': 'Exterieur Detailing',
          'ambient-lights': 'Ambient Verlichting',
          'starlight-ceiling': 'Sterrenhemel Plafond',
          'chrome-delete': 'Chrome Delete',
          'trim-wrapping': 'Trim Wrapping',
          'polish-auto': 'Auto Polijsten',
          'ceramic-protection': 'Keramische Bescherming',
          'before-after': 'Voor & Na'
        },
        fallback: {
          premiumDetailing: 'Premium Detailing',
          completeDetailing: 'Kompletny Detailing',
          chromeDelete: 'Chrome Delete',
          chromeTransformation: 'Transformacja Chrome',
          interiorDetail: 'Detal Wewnętrzny',
          interiorCleaning: 'Czyszczenie Wewnętrzne',
          exteriorPolish: 'Polerowanie Zewnętrzne',
          paintCorrection: 'Korekta Lakieru'
        }
      },
      testimonials: 'Opinie',
      servicesPage: {
        fromPrice: 'Od',
        minimumPrice: 'Cena minimalna'
      },
      contact: 'Kontakt',
      selectLanguage: 'Wybierz Język',
      vehicleBrand: 'Marka',
      vehicleModel: 'Model',
      vehicleType: 'Typ',
      vehicleBody: 'Nadwozie',
      selectService: 'Wybierz Usługę',
      personalDetails: 'Dane Osobowe',
      selectDate: 'Wybierz Datę',
      name: 'Imię',
      email: 'Email',
      phone: 'Telefon',
      newsletter: 'Newsletter',
      next: 'Dalej',
      back: 'Wstecz',
      confirm: 'Potwierdź',
      summary: 'Podsumowanie',
      total: 'Razem',
      dateUnavailable: 'Ta data jest niedostępna',
      bookingConfirmed: 'Wizyta potwierdzona!',
      subscribeNewsletter: 'Zapisz się do naszego newslettera',
      send: 'Wyślij',
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      chat: 'Czat',
      adminPanel: 'Panel Admina',
      login: 'Zaloguj się',
      password: 'Hasło',
      logout: 'Wyloguj się',
      dashboard: 'Panel',
      bookings: 'Rezerwacje',
      services: 'Usługi',
      galleryAdmin: 'Galeria',
      newsletterSubscribers: 'Subskrybenci Newslettera',
      addService: 'Dodaj Usługę',
      editService: 'Edytuj Usługę',
      serviceName: 'Nazwa Usługi',
      serviceDescription: 'Opis Usługi',
      servicePrice: 'Cena Usługi',
      save: 'Zapisz',
      cancel: 'Anuluj',
      delete: 'Usuń',
      areYouSure: 'Jesteś pewny?',
      serviceAdded: 'Usługa dodana!',
      serviceUpdated: 'Usługa zaktualizowana!',
      serviceDeleted: 'Usługa usunięta!',
      errorLoadingServices: 'Błąd podczas ładowania usług',
      errorSavingService: 'Błąd podczas zapisywania usługi',
      contactRequests: 'Prośby o Kontakt',
      nameRequired: 'Imię jest wymagane',
      emailRequired: 'Email jest wymagany',
      phoneRequired: 'Telefon jest wymagany',
      serviceRequired: 'Usługa jest wymagana',
      dateRequired: 'Data jest wymagana',
      sendToSubscribers: 'Wyślij do subskrybentów',
      subscribers: 'Subskrybenci',
      forgotPassword: 'Zapomniałeś hasła?',
      loggingIn: 'Logowanie...',
      home: 'Strona główna',
      loading: 'Ładowanie...',
      pleaseEnter: 'Proszę wprowadź',
      imageAdded: 'Obraz dodany!',
      failedToAddImage: 'Nie udało się dodać obrazu',
      imageDeleted: 'Obraz usunięty!',
      failedToDeleteImage: 'Nie udało się usunąć obrazu',
      areYouSureDeleteImage: 'Czy na pewno chcesz usunąć ten obraz?',
      pleaseEnterNewsletterSubject: 'Proszę wprowadź temat newslettera',
      pleaseEnterNewsletterContent: 'Proszę wprowadź treść newslettera (tekst lub HTML)',
      newsletterSentSuccessfully: 'Newsletter wysłany pomyślnie!',
      failedToSendNewsletter: 'Nie udało się wysłać newslettera',
      sendNewsletterToCountSubscribers: 'Wysłać newsletter do {{count}} subskrybentów?',
      newsletterManagement: 'Zarządzanie Newsletterem',
      subjectRequired: 'Temat *',
      textContentForEmailClients: 'Treść Tekstowa (dla klientów email którzy nie obsługują HTML)',
      htmlContentOptional: 'Treść HTML (opcjonalna - zostanie wygenerowana z tekstu jeśli pusta)',
      sendingDots: 'Wysyłanie...',
      sendToCountSubscribers: 'Wyślij do {{count}} subskrybentów',
      subscribersList: 'Lista Subskrybentów',
      subscribersCount: 'Subskrybenci ({{count}})',
      loginFailed: 'Logowanie nieudane. Sprawdź swoje dane logowania.',
      defaultAdminCredentials: 'Domyślne dane logowania admina:\nEmail: admin@spectra.com\nHasło: admin123\n\nUżyj tych danych do zalogowania się.',

      failedToUpdateImageStatus: 'Nie udało się zaktualizować statusu obrazu',
      imageStatusUpdated: 'Status obrazu zaktualizowany!',
      imageNotFound: 'Nie znaleziono obrazu',
      imageUrlPlaceholder: 'https://przyklad.pl/obraz.jpg',
      enterNewsletterSubjectPlaceholder: 'Wprowadź temat newslettera...',
      enterPlainTextContentPlaceholder: 'Wprowadź treść tekstową...',
      enterHtmlContentPlaceholder: 'Wprowadź treść HTML...',
      vehicleServicesManagement: 'Zarządzanie Usługami Pojazdów',
      addVehicleService: 'Dodaj Usługę Pojazdu',
      editVehicleService: 'Edytuj Usługę Pojazdu',
      manageBodyTypes: 'Zarządzaj Typami Nadwozia',
      addBodyType: 'Dodaj Typ Nadwozia',
      editBodyType: 'Edytuj Typ Nadwozia',
      bodyType: 'Typ Nadwozia',
      bodyTypes: 'Typy Nadwozia',
      servicePrices: 'Ceny Usług',
      priceForBodyType: 'Cena dla {{bodyType}}',
      areYouSureDeleteVehicleService: 'Czy na pewno chcesz usunąć tę usługę pojazdu?',
      areYouSureDeleteBodyType: 'Czy na pewno chcesz usunąć ten typ nadwozia?',
      errorLoadingVehicleServices: 'Błąd podczas ładowania usług pojazdów',
      errorLoadingBodyTypes: 'Błąd podczas ładowania typów nadwozia',
      errorSavingVehicleService: 'Błąd podczas zapisywania usługi pojazdu: {{message}}',
      errorSavingBodyType: 'Błąd podczas zapisywania typu nadwozia: {{message}}',
      vehicleServiceAdded: 'Usługa pojazdu dodana!',
      vehicleServiceUpdated: 'Usługa pojazdu zaktualizowana!',
      vehicleServiceDeleted: 'Usługa pojazdu usunięta!',
      bodyTypeAdded: 'Typ nadwozia dodany!',
      bodyTypeUpdated: 'Typ nadwozia zaktualizowany!',
      bodyTypeDeleted: 'Typ nadwozia usunięty!',
      
      // Contact page translations
      contactPage: {
        title: 'Skontaktuj się z Nami',
        subtitle: 'Jesteśmy tutaj, aby pomóc Ci we wszystkich potrzebach związanych z detailingiem i stylizacją samochodów',
        address: 'Adres',
        phone: 'Telefon',
        email: 'Email',
        hours: 'Godziny Otwarcia',
        hoursText: 'Poniedziałek - Piątek: 9:00 - 18:00\nSobota: 9:00 - 16:00\nNiedziela: Zamknięte',
        name: 'Imię',
        subject: 'Temat',
        message: 'Wiadomość',
        send: 'Wyślij',
        sending: 'Wysyłanie...',
        selectSubject: 'Wybierz temat',
        generalInquiry: 'Zapytanie Ogólne',
        bookingInquiry: 'Zapytanie o Rezerwację',
        servicesInquiry: 'Zapytanie o Usługi',
        pricingInquiry: 'Zapytanie o Ceny',
        other: 'Inne',
        messagePlaceholder: 'Wpisz swoją wiadomość tutaj...',
        successTitle: 'Wiadomość Wysłana!',
        successMessage: 'Dziękujemy za Twoją wiadomość. Skontaktujemy się z Tobą tak szybko, jak to możliwe.',
        errorSending: 'Błąd podczas wysyłania wiadomości. Spróbuj ponownie.',
        mapBlockedTitle: 'Mapa Zablokowana',
        mapBlockedMessage: 'Mapa nie mogła zostać załadowana. Może to być spowodowane blokadą reklam. Wyłącz blokadę reklam dla tej strony lub znajdź naszą lokalizację poniżej.',
        ourLocation: 'Nasza Lokalizacja',
        addressText: 'Centrum Miasta Tilburg',
        openInGoogleMaps: 'Otwórz w Google Maps'
      },
      
      // Chatbot translations
      chatbot: {
        title: 'Asystent Czatu',
        welcome: 'Cześć! Jak mogę Ci dziś pomóc?',
        prices: 'Ceny',
        bookings: 'Rezerwacje',
        services: 'Usługi',
        hours: 'Godziny',
        pricesResponse: 'Aby uzyskać informacje o cenach, najlepiej umówić się na bezpłatną konsultację.',
        bookingsResponse: 'Możesz łatwo zarezerwować online przez naszą stronę internetową!',
        servicesResponse: 'Oferujemy różne usługi detailingu i stylizacji. Sprawdź naszą stronę internetową, aby uzyskać więcej informacji.',
        hoursResponse: 'Jesteśmy otwarci od poniedziałku do piątku od 9:00 do 18:00 i w soboty od 9:00 do 16:00.'
      },
      
      // Footer translations
      footer: {
        terms: 'Regulamin',
        privacy: 'Polityka Prywatności',
        cookies: 'Polityka Cookies',
        contact: 'Kontakt i Prawne',
        gdpr: 'GDPR'
      },
      
      // Terms and Conditions page translations
      termsConditions: {
        title: 'Regulamin',
        lastUpdated: 'Ostatnia aktualizacja: 27 listopada 2025',
        
        section1: {
          title: '1. Postanowienia Ogólne',
          content: 'Niniejszy regulamin ma zastosowanie do wszystkich usług oferowanych przez Spectra AutoArt, z siedzibą w Tilburgu. Korzystając z naszych usług, akceptujesz niniejsze warunki.'
        },
        
        section2: {
          title: '2. Usługi',
          content: 'Spectra AutoArt oferuje premium auto detailing i usługi stylizacji, w tym: Detailing wnętrza i zewnątrz Montaż oświetlenia ambientowego Montaż sufitu z gwiazdami Renowacja podsufitki Usługi usuwania chromu Oklejanie elementów trim Polerowanie samochodów Ceramiczna powłoka ochronna'
        },
        
        section3: {
          title: '3. Wizyty i Anulowanie',
          content: '3.1 Wizyty mogą być umówione online przez naszą stronę internetową lub telefonicznie. 3.2 Aby anulować wizytę, należy skontaktować się co najmniej 24 godziny wcześniej. W przypadku późnego anulowania zastrzegamy sobie prawo do pobrania 50% kosztów usługi. 3.3 W przypadku niepojawienia się bez anulowania (no-show) zostanie pobrana pełna kwota zarezerwowanej usługi.'
        },
        
        section4: {
          title: '4. Ceny i Płatność',
          content: '4.1 Wszystkie ceny zawierają VAT, chyba że podano inaczej. 4.2 Płatność następuje po wykonaniu usługi, chyba że uzgodniono inaczej. 4.3 Akceptujemy płatność gotówką, kartą i przelewem bankowym. 4.4 Ceny mogą ulec zmianie bez powiadomienia. Cena obowiązująca w momencie rezerwacji jest wiążąca.'
        },
        
        section5: {
          title: '5. Gwarancja i Reklamacje',
          content: '5.1 Spectra AutoArt udziela gwarancji na jakość swoich prac przez 30 dni od wykonania, z wyłączeniem normalnego zużycia. 5.2 Reklamacje muszą być zgłoszone na piśmie w ciągu 7 dni od wykonania usługi. 5.3 Zastrzegamy sobie prawo do zbadania reklamacji i zaoferowania odpowiednich rozwiązań, w tym napraw lub częściowego zwrotu kosztów.'
        },
        
        section6: {
          title: '6. Odpowiedzialność',
          content: '6.1 Spectra AutoArt ponosi odpowiedzialność za szkody powstałe podczas wykonywania naszych usług, do maksymalnej wysokości wartości faktury za daną usługę. 6.2 Nie ponosimy odpowiedzialności za: Szkody spowodowane istniejącymi wadami pojazdu Szkody powstałe w wyniku ekstremalnych warunków pogodowych po wykonaniu usłuby Utratę wartości pojazdu Pośrednie szkody lub szkody wynikowe'
        },
        
        section7: {
          title: '7. Przekazywanie Pojazdu',
          content: '7.1 Podczas przekazywania pojazdu przeprowadzana jest inspekcja i notowane są ewentualne istniejące uszkodzenia. 7.2 Rzeczy osobiste muszą być usunięte wcześniej. Spectra AutoArt nie ponosi odpowiedzialności za zgubione lub uszkodzone przedmioty osobiste. 7.3 Pojazd musi być dostarczony i odebrany w umówionym terminie. W przypadku późnego odbioru mogą być pobrane dodatkowe opłaty.'
        },
        
        section8: {
          title: '8. Własność Intelektualna',
          content: 'Wszystkie zdjęcia, teksty i inne treści na naszej stronie internetowej i materiałach marketingowych są własnością Spectra AutoArt i nie mogą być używane bez zgody.'
        },
        
        section9: {
          title: '9. Prywatność i Ochrona Danych',
          content: 'Traktujemy Twoje dane osobowe poufnie zgodnie z naszą polityką prywatności i Ogólnym Rozporządzeniem o Ochronie Danych (RODO).'
        },
        
        section10: {
          title: '10. Zmiany w Regulaminie',
          content: 'Spectra AutoArt zastrzega sobie prawo do zmiany niniejszego regulaminu. Zmiany będą publikowane na naszej stronie internetowej.'
        },
        
        section11: {
          title: '11. Prawo Właściwe',
          content: 'Niniejszy regulamin podlega prawu holenderskiemu. Spory będą rozpatrywane przez właściwy sąd w Tilburgu.'
        },
        
        contact: {
          title: 'Kontakt',
          content: 'Masz pytania dotyczące niniejszego regulaminu? Skontaktuj się z nami: Spectra AutoArt Tilburg Centrum Miasta Email: spectraautoart@gmail.com Telefon: 0031685300906'
        }
      },
      
      // Privacy Policy page translations
      privacyPolicy: {
        title: 'Polityka Prywatności',
        lastUpdated: 'Ostatnia aktualizacja: 27 listopada 2025',
        
        section1: {
          title: '1. Wprowadzenie',
          content: 'W Spectra AutoArt przywiązujemy dużą wagę do Twojej prywatności i ochrony Twoich danych osobowych. Niniejsza polityka prywatności opisuje, jak postępujemy z Twoimi danymi osobowymi zgodnie z Ogólnym Rozporządzeniem o Ochronie Danych (RODO).'
        },
        
        section2: {
          title: '2. Administrator Danych',
          content: 'Spectra AutoArt<br>Z siedzibą w Tilburgu<br>Numer KRS: [do zarejestrowania]<br>Email: privacy@spectraautoart.nl'
        },
        
        section3: {
          title: '3. Jakie dane zbieramy?',
          intro: 'Zbieramy następujące kategorie danych osobowych:',
          
          subsection1: {
            title: '3.1 Dane Kontaktowe',
            items: [
              'Imię i nazwisko',
              'Adres email',
              'Numer telefonu',
              'Dane adresowe'
            ]
          },
          
          subsection2: {
            title: '3.2 Dane Pojazdu',
            items: [
              'Numer rejestracyjny',
              'Marka i model pojazdu',
              'Rok produkcji',
              'Typ nadwozia'
            ]
          },
          
          subsection3: {
            title: '3.3 Dane Świadczenia Usług',
            items: [
              'Zarezerwowane usługi',
              'Dane spotkań',
              'Dane płatności',
              'Historia usług'
            ]
          },
          
          subsection4: {
            title: '3.4 Korzystanie ze Strony Internetowej',
            items: [
              'Adres IP',
              'Informacje o przeglądarce',
              'Pliki cookie (zobacz naszą politykę cookies)',
              'Zachowanie podczas wizyty na naszej stronie internetowej'
            ]
          }
        },
        
        section4: {
          title: '4. Cele przetwarzania danych',
          intro: 'Przetwarzamy Twoje dane w następujących celach:',
          
          subsection1: {
            title: '4.1 Świadczenie Usług',
            items: [
              'Realizacja spotkań i usług',
              'Komunikacja o Twoich spotkaniach',
              'Fakturowanie i płatność',
              'Zapewnienie jakości i gwarancja'
            ]
          },
          
          subsection2: {
            title: '4.2 Obsługa Klienta',
            items: [
              'Odpowiadanie na pytania',
              'Przetwarzanie reklamacji',
              'Pogwarancyjna opieka i wsparcie'
            ]
          },
          
          subsection3: {
            title: '4.3 Marketing (za zgodą)',
            items: [
              'Wysyłanie newsletterów',
              'Komunikowanie promocji i ofert',
              'Izolowane badania rynku'
            ]
          },
          
          subsection4: {
            title: '4.4 Obowiązki prawne',
            items: [
              'Deklaracje podatkowe',
              'Obowiązki administracyjne',
              'Procedury prawne'
            ]
          }
        },
        
        section5: {
          title: '5. Podstawa prawna przetwarzania',
          intro: 'Przetwarzamy Twoje dane na podstawie:',
          items: [
            '<strong>Umowy:</strong> Dla wykonania naszych usług',
            '<strong>Obowiązku prawnego:</strong> Dla podatków i administracji',
            '<strong>Uzasadnionego interesu:</strong> Dla działalności biznesowej i zapobiegania oszustwom',
            '<strong>Zgody:</strong> Dla działań marketingowych'
          ]
        },
        
        section6: {
          title: '6. Okresy przechowywania',
          intro: 'Nie przechowujemy Twoich danych dłużej niż to konieczne:',
          items: [
            '<strong>Dane klientów:</strong> 7 lat po ostatniej transakcji (prawo podatkowe)',
            '<strong>Dane faktur:</strong> 7 lat (prawo podatkowe)',
            '<strong>Dane marketingowe:</strong> Do wypisania się lub 2 lata po ostatniej interakcji',
            '<strong>Logi strony internetowej:</strong> 1 rok',
            '<strong>Pliki cookie:</strong> Zobacz politykę cookies'
          ]
        },
        
        section7: {
          title: '7. Udostępnianie danych',
          intro: 'Udostępniamy Twoje dane tylko:',
          items: [
            'Dostawcom usług IT (hosting, email, oprogramowanie)',
            'Oprogramowaniu księgowemu i księgowym',
            'Dostawcom płatności',
            'Agencjom rządowym, gdy jest to wymagane prawnie'
          ],
          outro: 'Wszyscy nasi procesorzy są związani umowami powierzenia przetwarzania danych i mogą używać Twoich danych tylko do uzgodnionego celu.'
        },
        
        section8: {
          title: '8. Bezpieczeństwo',
          intro: 'Podejmujemy odpowiednie środki techniczne i organizacyjne, aby zabezpieczyć Twoje dane:',
          items: [
            'Szyfrowanie danych (SSL/TLS)',
            'Kontrola dostępu i uwierzytelnianie',
            'Regularne kopie zapasowe',
            'Oprogramowanie bezpieczeństwa i firewalle',
            'Szkolenia pracowników o prywatności'
          ]
        },
        
        section9: {
          title: '9. Twoje prawa',
          intro: 'Masz następujące prawa zgodnie z RODO:',
          items: [
            '<strong>Prawo dostępu:</strong> Przegląd danych, które mamy na Twój temat',
            '<strong>Prawo do sprostowania:</strong> Poprawa nieprawidłowych danych',
            '<strong>Prawo do usunięcia:</strong> Usunięcie Twoich danych (pod pewnymi warunkami)',
            '<strong>Prawo do ograniczenia:</strong> Ograniczenie przetwarzania',
            '<strong>Prawo do przenoszenia:</strong> Przeniesienie Twoich danych',
            '<strong>Prawo sprzeciwu:</strong> Wniesienie sprzeciwu wobec przetwarzania',
            '<strong>Prawo do wycofania:</strong> Wycofanie zgody'
          ]
        },
        
        section10: {
          title: '10. Pliki cookie',
          content: 'Używamy plików cookie dla optymalnego doświadczenia na stronie internetowej. Zobacz naszą <a href="/polityka-cookies">politykę cookies</a> dla więcej informacji.'
        },
        
        section11: {
          title: '11. Kontakt',
          intro: 'W przypadku pytań o niniejszą politykę prywatności lub Twoje prawa, możesz się z nami skontaktować:',
          contact: 'Spectra AutoArt<br>Email: privacy@spectraautoart.nl<br>Telefon: +31 6 12345678',
          authority: 'Masz również prawo złożyć skargę do Urzędu Ochrony Danych Osobowych:',
          authorityAddress: 'Urząd Ochrony Danych Osobowych<br>Skrytka pocztowa 93374<br>2509 AJ Haga<br>Tel: 088 - 1805 250'
        }
      }
    }
  },
  ro: {
    translation: {
      title: 'Spectra AutoArt',
      subtitle: 'Premium Auto Detailing\n& Styling',
      bookNow: 'Programează Acum',
      ourServices: 'Serviciile Noastre',
      aboutUs: 'Despre Noi',
      aboutUsTitle: 'Despre Noi',
      aboutUsDescription: 'Spectra AutoArt este partenerul tău premium pentru detailing și styling auto. Cu ani de experiență și pasiune pentru perfecțiune, oferim servicii de înaltă calitate care transformă vehiculul tău într-un adevărat spectacol. Echipa noastră de profesioniști specializați folosește doar cele mai bune produse și tehnici pentru a oferi rezultate excepționale. Credem în calitate, atenție la detalii și satisfacția clienților care depășește așteptările tale.',
      gallery: 'Galerie',
      // Gallery translations
      galleryPage: {
        title: 'Galerie',
        subtitle: 'Vezi lucrările noastre premium de detailing auto',
        categories: {
          all: 'Tot',
          'detailing-interior': 'Detailing Interior',
          'detailing-exterior': 'Detailing Exterior',
          'ambient-lights': 'Lumini Ambientale',
          'starlight-ceiling': 'Plafon Înstelat',
          'chrome-delete': 'Chrome Delete',
          'trim-wrapping': 'Colantare Trimuri',
          'polish-auto': 'Polish Auto',
          'ceramic-protection': 'Protecție Ceramică',
          'before-after': 'Înainte și După'
        },
        fallback: {
          premiumDetailing: 'Premium Detailing',
          completeDetailing: 'Detailing Complet',
          chromeDelete: 'Chrome Delete',
          chromeTransformation: 'Transformare Chrome',
          interiorDetail: 'Detaliu Interior',
          interiorCleaning: 'Curățare Interior',
          exteriorPolish: 'Polish Exterior',
          paintCorrection: 'Corecție Vopsea'
        }
      },
      testimonials: 'Testimoniale',
      servicesPage: {
        fromPrice: 'De la',
        minimumPrice: 'Preț minim'
      },
      contact: 'Contact',
      selectLanguage: 'Selectează Limba',
      vehicleBrand: 'Marcă',
      vehicleModel: 'Model',
      vehicleType: 'Tip',
      vehicleBody: 'Caroserie',
      selectService: 'Selectează Serviciu',
      selectTime: 'Selectează Ora',
      service: 'Serviciu',
      personalDetails: 'Detalii Personale',
      selectDate: 'Selectează Data',
      name: 'Nume',
      email: 'Email',
      phone: 'Telefon',
      newsletter: 'Newsletter',
      next: 'Următorul',
      back: 'Înapoi',
      confirm: 'Confirmă',
      summary: 'Rezumat',
      total: 'Total',
      dateUnavailable: 'Această dată nu este disponibilă',
      bookingConfirmed: 'Programare Confirmată!',
      subscribeNewsletter: 'Abonează-te la newsletter-ul nostru',
      send: 'Trimite',
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      chat: 'Chat',
      adminPanel: 'Panou Admin',
      login: 'Autentificare',
      password: 'Parolă',
      logout: 'Deconectare',
      dashboard: 'Panou',
      bookings: 'Programări',
      services: 'Servicii',
      galleryAdmin: 'Galerie',
      newsletterSubscribers: 'Abonați Newsletter',
      addService: 'Adaugă Serviciu',
      editService: 'Editează Serviciu',
      serviceName: 'Nume Serviciu',
      serviceDescription: 'Descriere Serviciu',
      servicePrice: 'Preț Serviciu',
      save: 'Salvează',
      cancel: 'Anulează',
      delete: 'Șterge',
      areYouSure: 'Ești sigur?',
      serviceAdded: 'Serviciu adăugat!',
      serviceUpdated: 'Serviciu actualizat!',
      serviceDeleted: 'Serviciu șters!',

      errorSavingService: 'Eroare la salvarea serviciului',
      contactRequests: 'Cereri Contact',
      nameRequired: 'Numele este obligatoriu',
      emailRequired: 'Emailul este obligatoriu',
      phoneRequired: 'Telefonul este obligatoriu',
      serviceRequired: 'Serviciul este obligatoriu',
      dateRequired: 'Data este obligatorie',
      sendToSubscribers: 'Trimite la abonați',
      subscribers: 'Abonați',
      forgotPassword: 'Ai uitat parola?',
      loggingIn: 'Se autentifică...',
      home: 'Acasă',
      loading: 'Se încarcă...',
      pleaseEnter: 'Vă rugăm introduceți',
      imageAdded: 'Imagine adăugată!',
      failedToAddImage: 'Adăugarea imaginii a eșuat',
      imageDeleted: 'Imagine ștearsă!',
      failedToDeleteImage: 'Ștergerea imaginii a eșuat',
      areYouSureDeleteImage: 'Sunteți sigur că doriți să ștergeți această imagine?',
      pleaseEnterNewsletterSubject: 'Vă rugăm introduceți un subiect pentru newsletter',
      pleaseEnterNewsletterContent: 'Vă rugăm introduceți conținut pentru newsletter (text sau HTML)',
      newsletterSentSuccessfully: 'Newsletter trimis cu succes!',
      failedToSendNewsletter: 'Trimiterea newsletter-ului a eșuat',
      sendNewsletterToCountSubscribers: 'Trimiteți newsletter la {{count}} abonați?',
      newsletterManagement: 'Gestionare Newsletter',
      subjectRequired: 'Subiect *',
      textContentForEmailClients: 'Conținut Text (pentru clienți email care nu suportă HTML)',
      htmlContentOptional: 'Conținut HTML (opțional - va fi generat din text dacă este gol)',
      sendingDots: 'Se trimite...',
      sendToCountSubscribers: 'Trimite la {{count}} abonați',
      subscribersList: 'Listă Abonați',
      subscribersCount: 'Abonați ({{count}})',



      failedToUpdateImageStatus: 'Actualizarea statusului imaginii a eșuat',
      imageStatusUpdated: 'Statusul imaginii a fost actualizat!',
      imageNotFound: 'Imaginea nu a fost găsită',
      imageUrlPlaceholder: 'https://exemplu.ro/imagine.jpg',
      enterNewsletterSubjectPlaceholder: 'Introduceți subiect newsletter...',
      enterPlainTextContentPlaceholder: 'Introduceți conținut text simplu...',
      enterHtmlContentPlaceholder: 'Introduceți conținut HTML...',
      vehicleServicesManagement: 'Gestionare Servicii Vehicule',
      addVehicleService: 'Adaugă Serviciu Vehicul',
      editVehicleService: 'Editează Serviciu Vehicul',
      manageBodyTypes: 'Gestionare Tipuri Caroserie',
      addBodyType: 'Adaugă Tip Caroserie',
      editBodyType: 'Editează Tip Caroserie',
      bodyType: 'Tip Caroserie',
      bodyTypes: 'Tipuri Caroserie',
      servicePrices: 'Prețuri Servicii',
      priceForBodyType: 'Preț pentru {{bodyType}}',
      areYouSureDeleteVehicleService: 'Sunteți sigur că doriți să ștergeți acest serviciu de vehicul?',
      areYouSureDeleteBodyType: 'Sunteți sigur că doriți să ștergeți acest tip de caroserie?',
      errorLoadingVehicleServices: 'Eroare la încărcarea serviciilor de vehicule',
      errorLoadingBodyTypes: 'Eroare la încărcarea tipurilor de caroserie',
      errorSavingVehicleService: 'Eroare la salvarea serviciului de vehicul: {{message}}',
      errorSavingBodyType: 'Eroare la salvarea tipului de caroserie: {{message}}',
      vehicleServiceAdded: 'Serviciu vehicul adăugat!',
      vehicleServiceUpdated: 'Serviciu vehicul actualizat!',
      vehicleServiceDeleted: 'Serviciu vehicul șters!',
      bodyTypeAdded: 'Tip caroserie adăugat!',
      bodyTypeUpdated: 'Tip caroserie actualizat!',
      bodyTypeDeleted: 'Tip caroserie șters!',
      
      // Additional admin translations
      totalBookings: 'Total Programări',
      pendingBookings: 'Programări în Așteptare',
      totalServices: 'Total Servicii',
      bookingsManagement: 'Gestionare Programări',
      loadingBookings: 'Se încarcă programările...',
      date: 'Data',
      pending: 'În Așteptare',
      confirmed: 'Confirmat',
      cancelled: 'Anulat',
      areYouSureDeleteBooking: 'Sunteți sigur că doriți să ștergeți această programare?',
      servicesManagement: 'Gestionare Servicii',
      description: 'Descriere',
      price: 'Preț',
      areYouSureDeleteService: 'Sunteți sigur că doriți să ștergeți acest serviciu?',
      serviceCreated: 'Serviciu creat!',

      
      // Vehicle services
      basicInfo: 'Informații de Bază',
      category: 'Categorie',
      durationMinutes: 'Durată (minute)',
      duration: 'Durată',
      minutes: 'minute',
      prices: 'Prețuri',
      active: 'Activ',
      inactive: 'Inactiv',
      edit: 'Editează',
      key: 'Cheie',
      sortOrder: 'Ordine Sortare',
      
      // Gallery management
      addNewImage: 'Adaugă Imagine Nouă',
      imageUrl: 'URL Imagine',
      altText: 'Text Alternativ',
      categoryGeneral: 'General',
      categoryBeforeAfter: 'Înainte/După',
      categoryServices: 'Servicii',
      categoryTestimonials: 'Testimoniale',
      
      // Newsletter management
      subject: 'Subiect',
      textContent: 'Conținut Text',
      htmlContent: 'Conținut HTML',
      sendNewsletter: 'Trimite Newsletter',
      sending: 'Se trimite...',
      
      // Error messages
      errorDeletingService: 'Eroare la ștergerea serviciului',
      errorDeletingVehicleService: 'Eroare la ștergerea serviciului de vehicul',
      errorDeletingBodyType: 'Eroare la ștergerea tipului de caroserie',
      errorLoadingBookings: 'Eroare la încărcarea programărilor',
      errorLoadingServices: 'Eroare la încărcarea serviciilor',
      errorLoadingGallery: 'Eroare la încărcarea galeriei',
      errorLoadingSubscribers: 'Eroare la încărcarea abonaților',
      errorSendingNewsletter: 'Eroare la trimiterea newsletter-ului',
      
      // Success messages
      bookingDeleted: 'Programare ștearsă!',
      newsletterSent: 'Newsletter trimis cu succes!',
      subscriberAdded: 'Abonat adăugat!',
      subscriberRemoved: 'Abonat eliminat!',
      
      // Form placeholders
      enterServiceName: 'Introduceți numele serviciului...',
      enterServiceDescription: 'Introduceți descrierea serviciului...',
      enterServicePrice: 'Introduceți prețul serviciului...',
      enterCategory: 'Introduceți categoria...',
      enterDuration: 'Introduceți durata în minute...',
      enterKey: 'Introduceți cheia...',
      enterBodyTypeName: 'Introduceți numele tipului de caroserie...',
      enterBodyTypeDescription: 'Introduceți descrierea tipului de caroserie...',
      enterSortOrder: 'Introduceți ordinea de sortare...',
      enterImageUrl: 'Introduceți URL imagine...',
      enterAltText: 'Introduceți text alternativ...',
      enterSubject: 'Introduceți subiectul...',
      enterTextContent: 'Introduceți conținutul text...',
      enterHtmlContent: 'Introduceți conținutul HTML...',
      
      // Status messages
      saving: 'Se salvează...',
      deleting: 'Se șterge...',
      updating: 'Se actualizează...',
      
      // Button texts
      add: 'Adaugă',
      close: 'Închide',
      
      // Navigation
      
      // Admin panel
      loginFailed: 'Autentificare eșuată. Vă rugăm verificați datele de autentificare.',
      defaultAdminCredentials: 'Date de autentificare admin implicite:\nEmail: admin@spectra.com\nParolă: admin123\n\nVă rugăm folosiți aceste date pentru autentificare.',
      passwordResetInstructions: 'Dacă ai uitat parola, contactează administratorul sistemului.',
      passwordResetFailed: 'Resetarea parolei a eșuat.',
      
      // Contact page translations
      contactPage: {
        title: 'Contactați-ne',
        subtitle: 'Suntem aici pentru a vă ajuta cu toate nevoile dvs. de detailing și styling auto',
        address: 'Adresă',
        phone: 'Telefon',
        email: 'Email',
        hours: 'Program',
        hoursText: 'Luni - Vineri: 9:00 - 18:00\nSâmbătă: 9:00 - 16:00\nDuminică: Închis',
        name: 'Nume',
        subject: 'Subiect',
        message: 'Mesaj',
        send: 'Trimite',
        sending: 'Se trimite...',
        selectSubject: 'Selectați subiectul',
        generalInquiry: 'Întrebare Generală',
        bookingInquiry: 'Întrebare despre Programare',
        servicesInquiry: 'Întrebare despre Servicii',
        pricingInquiry: 'Întrebare despre Prețuri',
        other: 'Altele',
        messagePlaceholder: 'Tastați mesajul dvs. aici...',
        successTitle: 'Mesaj Trimis!',
        successMessage: 'Vă mulțumim pentru mesaj. Vă vom contacta cât mai curând posibil.',
        errorSending: 'Eroare la trimiterea mesajului. Vă rugăm încercați din nou.',
        mapBlockedTitle: 'Hartă Blocată',
        mapBlockedMessage: 'Harta nu a putut fi încărcată. Acest lucru se poate datora unui blocant de reclame. Dezactivați blocantul de reclame pentru acest site sau găsiți locația noastră mai jos.',
        ourLocation: 'Locația Noastră',
        addressText: 'Centrul Orașului Tilburg',
        openInGoogleMaps: 'Deschide în Google Maps'
      },
      
      // Chatbot translations
      chatbot: {
        title: 'Asistent Chat',
        welcome: 'Bună ziua! Cum vă pot ajuta astăzi?',
        prices: 'Prețuri',
        bookings: 'Programări',
        services: 'Servicii',
        hours: 'Program',
        pricesResponse: 'Pentru informații despre prețuri, cel mai bine este să programați o întâlnire pentru o consultație gratuită.',
        bookingsResponse: 'Vă puteți programa cu ușurință online prin intermediul site-ului nostru web!',
        servicesResponse: 'Oferim diverse servicii de detailing și styling. Verificați site-ul nostru web pentru mai multe detalii.',
        hoursResponse: 'Suntem deschiși de luni până vineri de la 9:00 la 18:00 și sâmbăta de la 9:00 la 16:00.'
      },
      
      // Footer translations
      footer: {
        terms: 'Termeni și Condiții',
        privacy: 'Politica de Confidențialitate',
        cookies: 'Politica Cookies',
        contact: 'Contact și Legal',
        gdpr: 'GDPR'
      },
      
      // Terms and Conditions page translations
      termsConditions: {
        title: 'Termeni și Condiții',
        lastUpdated: 'Ultima actualizare: 27 noiembrie 2025',
        
        section1: {
          title: '1. Dispoziții Generale',
          content: 'Acești termeni și condiții generale se aplică tuturor serviciilor oferite de Spectra AutoArt, cu sediul în Tilburg. Prin utilizarea serviciilor noastre, sunteți de acord cu acești termeni și condiții.'
        },
        
        section2: {
          title: '2. Servicii',
          content: 'Spectra AutoArt oferă servicii premium de detailing și styling auto, inclusiv: Detailing interior și exterior Instalare iluminat ambiental Instalare tavan cu stele Refacerea tavanului Servicii de eliminare crom Înfășurare elemente trim Polish auto Acoperire ceramică de protecție'
        },
        
        section3: {
          title: '3. Programări și Anulări',
          content: '3.1 Programările pot fi făcute online prin intermediul site-ului nostru web sau telefonic. 3.2 Pentru anulări, trebuie să ne contactați cu cel puțin 24 de ore înainte. În cazul anulărilor târzii, ne rezervăm dreptul de a percepe 50% din costurile serviciului. 3.3 În cazul neprezentării fără anulare (no-show), va fi percepută suma completă a serviciului rezervat.'
        },
        
        section4: {
          title: '4. Prețuri și Plată',
          content: '4.1 Toate prețurile includ TVA, cu excepția cazului în care se specifică altfel. 4.2 Plata se face la finalizarea serviciului, cu excepția cazului în care s-a convenit altfel. 4.3 Acceptăm plata numerar, cu cardul și prin transfer bancar. 4.4 Prețurile pot fi modificate fără notificare prealabilă. Prețul valabil în momentul rezervării este obligatoriu.'
        },
        
        section5: {
          title: '5. Garanție și Reclamații',
          content: '5.1 Spectra AutoArt garantează pentru calitatea lucrărilor sale timp de 30 de zile de la finalizare, cu excepția uzurii normale. 5.2 Reclamațiile trebuie raportate în scris în termen de 7 zile de la finalizarea serviciului. 5.3 Ne rezervăm dreptul de a investiga reclamațiile și de a oferi soluții adecvate, inclusiv lucrări de reparație sau rambursări parțiale.'
        },
        
        section6: {
          title: '6. Răspundere',
          content: '6.1 Spectra AutoArt este răspunzător pentru daunele care apar în timpul executării serviciilor noastre, până la o valoare maximă egală cu valoarea facturii pentru serviciul respectiv. 6.2 Nu suntem răspunzători pentru: Daune cauzate de defecte existente ale vehiculului Daune care apar din cauza condițiilor meteo extreme după executarea serviciului Deprecierea valorii vehiculului Daune indirecte sau consecințiale'
        },
        
        section7: {
          title: '7. Predarea Vehiculului',
          content: '7.1 La predarea vehiculului se efectuează o inspecție și se notează eventualele daune existente. 7.2 Obiectele personale trebuie îndepărtate în prealabil. Spectra AutoArt nu este răspunzător pentru obiectele personale pierdute sau deteriorate. 7.3 Vehiculul trebuie predat și ridicat la data și ora programate. În cazul ridicării întârziate pot fi percepute costuri suplimentare.'
        },
        
        section8: {
          title: '8. Proprietate Intelectuală',
          content: 'Toate imaginile, textele și alte conținuturi de pe site-ul nostru web și din materialele de marketing sunt proprietatea Spectra AutoArt și nu pot fi utilizate fără permisiune.'
        },
        
        section9: {
          title: '9. Confidențialitate și Protecția Datelor',
          content: 'Tratăm datele dvs. personale cu confidențialitate, conform politicii noastre de confidențialitate și Regulamentului General privind Protecția Datelor (GDPR).'
        },
        
        section10: {
          title: '10. Modificări ale Termenilor și Condițiilor',
          content: 'Spectra AutoArt își rezervă dreptul de a modifica acești termeni și condiții. Modificările vor fi publicate pe site-ul nostru web.'
        },
        
        section11: {
          title: '11. Legea Aplicabilă',
          content: 'Acești termeni și condiții sunt supuși legii olandeze. Disputele vor fi soluționate de instanța competentă din Tilburg.'
        },
        
        contact: {
          title: 'Contact',
          content: 'Aveți întrebări despre acești termeni și condiții? Contactați-ne: Spectra AutoArt Tilburg Centrul orașului Email: spectraautoart@gmail.com Telefon: 0031685300906'
        }
      },
      
      // Privacy Policy page translations
      privacyPolicy: {
        title: 'Politica de Confidențialitate',
        lastUpdated: 'Ultima actualizare: 27 noiembrie 2025',
        
        section1: {
          title: '1. Introducere',
          content: 'La Spectra AutoArt, acordăm o mare importanță confidențialității dvs. și protejării datelor dvs. personale. Această politică de confidențialitate descrie cum gestionăm datele dvs. personale în conformitate cu Regulamentul General privind Protecția Datelor (GDPR).'
        },
        
        section2: {
          title: '2. Operatorul de date',
          content: 'Spectra AutoArt<br>Situat în Tilburg<br>Număr Cameră de Comerț: [înregistrare în curs]<br>Email: privacy@spectraautoart.nl'
        },
        
        section3: {
          title: '3. Ce date colectăm?',
          intro: 'Colectăm următoarele categorii de date personale:',
          
          subsection1: {
            title: '3.1 Date de contact',
            items: [
              'Nume și prenume',
              'Adresă de email',
              'Număr de telefon',
              'Adresă fizică'
            ]
          },
          
          subsection2: {
            title: '3.2 Date despre vehicul',
            items: [
              'Număr de înmatriculare',
              'Marcă și model vehicul',
              'Anul fabricației',
              'Tip caroserie'
            ]
          },
          
          subsection3: {
            title: '3.3 Date despre servicii',
            items: [
              'Servicii rezervate',
              'Detalii programări',
              'Detalii plată',
              'Istoric servicii'
            ]
          },
          
          subsection4: {
            title: '3.4 Utilizare website',
            items: [
              'Adresă IP',
              'Informații browser',
              'Cookie-uri (vezi politica noastră de cookie-uri)',
              'Comportament vizitatori pe website-ul nostru'
            ]
          }
        },
        
        section4: {
          title: '4. Scopuri ale procesării datelor',
          intro: 'Procesăm datele dvs. pentru următoarele scopuri:',
          
          subsection1: {
            title: '4.1 Furnizare servicii',
            items: [
              'Executarea programărilor și serviciilor',
              'Comunicare despre programările dvs.',
              'Facturare și plată',
              'Asigurare calitate și garanție'
            ]
          },
          
          subsection2: {
            title: '4.2 Servicii clienți',
            items: [
              'Răspuns la întrebări',
              'Procesarea reclamațiilor',
              'Asistență post-servicii'
            ]
          },
          
          subsection3: {
            title: '4.3 Marketing (cu consimțământ)',
            items: [
              'Trimitere newslettere',
              'Comunicare promoții și oferte',
              'Cercetări de piață izolate'
            ]
          },
          
          subsection4: {
            title: '4.4 Obligații legale',
            items: [
              'Declarații fiscale',
              'Obligații administrative',
              'Proceduri legale'
            ]
          }
        },
        
        section5: {
          title: '5. Bază legală pentru procesare',
          intro: 'Procesăm datele dvs. pe baza:',
          items: [
            '<strong>Contract:</strong> Pentru executarea serviciilor noastre',
            '<strong>Obligație legală:</strong> Pentru taxe și administrare',
            '<strong>Interes legitim:</strong> Pentru operațiuni comerciale și prevenire fraudă',
            '<strong>Consimțământ:</strong> Pentru activități de marketing'
          ]
        },
        
        section6: {
          title: '6. Perioade de păstrare',
          intro: 'Nu păstrăm datele dvs. mai mult decât este necesar:',
          items: [
            '<strong>Date clienți:</strong> 7 ani după ultima tranzacție (lege fiscală)',
            '<strong>Date facturare:</strong> 7 ani (lege fiscală)',
            '<strong>Date marketing:</strong> Până la dezabonare sau 2 ani după ultima interacțiune',
            '<strong>Log-uri website:</strong> 1 an',
            '<strong>Cookie-uri:</strong> Vezi politica de cookie-uri'
          ]
        },
        
        section7: {
          title: '7. Partajarea datelor',
          intro: 'Partajăm datele dvs. doar cu:',
          items: [
            'Furnizori IT (găzduire, email, software)',
            'Software contabilitate și contabili',
            'Furnizori plăți',
            'Agenții guvernamentale când este legal necesar'
          ],
          outro: 'Toți procesatorii noștri sunt legați prin acorduri de procesare și pot folosi datele dvs. doar pentru scopul convenit.'
        },
        
        section8: {
          title: '8. Securitate',
          intro: 'Luăm măsuri tehnice și organizatorice adecvate pentru a securiza datele dvs.:',
          items: [
            'Criptare date (SSL/TLS)',
            'Control acces și autentificare',
            'Backup-uri regulate',
            'Software securitate și firewall-uri',
            'Training angajați despre confidențialitate'
          ]
        },
        
        section9: {
          title: '9. Drepturile dvs.',
          intro: 'Aveți următoarele drepturi conform GDPR:',
          items: [
            '<strong>Drept de acces:</strong> Vizualizați ce date avem despre dvs.',
            '<strong>Drept la rectificare:</strong> Corectarea datelor incorecte',
            '<strong>Drept la ștergere:</strong> Ștergerea datelor dvs. (în anumite condiții)',
            '<strong>Drept la restricționare:</strong> Restricționarea procesării',
            '<strong>Drept la portabilitate:</strong> Transferul datelor dvs.',
            '<strong>Drept de opoziție:</strong> Obiecție la procesare',
            '<strong>Drept de retragere:</strong> Retragerea consimțământului'
          ]
        },
        
        section10: {
          title: '10. Cookies',
          content: 'Folosim cookie-uri pentru o experiență optimă pe website. Vezi <a href="/cookie-policy">politica noastră de cookie-uri</a> pentru mai multe informații.'
        },
        
        section11: {
          title: '11. Contact',
          intro: 'Pentru întrebări despre această politică de confidențialitate sau despre drepturile dvs., ne puteți contacta:',
          contact: 'Spectra AutoArt<br>Email: privacy@spectraautoart.nl<br>Telefon: +31 6 12345678',
          authority: 'De asemenea, aveți dreptul să depuneți o plângere la Autoritatea Olandeză pentru Protecția Datelor:',
          authorityAddress: 'Autoritatea Olandeză pentru Protecția Datelor<br>PO Box 93374<br>2509 AJ Haga<br>Tel: 088 - 1805 250'
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'nl',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    debug: true
  });

export default i18n;