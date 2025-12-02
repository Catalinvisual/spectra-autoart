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
      dateNotAvailable: 'Deze datum is niet beschikbaar. Selecteer een andere datum.',
      dateOccupied: 'Deze datum is bezet. Selecteer een andere datum.',
      dateAvailable: '✓ Datum beschikbaar',
      checkingAvailability: 'Beschikbaarheid controleren...',
      available: 'Beschikbaar',
      occupied: 'Bezet',
      closed: 'Gesloten',
      january: 'Januari',
      february: 'Februari',
      march: 'Maart',
      april: 'April',
      may: 'Mei',
      june: 'Juni',
      july: 'Juli',
      august: 'Augustus',
      september: 'September',
      october: 'Oktober',
      november: 'November',
      december: 'December',
      sunday: 'Zo',
      monday: 'Ma',
      tuesday: 'Di',
      wednesday: 'Wo',
      thursday: 'Do',
      friday: 'Vr',
      saturday: 'Za',
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
        description: 'Premium auto detailing and styling services. Transform your vehicle with our expert care and attention to detail.',
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
      
      // Contact & Legal Information page translations
      contactLegal: {
        title: 'Contact & Juridische Informatie',
        lastUpdated: 'Laatst bijgewerkt: 27 november 2025',
        
        section1: {
          title: '1. Bedrijfsinformatie',
          companyName: 'Bedrijfsnaam',
          tradeName: 'Handelsnaam',
          legalForm: 'Rechtsvorm',
          located: 'Gevestigd',
          kvkNumber: 'KvK-nummer',
          vatNumber: 'BTW-nummer',
          companyNameValue: 'Spectra AutoArt',
          tradeNameValue: 'Spectra AutoArt',
          legalFormValue: 'Eenmanszaak',
          locatedValue: 'Tilburg, Nederland',
          kvkNumberValue: '[Wordt geregistreerd]',
          vatNumberValue: '[Wordt geregistreerd]'
        },
        
        section2: {
          title: '2. Contactgegevens',
          generalContact: '2.1 Algemene contactgegevens',
          address: 'Adres',
          communicationChannels: '2.2 Communicatiekanalen',
          phone: 'Telefoon',
          emailGeneral: 'Email algemeen',
          emailAppointments: 'Email afspraken',
          emailSupport: 'Email support',
          whatsappBusiness: '2.3 WhatsApp Business',
          whatsapp: 'WhatsApp',
          availability: 'Bereikbaarheid',
          socialMedia: '2.4 Social Media',
          instagram: 'Instagram',
          facebook: 'Facebook',
          linkedin: 'LinkedIn',
          addressValue: 'Spectra AutoArt<br>Tilburg Stadscentrum<br>[Straatnaam wordt vermeld bij registratie]<br>[Postcode] Tilburg<br>Nederland',
          phoneValue: '+31 6 12345678',
          emailGeneralValue: 'info@spectraautoart.nl',
          emailAppointmentsValue: 'bookings@spectraautoart.nl',
          emailSupportValue: 'support@spectraautoart.nl',
          whatsappValue: '+31 6 12345678',
          availabilityValue: 'Maandag t/m zaterdag, 9:00 - 18:00 uur',
          instagramValue: '@spectraautoart',
          facebookValue: 'Spectra AutoArt',
          linkedinValue: 'Spectra AutoArt'
        },
        
        section3: {
          title: '3. Openingstijden',
          monday: 'Maandag',
          tuesday: 'Dinsdag',
          wednesday: 'Woensdag',
          thursday: 'Donderdag',
          friday: 'Vrijdag',
          saturday: 'Zaterdag',
          sunday: 'Zondag',
          closed: 'Gesloten',
          hoursValue: '9:00 - 18:00 uur',
          saturdayHours: '9:00 - 16:00 uur',
          note: 'Let op',
          noteText: 'Buiten openingstijden zijn afspraken op afspraak mogelijk. Neem contact op voor de mogelijkheden.'
        },
        
        section4: {
          title: '4. Diensten en specialisaties',
          intro: 'Spectra AutoArt is gespecialiseerd in premium auto detailing en styling diensten:',
          interiorDetailing: 'Interieur Detailing',
          exteriorDetailing: 'Exterieur Detailing',
          ambientLighting: 'Ambient Verlichting',
          starlightCeiling: 'Sterrenhemel Plafond',
          ceilingRestoration: 'Plafon Retapitatie',
          chromeDelete: 'Chrome Delete',
          trimWrapping: 'Trim Colantare',
          autoPolish: 'Auto Polijsten',
          ceramicProtection: 'Keramische Bescherming',
          interiorDetailingDesc: 'Complete reiniging en bescherming van interieur',
          exteriorDetailingDesc: 'Wasbeurt, polijsten en bescherming van lak',
          ambientLightingDesc: 'Installatie van sfeerverlichting in interieur',
          starlightCeilingDesc: 'Luxe plafondverlichting met LED-sterren',
          ceilingRestorationDesc: 'Herstel en vernieuwing van hoofdlining',
          chromeDeleteDesc: 'Matzwarte afwerking van chromen delen',
          trimWrappingDesc: 'Wrapping van interieur- en exterieurtrim',
          autoPolishDesc: 'Lakcorrectie en glansherstel',
          ceramicProtectionDesc: 'Duurzame coating voor lakbescherming'
        },
        
        section5: {
          title: '5. Juridische aansprakelijkheid',
          generalLiability: '5.1 Algemene aansprakelijkheid',
          generalLiabilityText: 'Spectra AutoArt is aansprakelijk voor schade veroorzaakt tijdens het uitvoeren van onze diensten, met een maximum van de factuurwaarde van de betreffende dienst, tenzij er sprake is van opzet of grove schuld.',
          exclusions: '5.2 Uitsluitingen',
          exclusionsText: 'Wij zijn niet aansprakelijk voor:',
          existingDefects: 'Schade veroorzaakt door bestaande gebreken aan het voertuig',
          valueDepreciation: 'Waardevermindering van het voertuig',
          indirectDamage: 'Indirecte schade of gevolgschade',
          postLocationDamage: 'Schade ontstaan na het verlaten van onze locatie',
          personalItemsLoss: 'Verlies van persoonlijke bezittingen uit het voertuig',
          insurance: '5.3 Verzekering',
          insuranceText: 'Spectra AutoArt is verzekerd tegen bedrijfsaansprakelijkheid. Onze verzekeringspolis dekt schades tot €1.000.000 per gebeurtenis.'
        },
        
        section6: {
          title: '6. Klachtenprocedure',
          intro: 'Bent u niet tevreden over onze dienstverlening? Volg dan onze klachtenprocedure:',
          step1: 'Melding',
          step1Text: 'Binnen 7 dagen na voltooiing van de dienst',
          step2: 'Schriftelijk',
          step2Text: 'Via email naar complaints@spectraautoart.nl',
          step3: 'Behandeling',
          step3Text: 'Wij nemen binnen 5 werkdagen contact op',
          step4: 'Oplossing',
          step4Text: 'Wij streven naar een passende oplossing binnen 30 dagen',
          step5: 'Escalatie',
          step5Text: 'Onafhankelijke geschillencommissie indien nodig'
        },
        
        section7: {
          title: '7. Intellectuele eigendom',
          intro: 'Alle rechten voorbehouden. Niets uit deze website of onze marketingmaterialen mag worden verveelvoudigd, opgeslagen in een geautomatiseerd gegevensbestand, of openbaar gemaakt, in enige vorm of op enige wijze, hetzij elektronisch, mechanisch, door fotokopieën, opnamen, of op enige andere manier, zonder voorafgaande schriftelijke toestemming van Spectra AutoArt.',
          trademarks: 'Merken',
          trademarksText: 'Spectra AutoArt™ is een handelsnaam van ons bedrijf. Alle andere merken en handelsnamen zijn eigendom van hun respectieve eigenaren.'
        },
        
        section8: {
          title: '8. Privacy en gegevensbescherming',
          intro: 'Spectra AutoArt is geregistreerd bij de Autoriteit Persoonsgegevens als verwerkingsverantwoordelijke. Ons registratienummer wordt vermeld zodra de registratie is voltooid.',
          moreInfo: 'Voor meer informatie over hoe wij omgaan met uw persoonsgegevens, zie onze'
        },
        
        section9: {
          title: '9. Toepasselijk recht',
          content: 'Op alle overeenkomsten en diensten van Spectra AutoArt is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Tilburg, tenzij dwingend recht een andere bevoegde rechter aanwijst.'
        },
        
        section10: {
          title: '10. Wijzigingen',
          content: 'Deze juridische informatie kan worden gewijzigd. Wijzigingen worden via onze website bekend gemaakt. De meest actuele versie is altijd beschikbaar op deze pagina.'
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
      },
      
      // Cookie Policy page translations
      cookiePolicy: {
        title: 'Cookiebeleid',
        lastUpdated: 'Laatst bijgewerkt: 27 november 2025',
        
        section1: {
          title: '1. Wat zijn cookies?',
          content: 'Cookies zijn kleine tekstbestanden die op uw computer, tablet of mobiele telefoon worden opgeslagen wanneer u onze website bezoekt. Ze worden gebruikt om uw gebruikservaring te verbeteren en informatie over uw bezoek te verzamelen.'
        },
        
        section2: {
          title: '2. Welke cookies gebruiken wij?',
          intro: 'Wij gebruiken de volgende soorten cookies:',
          
          subsection1: {
            title: '2.1 Functionele cookies (vereist)',
            intro: 'Deze cookies zijn essentieel voor het functioneren van onze website:',
            items: [
              'Taalvoorkeur: Onthoudt uw gekozen taal',
              'Sessie-ID: Houdt uw sessie actief tijdens het boeken',
              'Gebruikersvoorkeuren: Slaat uw voorkeuren op'
            ]
          },
          
          subsection2: {
            title: '2.2 Analytische cookies',
            intro: 'Deze cookies helpen ons begrijpen hoe bezoekers onze website gebruiken:',
            items: [
              'Google Analytics: Analyseert websiteverkeer en gebruikersgedrag',
              'Bezoekersstatistieken: Meet populariteit van pagina\'s',
              'Prestatie-analyse: Identificeert technische problemen'
            ]
          },
          
          subsection3: {
            title: '2.3 Marketing cookies',
            intro: 'Deze cookies worden gebruikt voor marketingdoeleinden:',
            items: [
              'Social media integratie: Delen via social media knoppen',
              'Remarketing: Gerichte advertenties (alleen met toestemming)'
            ]
          }
        },
        
        section3: {
          title: '3. Cookie-overzicht',
          intro: 'Hieronder vindt u een overzicht van de cookies die wij gebruiken:',
          tableHeaders: {
            name: 'Cookie Naam',
            type: 'Type',
            purpose: 'Doel',
            expiry: 'Vervaltijd'
          },
          cookies: [
            {
              name: 'language_preference',
              type: 'Functioneel',
              purpose: 'Onthoudt taalvoorkeur',
              expiry: '1 jaar'
            },
            {
              name: 'session_id',
              type: 'Functioneel',
              purpose: 'Houdt sessie actief',
              expiry: 'Sessie'
            },
            {
              name: '_ga',
              type: 'Analytisch',
              purpose: 'Google Analytics tracking',
              expiry: '2 jaar'
            },
            {
              name: '_gid',
              type: 'Analytisch',
              purpose: 'Google Analytics sessie',
              expiry: '24 uur'
            },
            {
              name: 'cookie_consent',
              type: 'Functioneel',
              purpose: 'Onthoudt cookie toestemming',
              expiry: '1 jaar'
            }
          ]
        },
        
        section4: {
          title: '4. Beheer van cookies',
          intro: 'U kunt cookies beheren via uw browserinstellingen. Hier vindt u instructies voor de meest populaire browsers:',
          browsers: [
            'Google Chrome',
            'Mozilla Firefox',
            'Microsoft Edge',
            'Safari'
          ]
        },
        
        section5: {
          title: '5. Impact van het weigeren van cookies',
          intro: 'Als u cookies weigert of verwijdert, kan dit de functionaliteit van onze website beperken:',
          items: [
            'U moet mogelijk uw taalvoorkeur herhaaldelijk instellen',
            'Het boekingsproces kan minder soepel verlopen',
            'Sommige websitefuncties werken mogelijk niet goed',
            'Wij kunnen uw voorkeuren niet onthouden'
          ]
        },
        
        section6: {
          title: '6. Third-party cookies',
          intro: 'Sommige cookies worden geplaatst door derde partijen:',
          items: [
            'Google Analytics: Voor website-analyse',
            'Social media: Voor integratie met social media platforms'
          ],
          outro: 'Wij hebben geen controle over hoe deze derde partijen cookies gebruiken. Raadpleeg hun privacybeleid voor meer informatie.'
        },
        
        section7: {
          title: '7. Updates van dit beleid',
          content: 'Dit cookiebeleid kan worden bijgewerkt wanneer wij wijzigingen aanbrengen in ons cookiegebruik. Wij raden u aan dit beleid regelmatig te controleren.'
        },
        
        section8: {
          title: '8. Contact',
          intro: 'Voor vragen over dit cookiebeleid kunt u contact opnemen:',
          contact: 'Spectra AutoArt<br>Email: privacy@spectraautoart.nl<br>Telefoon: +31 6 12345678'
        },
        
        // GDPR page translations
        gdpr: {
          title: 'AVG / GDPR Informatie',
          lastUpdated: 'Laatst bijgewerkt: 27 november 2025',
          
          section1: {
            title: '1. Algemene Verordening Gegevensbescherming (AVG)',
            content: 'Spectra AutoArt voldoet volledig aan de Algemene Verordening Gegevensbescherming (AVG), ook wel bekend als GDPR (General Data Protection Regulation). Deze verordening is van toepassing op alle bedrijven binnen de Europese Unie die persoonsgegevens verwerken.'
          },
          
          section2: {
            title: '2. Verwerkingsverantwoordelijke',
            companyName: 'Bedrijfsnaam',
            companyNameValue: 'Spectra AutoArt',
            address: 'Adres',
            addressValue: 'Tilburg Centraal',
            email: 'E-mail',
            emailValue: 'privacy@spectraautoart.nl',
            kvkNumber: 'Kamer van Koophandel Nummer',
            kvkNumberValue: '[nog te registreren]',
            phone: 'Telefoon',
            phoneValue: '+31 6 12345678'
          },
          
          section3: {
            title: '3. Functionaris Gegevensbescherming (FG)',
            intro: 'Voor al uw vragen en verzoeken met betrekking tot gegevensbescherming kunt u contact opnemen met onze Functionaris Gegevensbescherming:',
            email: 'E-mail',
            emailValue: 'fg@spectraautoart.nl',
            phone: 'Telefoon',
            phoneValue: '+31 6 12345678'
          },
          
          section4: {
            title: '4. Verwerkingsdoeleinden en Rechtsgrondslagen',
            intro: 'Wij verwerken persoonsgegevens voor de volgende doeleinden:',
            
            serviceProvision: {
              title: '4.1 Dienstverlening',
              purpose: 'Doel: Uitvoeren van auto detailing en styling diensten',
              legalBasis: 'Rechtsgrondslag: Contract (Art. 6(1)(b) AVG)',
              data: 'Gegevens: Contactgegevens, voertuiginformatie, afspraakgegevens'
            },
            
            customerCommunication: {
              title: '4.2 Klantencommunicatie',
              purpose: 'Doel: Communicatie over afspraken, diensten en nazorg',
              legalBasis: 'Rechtsgrondslag: Contract (Art. 6(1)(b) AVG)',
              data: 'Gegevens: Naam, e-mail, telefoonnummer'
            },
            
            billing: {
              title: '4.3 Facturatie en Administratie',
              purpose: 'Doel: Financiële administratie en belastingaangiften',
              legalBasis: 'Rechtsgrondslag: Wettelijke verplichting (Art. 6(1)(c) AVG)',
              data: 'Gegevens: Factuuradres, betaalgegevens, transactiegeschiedenis'
            },
            
            marketing: {
              title: '4.4 Marketing (optioneel)',
              purpose: 'Doel: Nieuwsbrieven en promotieactiviteiten',
              legalBasis: 'Rechtsgrondslag: Toestemming (Art. 6(1)(a) AVG)',
              data: 'Gegevens: E-mailadres, naam, voorkeuren'
            }
          },
          
          section5: {
            title: '5. Categorieën van Persoonsgegevens',
            intro: 'Wij verwerken de volgende categorieën van persoonsgegevens:',
            items: [
              'Identificatiegegevens: Naam, adres, contactgegevens',
              'Voertuiggegevens: Kenteken, merk, model, bouwjaar',
              'Financiële gegevens: Factuuradres, betaalgegevens',
              'Communicatiegegevens: E-mailcorrespondentie, telefoongesprekken',
              'Websitegegevens: IP-adres, cookies, gebruikersgedrag'
            ]
          },
          
          section6: {
            title: '6. Bewaartermijnen',
            intro: 'Wij hanteren de volgende bewaartermijnen voor verschillende categorieën van gegevens:',
            
            customerData: {
              title: '6.1 Klantgegevens',
              period: 'Periode: 7 jaar na laatste transactie',
              reason: 'Reden: Wettelijke verplichting belastingwet'
            },
            
            invoiceData: {
              title: '6.2 Factuur- en Boekhoudgegevens',
              period: 'Periode: 7 jaar',
              reason: 'Reden: Artikel 52 Wet op de omzetbelasting'
            },
            
            marketingData: {
              title: '6.3 Marketinggegevens',
              period: 'Periode: 2 jaar na laatste interactie of tot afmelding',
              reason: 'Reden: Toestemming kan te allen tijde worden ingetrokken'
            },
            
            websiteLogs: {
              title: '6.4 Website Logs',
              period: 'Periode: 1 jaar',
              reason: 'Reden: Veiligheid en analyse'
            }
          },
          
          section7: {
            title: '7. Uw Rechten onder de AVG',
            intro: 'Als betrokkene heeft u de volgende rechten:',
            
            rightOfAccess: {
              title: '7.1 Recht op Inzage (Art. 15 AVG)',
              content: 'U heeft het recht te weten of wij uw persoonsgegevens verwerken en zo ja, welke gegevens dit zijn.'
            },
            
            rightToRectification: {
              title: '7.2 Recht op Rectificatie (Art. 16 AVG)',
              content: 'U kunt verzoeken om correctie van onjuiste of onvolledige persoonsgegevens.'
            },
            
            rightToErasure: {
              title: '7.3 Recht op Verwijdering (Art. 17 AVG)',
              content: 'Onder bepaalde omstandigheden kunt u verzoeken om verwijdering van uw persoonsgegevens.'
            },
            
            rightToRestriction: {
              title: '7.4 Recht op Beperking van Verwerking (Art. 18 AVG)',
              content: 'U kunt verzoeken om tijdelijke beperking van de verwerking van uw gegevens.'
            },
            
            rightToPortability: {
              title: '7.5 Recht op Gegevensoverdraagbaarheid (Art. 20 AVG)',
              content: 'U heeft het recht om uw gegevens te ontvangen in een gestructureerde, gangbare en machineleesbare vorm.'
            },
            
            rightToObject: {
              title: '7.6 Recht van Verzet (Art. 21 AVG)',
              content: 'U kunt bezwaar maken tegen de verwerking van uw persoonsgegevens.'
            },
            
            rightToWithdraw: {
              title: '7.7 Recht op Intrekking van Toestemming',
              content: 'U kunt uw toestemming voor gegevensverwerking te allen tijde intrekken.'
            }
          },
          
          section8: {
            title: '8. Uitoefening van Uw Rechten',
            intro: 'U kunt uw rechten uitoefenen door contact op te nemen met onze Functionaris Gegevensbescherming:',
            email: 'E-mail: fg@spectraautoart.nl',
            phone: 'Telefoon: +31 6 12345678',
            address: 'Adres: Spectra AutoArt, Tilburg',
            responseTime: 'Wij reageren binnen 1 maand op uw verzoek. Voor complexe verzoeken kunnen wij deze termijn met 2 maanden verlengen.'
          },
          
          section9: {
            title: '9. Recht op Klacht Indienen',
            intro: 'Heeft u klachten over de verwerking van uw persoonsgegevens? U kunt contact opnemen met onze Functionaris Gegevensbescherming. U heeft ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens:',
            authority: 'Autoriteit Persoonsgegevens',
            authorityAddress: 'Postbus 93374, 2509 AJ Den Haag, Tel: 088 - 1805 250, Website: autoriteitpersoonsgegevens.nl'
          },
          
          section10: {
            title: '10. Beveiliging van Persoonsgegevens',
            intro: 'Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beveiligen:',
            items: [
              'Gegevensversleuteling tijdens vervoer (SSL/TLS)',
              'Toegangscontrole en authenticatie',
              'Regelmatige beveiligingssoftware updates',
              'Back-up en herstelprocedures',
              'Medewerkersopleiding over privacy en beveiliging',
              'Beveiligde opslag van fysieke documenten'
            ]
          },
          
          section11: {
            title: '11. Gegevensoverdracht Buiten de EU',
            content: 'Wij verwerken uw gegevens uitsluitend binnen de Europese Unie. Mocht er toch sprake zijn van overdracht buiten de EU, dan zorgen wij voor passende waarborgen zoals standaardcontractbepalingen of adequaatheidsbesluiten.'
          },
          
          section12: {
            title: '12. Wijzigingen aan Dit Beleid',
            content: 'Deze AVG-beleid kan worden gewijzigd. Wijzigingen worden aangekondigd via onze website. Voor significante wijzigingen zullen wij actief communiceren naar onze klanten.'
          }
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
      dateNotAvailable: 'This date is not available. Please select another date.',
      dateOccupied: 'This date is occupied. Please select another date.',
      dateAvailable: '✓ Date available',
      checkingAvailability: 'Checking availability...',
      available: 'Available',
      occupied: 'Occupied',
      closed: 'Closed',
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December',
      sunday: 'Sun',
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
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
        description: 'Premium auto detailing and styling services. Transform your vehicle with our expert care and attention to detail.',
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
      },
      
      // Cookie Policy page translations
      cookiePolicy: {
        title: 'Cookie Policy',
        lastUpdated: 'Last updated: November 27, 2025',
        
        section1: {
          title: '1. What are cookies?',
          content: 'Cookies are small text files that are stored on your computer, tablet or mobile phone when you visit our website. They are used to improve your user experience and collect information about your visit.'
        },
        
        section2: {
          title: '2. Which cookies do we use?',
          intro: 'We use the following types of cookies:',
          
          subsection1: {
            title: '2.1 Functional cookies (required)',
            intro: 'These cookies are essential for the functioning of our website:',
            items: [
              'Language preference: Remembers your chosen language',
              'Session ID: Keeps your session active during booking',
              'User preferences: Saves your preferences'
            ]
          },
          
          subsection2: {
            title: '2.2 Analytical cookies',
            intro: 'These cookies help us understand how visitors use our website:',
            items: [
              'Google Analytics: Analyzes website traffic and user behavior',
              'Visitor statistics: Measures page popularity',
              'Performance analysis: Identifies technical problems'
            ]
          },
          
          subsection3: {
            title: '2.3 Marketing cookies',
            intro: 'These cookies are used for marketing purposes:',
            items: [
              'Social media integration: Sharing via social media buttons',
              'Remarketing: Targeted ads (only with consent)'
            ]
          }
        },
        
        section3: {
          title: '3. Cookie overview',
          intro: 'Below you will find an overview of the cookies we use:',
          tableHeaders: {
            name: 'Cookie Name',
            type: 'Type',
            purpose: 'Purpose',
            expiry: 'Expiry'
          },
          cookies: [
            {
              name: 'language_preference',
              type: 'Functional',
              purpose: 'Remembers language preference',
              expiry: '1 year'
            },
            {
              name: 'session_id',
              type: 'Functional',
              purpose: 'Keeps session active',
              expiry: 'Session'
            },
            {
              name: '_ga',
              type: 'Analytical',
              purpose: 'Google Analytics tracking',
              expiry: '2 years'
            },
            {
              name: '_gid',
              type: 'Analytical',
              purpose: 'Google Analytics session',
              expiry: '24 hours'
            },
            {
              name: 'cookie_consent',
              type: 'Functional',
              purpose: 'Remembers cookie consent',
              expiry: '1 year'
            }
          ]
        },
        
        section4: {
          title: '4. Cookie management',
          intro: 'You can manage cookies through your browser settings. Here you will find instructions for the most popular browsers:',
          browsers: [
            'Google Chrome',
            'Mozilla Firefox',
            'Microsoft Edge',
            'Safari'
          ]
        },
        
        section5: {
          title: '5. Impact of refusing cookies',
          intro: 'If you refuse or delete cookies, this may limit the functionality of our website:',
          items: [
            'You may need to repeatedly set your language preference',
            'The booking process may be less smooth',
            'Some website features may not work properly',
            'We cannot remember your preferences'
          ]
        },
        
        section6: {
          title: '6. Third-party cookies',
          intro: 'Some cookies are placed by third parties:',
          items: [
            'Google Analytics: For website analysis',
            'Social media: For integration with social media platforms'
          ],
          outro: 'We have no control over how these third parties use cookies. Please consult their privacy policy for more information.'
        },
        
        section7: {
          title: '7. Updates to this policy',
          content: 'This cookie policy may be updated when we make changes to our cookie usage. We recommend that you check this policy regularly.'
        },
        
        section8: {
          title: '8. Contact',
          intro: 'For questions about this cookie policy you can contact:',
          contact: 'Spectra AutoArt<br>Email: privacy@spectraautoart.nl<br>Phone: +31 6 12345678'
        }
      },
      
      // Contact & Legal Information page translations
      contactLegal: {
        title: 'Contact & Legal Information',
        lastUpdated: 'Last updated: November 27, 2025',
        
        section1: {
          title: '1. Company Information',
          companyName: 'Company Name',
          tradeName: 'Trade Name',
          legalForm: 'Legal Form',
          located: 'Located',
          kvkNumber: 'Chamber of Commerce Number',
          vatNumber: 'VAT Number',
          companyNameValue: 'Spectra AutoArt',
          tradeNameValue: 'Spectra AutoArt',
          legalFormValue: 'Sole Proprietorship',
          locatedValue: 'Tilburg, Netherlands',
          kvkNumberValue: '[To be registered]',
          vatNumberValue: '[To be registered]'
        },
        
        section2: {
          title: '2. Contact Information',
          generalContact: '2.1 General Contact Information',
          address: 'Address',
          communicationChannels: '2.2 Communication Channels',
          phone: 'Phone',
          emailGeneral: 'General Email',
          emailAppointments: 'Appointments Email',
          emailSupport: 'Support Email',
          whatsappBusiness: '2.3 WhatsApp Business',
          whatsapp: 'WhatsApp',
          availability: 'Availability',
          socialMedia: '2.4 Social Media',
          instagram: 'Instagram',
          facebook: 'Facebook',
          linkedin: 'LinkedIn',
          addressValue: 'Spectra AutoArt<br>Tilburg City Center<br>[Street name to be provided upon registration]<br>[Postal Code] Tilburg<br>Netherlands',
          phoneValue: '+31 6 12345678',
          emailGeneralValue: 'info@spectraautoart.nl',
          emailAppointmentsValue: 'bookings@spectraautoart.nl',
          emailSupportValue: 'support@spectraautoart.nl',
          whatsappValue: '+31 6 12345678',
          availabilityValue: 'Monday through Saturday, 9:00 AM - 6:00 PM',
          instagramValue: '@spectraautoart',
          facebookValue: 'Spectra AutoArt',
          linkedinValue: 'Spectra AutoArt'
        },
        
        section3: {
          title: '3. Opening Hours',
          monday: 'Monday',
          tuesday: 'Tuesday',
          wednesday: 'Wednesday',
          thursday: 'Thursday',
          friday: 'Friday',
          saturday: 'Saturday',
          sunday: 'Sunday',
          closed: 'Closed',
          hoursValue: '9:00 AM - 6:00 PM',
          saturdayHours: '9:00 AM - 4:00 PM',
          note: 'Note',
          noteText: 'Appointments outside opening hours are available by arrangement. Please contact us for possibilities.'
        },
        
        section4: {
          title: '4. Services and Specializations',
          intro: 'Spectra AutoArt specializes in premium auto detailing and styling services:',
          interiorDetailing: 'Interior Detailing',
          exteriorDetailing: 'Exterior Detailing',
          ambientLighting: 'Ambient Lighting',
          starlightCeiling: 'Starlight Ceiling',
          ceilingRestoration: 'Ceiling Restoration',
          chromeDelete: 'Chrome Delete',
          trimWrapping: 'Trim Wrapping',
          autoPolish: 'Auto Polish',
          ceramicProtection: 'Ceramic Protection',
          interiorDetailingDesc: 'Complete cleaning and protection of interior',
          exteriorDetailingDesc: 'Washing, polishing and protection of paint',
          ambientLightingDesc: 'Installation of ambient lighting in interior',
          starlightCeilingDesc: 'Luxury ceiling lighting with LED stars',
          ceilingRestorationDesc: 'Repair and renewal of headlining',
          chromeDeleteDesc: 'Matte black finish of chrome parts',
          trimWrappingDesc: 'Wrapping of interior and exterior trim',
          autoPolishDesc: 'Paint correction and gloss restoration',
          ceramicProtectionDesc: 'Durable coating for paint protection'
        },
        
        section5: {
          title: '5. Legal Liability',
          generalLiability: '5.1 General Liability',
          generalLiabilityText: 'Spectra AutoArt is liable for damage caused during the performance of our services, with a maximum of the invoice value of the relevant service, unless there is intent or gross negligence.',
          exclusions: '5.2 Exclusions',
          exclusionsText: 'We are not liable for:',
          existingDefects: 'Damage caused by existing defects to the vehicle',
          valueDepreciation: 'Depreciation of the vehicle value',
          indirectDamage: 'Indirect damage or consequential damage',
          postLocationDamage: 'Damage occurring after leaving our location',
          personalItemsLoss: 'Loss of personal belongings from the vehicle',
          insurance: '5.3 Insurance',
          insuranceText: 'Spectra AutoArt is insured against business liability. Our insurance policy covers damages up to €1,000,000 per event.'
        },
        
        section6: {
          title: '6. Complaints Procedure',
          intro: 'Are you not satisfied with our service? Please follow our complaints procedure:',
          step1: 'Notification',
          step1Text: 'Within 7 days after completion of the service',
          step2: 'Written',
          step2Text: 'Via email to complaints@spectraautoart.nl',
          step3: 'Processing',
          step3Text: 'We will contact you within 5 working days',
          step4: 'Solution',
          step4Text: 'We strive for an appropriate solution within 30 days',
          step5: 'Escalation',
          step5Text: 'Independent disputes committee if necessary'
        },
        
        section7: {
          title: '7. Intellectual Property',
          intro: 'All rights reserved. No part of this website or our marketing materials may be reproduced, stored in an automated database, or made public, in any form or in any way, whether electronic, mechanical, by photocopies, recordings, or in any other way, without prior written permission from Spectra AutoArt.',
          trademarks: 'Trademarks',
          trademarksText: 'Spectra AutoArt™ is a trade name of our company. All other brands and trade names are the property of their respective owners.'
        },
        
        section8: {
          title: '8. Privacy and Data Protection',
          intro: 'Spectra AutoArt is registered with the Dutch Data Protection Authority as the data controller. Our registration number will be provided once the registration is completed.',
          moreInfo: 'For more information about how we handle your personal data, see our'
        },
        
        section9: {
          title: '9. Applicable Law',
          content: 'All agreements and services of Spectra AutoArt are subject to Dutch law. Disputes will be submitted to the competent court in Tilburg, unless mandatory law designates another competent court.'
        },
        
        section10: {
          title: '10. Changes',
          content: 'This legal information may be changed. Changes will be announced via our website. The most current version is always available on this page.'
        }
      },
      
      // GDPR/AVG Information page translations
      gdpr: {
        title: 'AVG / GDPR Information',
        lastUpdated: 'Last updated: November 27, 2025',
        
        section1: {
          title: '1. General Data Protection Regulation (GDPR)',
          content: 'Spectra AutoArt fully complies with the General Data Protection Regulation (GDPR), also known as AVG (Algemene Verordening Gegevensbescherming). This regulation applies to all companies within the European Union that process personal data.'
        },
        
        section2: {
          title: '2. Data Controller',
          companyName: 'Company Name',
          companyNameValue: 'Spectra AutoArt',
          address: 'Address',
          addressValue: 'Tilburg City Center',
          email: 'Email',
          emailValue: 'privacy@spectraautoart.nl',
          kvkNumber: 'Chamber of Commerce Number',
          kvkNumberValue: '[to be registered]',
          phone: 'Phone',
          phoneValue: '+31 6 12345678'
        },
        
        section3: {
          title: '3. Data Protection Officer (DPO)',
          intro: 'For all your questions and requests regarding data protection, you can contact our Data Protection Officer:',
          email: 'Email',
          emailValue: 'dpo@spectraautoart.nl',
          phone: 'Phone',
          phoneValue: '+31 6 12345678'
        },
        
        section4: {
          title: '4. Processing Purposes and Legal Bases',
          intro: 'We process personal data for the following purposes:',
          
          serviceProvision: {
            title: '4.1 Service Provision',
            purpose: 'Purpose: Performing auto detailing and styling services',
            legalBasis: 'Legal Basis: Contract (Art. 6(1)(b) GDPR)',
            data: 'Data: Contact details, vehicle information, appointment data'
          },
          
          customerCommunication: {
            title: '4.2 Customer Communication',
            purpose: 'Purpose: Communication about appointments, services and aftercare',
            legalBasis: 'Legal Basis: Contract (Art. 6(1)(b) GDPR)',
            data: 'Data: Name, email, phone number'
          },
          
          billing: {
            title: '4.3 Billing and Administration',
            purpose: 'Purpose: Financial administration and tax returns',
            legalBasis: 'Legal Basis: Legal obligation (Art. 6(1)(c) GDPR)',
            data: 'Data: Billing address, payment data, transaction history'
          },
          
          marketing: {
            title: '4.4 Marketing (optional)',
            purpose: 'Purpose: Newsletters and promotional activities',
            legalBasis: 'Legal Basis: Consent (Art. 6(1)(a) GDPR)',
            data: 'Data: Email address, name, preferences'
          }
        },
        
        section5: {
          title: '5. Categories of Personal Data',
          intro: 'We process the following categories of personal data:',
          items: [
            'Identification data: Name, address, contact details',
            'Vehicle data: License plate, brand, model, year of manufacture',
            'Financial data: Billing address, payment data',
            'Communication data: Email correspondence, phone calls',
            'Website data: IP address, cookies, user behavior'
          ]
        },
        
        section6: {
          title: '6. Retention Periods',
          intro: 'We apply the following retention periods for different categories of data:',
          
          customerData: {
            title: '6.1 Customer Data',
            period: 'Period: 7 years after last transaction',
            reason: 'Reason: Legal obligation tax law'
          },
          
          invoiceData: {
            title: '6.2 Invoice and Accounting Data',
            period: 'Period: 7 years',
            reason: 'Reason: Article 52 Turnover Tax Act'
          },
          
          marketingData: {
            title: '6.3 Marketing Data',
            period: 'Period: 2 years after last interaction or until unsubscribe',
            reason: 'Reason: Consent can be withdrawn at any time'
          },
          
          websiteLogs: {
            title: '6.4 Website Logs',
            period: 'Period: 1 year',
            reason: 'Reason: Security and analysis'
          }
        },
        
        section7: {
          title: '7. Your Rights under GDPR',
          intro: 'As a data subject, you have the following rights:',
          
          rightOfAccess: {
            title: '7.1 Right of Access (Art. 15 GDPR)',
            content: 'You have the right to know whether we process your personal data and if so, which data this is.'
          },
          
          rightToRectification: {
            title: '7.2 Right to Rectification (Art. 16 GDPR)',
            content: 'You can request correction of incorrect or incomplete personal data.'
          },
          
          rightToErasure: {
            title: '7.3 Right to Erasure (Art. 17 GDPR)',
            content: 'Under certain circumstances, you can request deletion of your personal data.'
          },
          
          rightToRestriction: {
            title: '7.4 Right to Restriction of Processing (Art. 18 GDPR)',
            content: 'You can request temporary restriction of the processing of your data.'
          },
          
          rightToPortability: {
            title: '7.5 Right to Data Portability (Art. 20 GDPR)',
            content: 'You have the right to receive your data in a structured, commonly used and machine-readable format.'
          },
          
          rightToObject: {
            title: '7.6 Right to Object (Art. 21 GDPR)',
            content: 'You can object to the processing of your personal data.'
          },
          
          rightToWithdraw: {
            title: '7.7 Right to Withdraw Consent',
            content: 'You can withdraw your consent for data processing at any time.'
          }
        },
        
        section8: {
          title: '8. Exercising Your Rights',
          intro: 'You can exercise your rights by contacting our Data Protection Officer:',
          email: 'Email: dpo@spectraautoart.nl',
          phone: 'Phone: +31 6 12345678',
          address: 'Address: Spectra AutoArt, Tilburg',
          responseTime: 'We respond to your request within 1 month. For complex requests, we may extend this period by 2 months.'
        },
        
        section9: {
          title: '9. Right to Lodge a Complaint',
          intro: 'Do you have complaints about the processing of your personal data? You can contact our Data Protection Officer. You also have the right to file a complaint with the Dutch Data Protection Authority:',
          authority: 'Dutch Data Protection Authority',
          authorityAddress: 'PO Box 93374, 2509 AJ The Hague, Tel: 088 - 1805 250, Website: autoriteitpersoonsgegevens.nl'
        },
        
        section10: {
          title: '10. Security of Personal Data',
          intro: 'We take appropriate technical and organizational measures to secure your data:',
          items: [
            'Data encryption in transit (SSL/TLS)',
            'Access control and authentication',
            'Regular security software updates',
            'Backup and recovery procedures',
            'Staff training on privacy and security',
            'Secure storage of physical documents'
          ]
        },
        
        section11: {
          title: '11. Data Transfer Outside the EU',
          content: 'We process your data exclusively within the European Union. Should there nevertheless be transfer outside the EU, we ensure appropriate safeguards such as standard contractual clauses or adequacy decisions.'
        },
        
        section12: {
          title: '12. Changes to This Policy',
          content: 'This GDPR policy may be changed. Changes will be announced via our website. For significant changes, we will actively communicate to our customers.'
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
      dateNotAvailable: 'Esta fecha no está disponible. Por favor seleccione otra fecha.',
      dateOccupied: 'Esta fecha está ocupada. Por favor seleccione otra fecha.',
      dateAvailable: '✓ Fecha disponible',
      checkingAvailability: 'Verificando disponibilidad...',
      available: 'Disponible',
      occupied: 'Ocupado',
      closed: 'Cerrado',
      january: 'Enero',
      february: 'Febrero',
      march: 'Marzo',
      april: 'Abril',
      may: 'Mayo',
      june: 'Junio',
      july: 'Julio',
      august: 'Agosto',
      september: 'Septiembre',
      october: 'Octubre',
      november: 'Noviembre',
      december: 'Diciembre',
      sunday: 'Dom',
      monday: 'Lun',
      tuesday: 'Mar',
      wednesday: 'Mié',
      thursday: 'Jue',
      friday: 'Vie',
      saturday: 'Sáb',
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
        description: 'Servicios premium de detailing y estilizado de autos. Transforma tu vehículo con nuestro cuidado experto y atención al detalle.',
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
      },
      
      // Cookie Policy page translations
      cookiePolicy: {
        title: 'Política de Cookies',
        lastUpdated: 'Última actualización: 27 de noviembre de 2025',
        
        section1: {
          title: '1. ¿Qué son las cookies?',
          content: 'Las cookies son pequeños archivos de texto que se almacenan en su computadora, tableta o teléfono móvil cuando visita nuestro sitio web. Se utilizan para mejorar su experiencia de usuario y recopilar información sobre su visita.'
        },
        
        section2: {
          title: '2. ¿Qué cookies utilizamos?',
          intro: 'Utilizamos los siguientes tipos de cookies:',
          
          subsection1: {
            title: '2.1 Cookies funcionales (requeridas)',
            intro: 'Estas cookies son esenciales para el funcionamiento de nuestro sitio web:',
            items: [
              'Preferencia de idioma: Recuerda su idioma elegido',
              'ID de sesión: Mantiene su sesión activa durante la reserva',
              'Preferencias del usuario: Guarda sus preferencias'
            ]
          },
          
          subsection2: {
            title: '2.2 Cookies analíticas',
            intro: 'Estas cookies nos ayudan a entender cómo los visitantes usan nuestro sitio web:',
            items: [
              'Google Analytics: Analiza el tráfico del sitio web y el comportamiento del usuario',
              'Estadísticas de visitantes: Mide la popularidad de las páginas',
              'Análisis de rendimiento: Identifica problemas técnicos'
            ]
          },
          
          subsection3: {
            title: '2.3 Cookies de marketing',
            intro: 'Estas cookies se utilizan con fines de marketing:',
            items: [
              'Integración con redes sociales: Compartir a través de botones de redes sociales',
              'Remarketing: Anuncios dirigidos (solo con consentimiento)'
            ]
          }
        },
        
        section3: {
          title: '3. Resumen de cookies',
          intro: 'A continuación encontrará un resumen de las cookies que utilizamos:',
          tableHeaders: {
            name: 'Nombre de Cookie',
            type: 'Tipo',
            purpose: 'Propósito',
            expiry: 'Vencimiento'
          },
          cookies: [
            {
              name: 'language_preference',
              type: 'Funcional',
              purpose: 'Recuerda la preferencia de idioma',
              expiry: '1 año'
            },
            {
              name: 'session_id',
              type: 'Funcional',
              purpose: 'Mantiene la sesión activa',
              expiry: 'Sesión'
            },
            {
              name: '_ga',
              type: 'Analítica',
              purpose: 'Seguimiento de Google Analytics',
              expiry: '2 años'
            },
            {
              name: '_gid',
              type: 'Analítica',
              purpose: 'Sesión de Google Analytics',
              expiry: '24 horas'
            },
            {
              name: 'cookie_consent',
              type: 'Funcional',
              purpose: 'Recuerda el consentimiento de cookies',
              expiry: '1 año'
            }
          ]
        },
        
        section4: {
          title: '4. Gestión de cookies',
          intro: 'Puede gestionar las cookies a través de la configuración de su navegador. Aquí encontrará instrucciones para los navegadores más populares:',
          browsers: [
            'Google Chrome',
            'Mozilla Firefox',
            'Microsoft Edge',
            'Safari'
          ]
        },
        
        section5: {
          title: '5. Impacto de rechazar cookies',
          intro: 'Si rechaza o elimina cookies, esto puede limitar la funcionalidad de nuestro sitio web:',
          items: [
            'Es posible que deba configurar su preferencia de idioma repetidamente',
            'El proceso de reserva puede ser menos fluido',
            'Algunas funciones del sitio web pueden no funcionar correctamente',
            'No podemos recordar sus preferencias'
          ]
        },
        
        section6: {
          title: '6. Cookies de terceros',
          intro: 'Algunas cookies son colocadas por terceros:',
          items: [
            'Google Analytics: Para análisis del sitio web',
            'Redes sociales: Para integración con plataformas de redes sociales'
          ],
          outro: 'No tenemos control sobre cómo estos terceros utilizan las cookies. Consulte su política de privacidad para más información.'
        },
        
        section7: {
          title: '7. Actualizaciones de esta política',
          content: 'Esta política de cookies puede actualizarse cuando realicemos cambios en nuestro uso de cookies. Le recomendamos que revise esta política regularmente.'
        },
        
        section8: {
          title: '8. Contacto',
          intro: 'Para preguntas sobre esta política de cookies puede contactar:',
          contact: 'Spectra AutoArt<br>Email: privacy@spectraautoart.nl<br>Teléfono: +31 6 12345678'
        }
      },
      
      // Contact & Legal Information page translations
      contactLegal: {
        title: 'Información de Contacto y Legal',
        lastUpdated: 'Última actualización: 27 de noviembre de 2025',
        
        section1: {
          title: '1. Información de la Empresa',
          companyName: 'Nombre de la Empresa',
          tradeName: 'Nombre Comercial',
          legalForm: 'Forma Jurídica',
          located: 'Ubicación',
          kvkNumber: 'Número de Cámara de Comercio',
          vatNumber: 'Número de IVA',
          companyNameValue: 'Spectra AutoArt',
          tradeNameValue: 'Spectra AutoArt',
          legalFormValue: 'Empresa Individual',
          locatedValue: 'Tilburg, Países Bajos',
          kvkNumberValue: '[Por registrarse]',
          vatNumberValue: '[Por registrarse]'
        },
        
        section2: {
          title: '2. Información de Contacto',
          generalContact: '2.1 Información de Contacto General',
          address: 'Dirección',
          communicationChannels: '2.2 Canales de Comunicación',
          phone: 'Teléfono',
          emailGeneral: 'Email General',
          emailAppointments: 'Email de Citas',
          emailSupport: 'Email de Soporte',
          whatsappBusiness: '2.3 WhatsApp Business',
          whatsapp: 'WhatsApp',
          availability: 'Disponibilidad',
          socialMedia: '2.4 Redes Sociales',
          instagram: 'Instagram',
          facebook: 'Facebook',
          linkedin: 'LinkedIn',
          addressValue: 'Spectra AutoArt<br>Centro de la Ciudad de Tilburg<br>[Nombre de la calle se proporcionará al registrarse]<br>[Código Postal] Tilburg<br>Países Bajos',
          phoneValue: '+31 6 12345678',
          emailGeneralValue: 'info@spectraautoart.nl',
          emailAppointmentsValue: 'bookings@spectraautoart.nl',
          emailSupportValue: 'support@spectraautoart.nl',
          whatsappValue: '+31 6 12345678',
          availabilityValue: 'De lunes a sábado, 9:00 - 18:00 horas',
          instagramValue: '@spectraautoart',
          facebookValue: 'Spectra AutoArt',
          linkedinValue: 'Spectra AutoArt'
        },
        
        section3: {
          title: '3. Horario de Atención',
          monday: 'Lunes',
          tuesday: 'Martes',
          wednesday: 'Miércoles',
          thursday: 'Jueves',
          friday: 'Viernes',
          saturday: 'Sábado',
          sunday: 'Domingo',
          closed: 'Cerrado',
          hoursValue: '9:00 - 18:00 horas',
          saturdayHours: '9:00 - 16:00 horas',
          note: 'Nota',
          noteText: 'Las citas fuera del horario de atención están disponibles bajo previa cita. Por favor contáctenos para posibilidades.'
        },
        
        section4: {
          title: '4. Servicios y Especializaciones',
          intro: 'Spectra AutoArt se especializa en servicios premium de detailing y estilización de autos:',
          interiorDetailing: 'Detailing de Interior',
          exteriorDetailing: 'Detailing de Exterior',
          ambientLighting: 'Iluminación Ambiental',
          starlightCeiling: 'Techo de Estrellas',
          ceilingRestoration: 'Restauración de Techo',
          chromeDelete: 'Chrome Delete',
          trimWrapping: 'Envoltura de Molduras',
          autoPolish: 'Pulido de Auto',
          ceramicProtection: 'Protección Cerámica',
          interiorDetailingDesc: 'Limpieza y protección completa del interior',
          exteriorDetailingDesc: 'Lavado, pulido y protección de la pintura',
          ambientLightingDesc: 'Instalación de iluminación ambiental en el interior',
          starlightCeilingDesc: 'Iluminación de techo de lujo con estrellas LED',
          ceilingRestorationDesc: 'Reparación y renovación del forro del techo',
          chromeDeleteDesc: 'Acabado negro mate de partes cromadas',
          trimWrappingDesc: 'Envoltura de molduras interiores y exteriores',
          autoPolishDesc: 'Corrección de pintura y restauración del brillo',
          ceramicProtectionDesc: 'Revestimiento duradero para protección de pintura'
        },
        
        section5: {
          title: '5. Responsabilidad Legal',
          generalLiability: '5.1 Responsabilidad General',
          generalLiabilityText: 'Spectra AutoArt es responsable por daños causados durante la realización de nuestros servicios, con un máximo del valor de la factura del servicio relevante, a menos que haya intención o negligencia grave.',
          exclusions: '5.2 Exclusiones',
          exclusionsText: 'No somos responsables por:',
          existingDefects: 'Daños causados por defectos existentes en el vehículo',
          valueDepreciation: 'Depreciación del valor del vehículo',
          indirectDamage: 'Daños indirectos o consecuentes',
          postLocationDamage: 'Daños que ocurran después de dejar nuestra ubicación',
          personalItemsLoss: 'Pérdida de pertenencias personales del vehículo',
          insurance: '5.3 Seguro',
          insuranceText: 'Spectra AutoArt está asegurado contra responsabilidad comercial. Nuestra póliza de seguro cubre daños hasta €1.000.000 por evento.'
        },
        
        section6: {
          title: '6. Procedimiento de Quejas',
          intro: '¿No está satisfecho con nuestro servicio? Por favor siga nuestro procedimiento de quejas:',
          step1: 'Notificación',
          step1Text: 'Dentro de los 7 días después de la finalización del servicio',
          step2: 'Por Escrito',
          step2Text: 'Por email a complaints@spectraautoart.nl',
          step3: 'Procesamiento',
          step3Text: 'Nos pondremos en contacto dentro de 5 días laborables',
          step4: 'Solución',
          step4Text: 'Nos esforzamos por una solución apropiada dentro de 30 días',
          step5: 'Escalación',
          step5Text: 'Comisión independiente de disputas si es necesario'
        },
        
        section7: {
          title: '7. Propiedad Intelectual',
          intro: 'Todos los derechos reservados. Ninguna parte de este sitio web o nuestros materiales de marketing puede ser reproducida, almacenada en una base de datos automatizada, o hecha pública, en cualquier forma o de cualquier manera, ya sea electrónica, mecánica, por fotocopias, grabaciones, o de cualquier otra forma, sin permiso previo por escrito de Spectra AutoArt.',
          trademarks: 'Marcas Comerciales',
          trademarksText: 'Spectra AutoArt™ es un nombre comercial de nuestra empresa. Todas las demás marcas y nombres comerciales son propiedad de sus respectivos dueños.'
        },
        
        section8: {
          title: '8. Privacidad y Protección de Datos',
          intro: 'Spectra AutoArt está registrado con la Autoridad de Protección de Datos de los Países Bajos como responsable del tratamiento. Nuestro número de registro se proporcionará una vez que se complete el registro.',
          moreInfo: 'Para más información sobre cómo manejamos sus datos personales, vea nuestro'
        },
        
        section9: {
          title: '9. Derecho Aplicable',
          content: 'Todos los acuerdos y servicios de Spectra AutoArt están sujetos al derecho neerlandés. Las disputas serán sometidas al tribunal competente en Tilburg, a menos que el derecho imperativo designe otro tribunal competente.'
        },
        
        section10: {
          title: '10. Cambios',
          content: 'Esta información legal puede ser modificada. Los cambios se anunciarán a través de nuestro sitio web. La versión más actual siempre está disponible en esta página.'
        },
        
        // GDPR page translations
        gdpr: {
          title: 'Información AVG / GDPR',
          lastUpdated: 'Última actualización: 27 de noviembre de 2025',
          
          section1: {
            title: '1. Reglamento General de Protección de Datos (GDPR)',
            content: 'Spectra AutoArt cumple plenamente con el Reglamento General de Protección de Datos (GDPR), también conocido como AVG (Algemene Verordening Gegevensbescherming). Este reglamento se aplica a todas las empresas dentro de la Unión Europea que procesan datos personales.'
          },
          
          section2: {
            title: '2. Responsable del Tratamiento',
            companyName: 'Nombre de la Empresa',
            companyNameValue: 'Spectra AutoArt',
            address: 'Dirección',
            addressValue: 'Centro de Tilburg',
            email: 'Correo Electrónico',
            emailValue: 'privacy@spectraautoart.nl',
            kvkNumber: 'Número de Cámara de Comercio',
            kvkNumberValue: '[pendiente de registro]',
            phone: 'Teléfono',
            phoneValue: '+31 6 12345678'
          },
          
          section3: {
            title: '3. Delegado de Protección de Datos (DPO)',
            intro: 'Para todas sus preguntas y solicitudes relacionadas con la protección de datos, puede contactar con nuestro Delegado de Protección de Datos:',
            email: 'Correo Electrónico',
            emailValue: 'dpo@spectraautoart.nl',
            phone: 'Teléfono',
            phoneValue: '+31 6 12345678'
          },
          
          section4: {
            title: '4. Finalidades del Tratamiento y Bases Legales',
            intro: 'Procesamos datos personales para los siguientes fines:',
            
            serviceProvision: {
              title: '4.1 Prestación de Servicios',
              purpose: 'Finalidad: Realización de servicios de detailing y estilismo de autos',
              legalBasis: 'Base Legal: Contrato (Art. 6(1)(b) GDPR)',
              data: 'Datos: Datos de contacto, información del vehículo, datos de citas'
            },
            
            customerCommunication: {
              title: '4.2 Comunicación con Clientes',
              purpose: 'Finalidad: Comunicación sobre citas, servicios y postventa',
              legalBasis: 'Base Legal: Contrato (Art. 6(1)(b) GDPR)',
              data: 'Datos: Nombre, email, número de teléfono'
            },
            
            billing: {
              title: '4.3 Facturación y Administración',
              purpose: 'Finalidad: Administración financiera y declaraciones de impuestos',
              legalBasis: 'Base Legal: Obligación legal (Art. 6(1)(c) GDPR)',
              data: 'Datos: Dirección de facturación, datos de pago, historial de transacciones'
            },
            
            marketing: {
              title: '4.4 Marketing (opcional)',
              purpose: 'Finalidad: Boletines informativos y actividades promocionales',
              legalBasis: 'Base Legal: Consentimiento (Art. 6(1)(a) GDPR)',
              data: 'Datos: Dirección de email, nombre, preferencias'
            }
          },
          
          section5: {
            title: '5. Categorías de Datos Personales',
            intro: 'Procesamos las siguientes categorías de datos personales:',
            items: [
              'Datos de identificación: Nombre, dirección, datos de contacto',
              'Datos del vehículo: Matrícula, marca, modelo, año de fabricación',
              'Datos financieros: Dirección de facturación, datos de pago',
              'Datos de comunicación: Correspondencia por email, llamadas telefónicas',
              'Datos del sitio web: Dirección IP, cookies, comportamiento del usuario'
            ]
          },
          
          section6: {
            title: '6. Períodos de Conservación',
            intro: 'Aplicamos los siguientes períodos de conservación para diferentes categorías de datos:',
            
            customerData: {
              title: '6.1 Datos de Clientes',
              period: 'Período: 7 años después de la última transacción',
              reason: 'Razón: Obligación legal de la ley fiscal'
            },
            
            invoiceData: {
              title: '6.2 Datos de Facturación y Contabilidad',
              period: 'Período: 7 años',
              reason: 'Razón: Artículo 52 de la Ley del Impuesto sobre el Valor Añadido'
            },
            
            marketingData: {
              title: '6.3 Datos de Marketing',
              period: 'Período: 2 años después de la última interacción o hasta darse de baja',
              reason: 'Razón: El consentimiento puede ser retirado en cualquier momento'
            },
            
            websiteLogs: {
              title: '6.4 Registros del Sitio Web',
              period: 'Período: 1 año',
              reason: 'Razón: Seguridad y análisis'
            }
          },
          
          section7: {
            title: '7. Sus Derechos bajo el GDPR',
            intro: 'Como interesado, usted tiene los siguientes derechos:',
            
            rightOfAccess: {
              title: '7.1 Derecho de Acceso (Art. 15 GDPR)',
              content: 'Tiene derecho a saber si procesamos sus datos personales y, en caso afirmativo, qué datos son.'
            },
            
            rightToRectification: {
              title: '7.2 Derecho de Rectificación (Art. 16 GDPR)',
              content: 'Puede solicitar la corrección de datos personales incorrectos o incompletos.'
            },
            
            rightToErasure: {
              title: '7.3 Derecho de Supresión (Art. 17 GDPR)',
              content: 'Bajo ciertas circunstancias, puede solicitar la eliminación de sus datos personales.'
            },
            
            rightToRestriction: {
              title: '7.4 Derecho a la Limitación del Tratamiento (Art. 18 GDPR)',
              content: 'Puede solicitar la limitación temporal del tratamiento de sus datos.'
            },
            
            rightToPortability: {
              title: '7.5 Derecho a la Portabilidad de los Datos (Art. 20 GDPR)',
              content: 'Tiene derecho a recibir sus datos en un formato estructurado, de uso común y legible por máquina.'
            },
            
            rightToObject: {
              title: '7.6 Derecho de Oposición (Art. 21 GDPR)',
              content: 'Puede oponerse al tratamiento de sus datos personales.'
            },
            
            rightToWithdraw: {
              title: '7.7 Derecho a Retirar el Consentimiento',
              content: 'Puede retirar su consentimiento para el tratamiento de datos en cualquier momento.'
            }
          },
          
          section8: {
            title: '8. Ejercicio de Sus Derechos',
            intro: 'Puede ejercer sus derechos contactando con nuestro Delegado de Protección de Datos:',
            email: 'Correo Electrónico: dpo@spectraautoart.nl',
            phone: 'Teléfono: +31 6 12345678',
            address: 'Dirección: Spectra AutoArt, Tilburg',
            responseTime: 'Respondemos a su solicitud dentro de 1 mes. Para solicitudes complejas, podemos ampliar este plazo en 2 meses.'
          },
          
          section9: {
            title: '9. Derecho a Presentar una Queja',
            intro: '¿Tiene quejas sobre el tratamiento de sus datos personales? Puede contactar con nuestro Delegado de Protección de Datos. También tiene derecho a presentar una queja ante la Autoridad de Protección de Datos:',
            authority: 'Autoridad de Protección de Datos',
            authorityAddress: 'Apartado de Correos 93374, 2509 AJ La Haya, Tel: 088 - 1805 250, Sitio web: autoriteitpersoonsgegevens.nl'
          },
          
          section10: {
            title: '10. Seguridad de los Datos Personales',
            intro: 'Tomamos medidas técnicas y organizativas apropiadas para proteger sus datos:',
            items: [
              'Cifrado de datos en tránsito (SSL/TLS)',
              'Control de acceso y autenticación',
              'Actualizaciones regulares de software de seguridad',
              'Procedimientos de respaldo y recuperación',
              'Formación del personal sobre privacidad y seguridad',
              'Almacenamiento seguro de documentos físicos'
            ]
          },
          
          section11: {
            title: '11. Transferencia de Datos Fuera de la UE',
            content: 'Procesamos sus datos exclusivamente dentro de la Unión Europea. Si hubiera una transferencia fuera de la UE, garantizamos salvaguardas apropiadas como cláusulas contractuales estándar o decisiones de adecuación.'
          },
          
          section12: {
            title: '12. Cambios en Esta Política',
            content: 'Esta política de GDPR puede ser modificada. Los cambios se anunciarán a través de nuestro sitio web. Para cambios significativos, nos comunicaremos activamente con nuestros clientes.'
          }
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
      dateNotAvailable: 'Ta data jest niedostępna. Proszę wybrać inną datę.',
      dateOccupied: 'Ta data jest zajęta. Proszę wybrać inną datę.',
      dateAvailable: '✓ Data dostępna',
      checkingAvailability: 'Sprawdzanie dostępności...',
      available: 'Dostępny',
      occupied: 'Zajęty',
      closed: 'Zamknięty',
      january: 'Styczeń',
      february: 'Luty',
      march: 'Marzec',
      april: 'Kwiecień',
      may: 'Maj',
      june: 'Czerwiec',
      july: 'Lipiec',
      august: 'Sierpień',
      september: 'Wrzesień',
      october: 'Październik',
      november: 'Listopad',
      december: 'Grudzień',
      sunday: 'Niedz',
      monday: 'Pon',
      tuesday: 'Wt',
      wednesday: 'Śr',
      thursday: 'Czw',
      friday: 'Pt',
      saturday: 'Sob',
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
        description: 'Premium usługi detailingu i stylizacji samochodów. Przekształć swój pojazd dzięki naszej eksperckiej opiece i dbałości o szczegóły.',
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
      },
      
      // Cookie Policy page translations
      cookiePolicy: {
        title: 'Polityka Cookies',
        lastUpdated: 'Ostatnia aktualizacja: 27 listopada 2025',
        
        section1: {
          title: '1. Czym są pliki cookies?',
          content: 'Pliki cookies to małe pliki tekstowe, które są przechowywane na Twoim komputerze, tablecie lub telefonie komórkowym podczas odwiedzania naszej strony internetowej. Są one wykorzystywane do poprawy Twojego doświadczenia użytkownika i zbierania informacji o Twojej wizycie.'
        },
        
        section2: {
          title: '2. Jakich cookies używamy?',
          intro: 'Używamy następujących rodzajów cookies:',
          
          subsection1: {
            title: '2.1 Cookies funkcjonalne (wymagane)',
            intro: 'Te cookies są niezbędne do funkcjonowania naszej strony internetowej:',
            items: [
              'Preferencje językowe: Zapamiętuje Twój wybrany język',
              'ID sesji: Utrzymuje Twoją sesję aktywną podczas rezerwacji',
              'Preferencje użytkownika: Zapisuje Twoje preferencje'
            ]
          },
          
          subsection2: {
            title: '2.2 Cookies analityczne',
            intro: 'Te cookies pomagają nam zrozumieć, jak odwiedzający korzystają z naszej strony internetowej:',
            items: [
              'Google Analytics: Analizuje ruch na stronie internetowej i zachowanie użytkowników',
              'Statystyki odwiedzających: Mierzy popularność stron',
              'Analiza wydajności: Identyfikuje problemy techniczne'
            ]
          },
          
          subsection3: {
            title: '2.3 Cookies marketingowe',
            intro: 'Te cookies są wykorzystywane do celów marketingowych:',
            items: [
              'Integracja z mediami społecznościowymi: Udostępnianie poprzez przyciski mediów społecznościowych',
              'Remarketing: Ukierunkowane reklamy (tylko za zgodą)'
            ]
          }
        },
        
        section3: {
          title: '3. Przegląd cookies',
          intro: 'Poniżej znajdziesz przegląd cookies, których używamy:',
          tableHeaders: {
            name: 'Nazwa Cookie',
            type: 'Typ',
            purpose: 'Cel',
            expiry: 'Wygaśnięcie'
          },
          cookies: [
            {
              name: 'language_preference',
              type: 'Funkcjonalne',
              purpose: 'Zapamiętuje preferencje językowe',
              expiry: '1 rok'
            },
            {
              name: 'session_id',
              type: 'Funkcjonalne',
              purpose: 'Utrzymuje sesję aktywną',
              expiry: 'Sesja'
            },
            {
              name: '_ga',
              type: 'Analityczne',
              purpose: 'Śledzenie Google Analytics',
              expiry: '2 lata'
            },
            {
              name: '_gid',
              type: 'Analityczne',
              purpose: 'Sesja Google Analytics',
              expiry: '24 godziny'
            },
            {
              name: 'cookie_consent',
              type: 'Funkcjonalne',
              purpose: 'Zapamiętuje zgodę na cookies',
              expiry: '1 rok'
            }
          ]
        },
        
        section4: {
          title: '4. Zarządzanie cookies',
          intro: 'Możesz zarządzać cookies poprzez ustawienia swojej przeglądarki. Oto instrukcje dla najpopularniejszych przeglądarek:',
          browsers: [
            'Google Chrome',
            'Mozilla Firefox',
            'Microsoft Edge',
            'Safari'
          ]
        },
        
        section5: {
          title: '5. Skutki odmowy cookies',
          intro: 'Jeśli odmówisz lub usuniesz cookies, może to ograniczyć funkcjonalność naszej strony internetowej:',
          items: [
            'Możesz być zmuszony do wielokrotnego ustawiania preferencji językowych',
            'Proces rezerwacji może być mniej płynny',
            'Niektóre funkcje strony internetowej mogą nie działać poprawnie',
            'Nie możemy zapamiętać Twoich preferencji'
          ]
        },
        
        section6: {
          title: '6. Cookies podmiotów trzecich',
          intro: 'Niektóre cookies są umieszczane przez podmioty trzecie:',
          items: [
            'Google Analytics: Do analizy strony internetowej',
            'Media społecznościowe: Do integracji z platformami mediów społecznościowych'
          ],
          outro: 'Nie mamy kontroli nad tym, jak te podmioty trzecie wykorzystują cookies. Prosimy o zapoznanie się z ich polityką prywatności, aby uzyskać więcej informacji.'
        },
        
        section7: {
          title: '7. Aktualizacje tej polityki',
          content: 'Ta polityka cookies może być aktualizowana, gdy wprowadzamy zmiany w naszym wykorzystywaniu cookies. Zalecamy regularne sprawdzanie tej polityki.'
        },
        
        section8: {
          title: '8. Kontakt',
          intro: 'W przypadku pytań o tę politykę cookies możesz się z nami skontaktować:',
          contact: 'Spectra AutoArt<br>Email: privacy@spectraautoart.nl<br>Telefon: +31 6 12345678'
        }
      },
      
      // Contact & Legal Information page translations
      contactLegal: {
        title: 'Informacje Kontaktowe i Prawne',
        lastUpdated: 'Ostatnia aktualizacja: 27 listopada 2025',
        
        section1: {
          title: '1. Informacje o Firmie',
          companyName: 'Nazwa Firmy',
          tradeName: 'Nazwa Handlowa',
          legalForm: 'Forma Prawna',
          located: 'Lokalizacja',
          kvkNumber: 'Numer Izby Handlowej',
          vatNumber: 'Numer VAT',
          companyNameValue: 'Spectra AutoArt',
          tradeNameValue: 'Spectra AutoArt',
          legalFormValue: 'Jednoosobowa działalność gospodarcza',
          locatedValue: 'Tilburg, Holandia',
          kvkNumberValue: '[Do zarejestrowania]',
          vatNumberValue: '[Do zarejestrowania]'
        },
        
        section2: {
          title: '2. Informacje Kontaktowe',
          generalContact: '2.1 Ogólne Informacje Kontaktowe',
          address: 'Adres',
          communicationChannels: '2.2 Kanały Komunikacji',
          phone: 'Telefon',
          emailGeneral: 'Email Ogólny',
          emailAppointments: 'Email Wizyt',
          emailSupport: 'Email Wsparcia',
          whatsappBusiness: '2.3 WhatsApp Business',
          whatsapp: 'WhatsApp',
          availability: 'Dostępność',
          socialMedia: '2.4 Media Społecznościowe',
          instagram: 'Instagram',
          facebook: 'Facebook',
          linkedin: 'LinkedIn',
          addressValue: 'Spectra AutoArt<br>Centrum Miasta Tilburg<br>[Nazwa ulicy zostanie podana po rejestracji]<br>[Kod Pocztowy] Tilburg<br>Holandia',
          phoneValue: '+31 6 12345678',
          emailGeneralValue: 'info@spectraautoart.nl',
          emailAppointmentsValue: 'bookings@spectraautoart.nl',
          emailSupportValue: 'support@spectraautoart.nl',
          whatsappValue: '+31 6 12345678',
          availabilityValue: 'Poniedziałek do soboty, 9:00 - 18:00',
          instagramValue: '@spectraautoart',
          facebookValue: 'Spectra AutoArt',
          linkedinValue: 'Spectra AutoArt'
        },
        
        section3: {
          title: '3. Godziny Otwarcia',
          monday: 'Poniedziałek',
          tuesday: 'Wtorek',
          wednesday: 'Środa',
          thursday: 'Czwartek',
          friday: 'Piątek',
          saturday: 'Sobota',
          sunday: 'Niedziela',
          closed: 'Zamknięte',
          hoursValue: '9:00 - 18:00',
          saturdayHours: '9:00 - 16:00',
          note: 'Uwaga',
          noteText: 'Wizyty poza godzinami otwarcia są dostępne po wcześniejszym uzgodnieniu. Prosimy o kontakt w celu omówienia możliwości.'
        },
        
        section4: {
          title: '4. Usługi i Specjalizacje',
          intro: 'Spectra AutoArt specjalizuje się w premium detailing i styling usługach samochodowych:',
          interiorDetailing: 'Detailing Wnętrza',
          exteriorDetailing: 'Detailing Zewnętrzny',
          ambientLighting: 'Oświetlenie Ambient',
          starlightCeiling: 'Sufit Gwiezdny',
          ceilingRestoration: 'Restauracja Podsufitki',
          chromeDelete: 'Chrome Delete',
          trimWrapping: 'Oklejanie Listew',
          autoPolish: 'Polerowanie Auta',
          ceramicProtection: 'Ochrona Ceramiczna',
          interiorDetailingDesc: 'Kompletne czyszczenie i ochrona wnętrza',
          exteriorDetailingDesc: 'Mycie, polerowanie i ochrona lakieru',
          ambientLightingDesc: 'Instalacja oświetlenia ambient w wnętrzu',
          starlightCeilingDesc: 'Luksusowe oświetlenie sufitu z LED gwiazdami',
          ceilingRestorationDesc: 'Naprawa i odnowienie podsufitki',
          chromeDeleteDesc: 'Matowe czarne wykończenie chromowanych elementów',
          trimWrappingDesc: 'Oklejanie listew wewnętrznych i zewnętrznych',
          autoPolishDesc: 'Korekta lakieru i przywrócenie połysku',
          ceramicProtectionDesc: 'Trwała powłoka do ochrony lakieru'
        },
        
        section5: {
          title: '5. Odpowiedzialność Prawna',
          generalLiability: '5.1 Odpowiedzialność Ogólna',
          generalLiabilityText: 'Spectra AutoArt ponosi odpowiedzialność za szkody wyrządzone podczas wykonywania naszych usług, z maksymalną wartością faktury za daną usługę, chyba że występuje zamiar lub rażące niedbalstwo.',
          exclusions: '5.2 Wykluczenia',
          exclusionsText: 'Nie ponosimy odpowiedzialności za:',
          existingDefects: 'Szkody spowodowane przez istniejące wady pojazdu',
          valueDepreciation: 'Utratę wartości pojazdu',
          indirectDamage: 'Szkody pośrednie lub wtórne',
          postLocationDamage: 'Szkody powstałe po opuszczeniu naszej lokalizacji',
          personalItemsLoss: 'Utratę rzeczy osobistych z pojazdu',
          insurance: '5.3 Ubezpieczenie',
          insuranceText: 'Spectra AutoArt jest ubezpieczone od odpowiedzialności biznesowej. Nasza polisa ubezpieczeniowa pokrywa szkody do €1.000.000 za zdarzenie.'
        },
        
        section6: {
          title: '6. Procedura Skarg',
          intro: 'Nie jesteś zadowolony z naszej usługi? Prosimy o przestrzeganie naszej procedury skarg:',
          step1: 'Zgłoszenie',
          step1Text: 'W ciągu 7 dni po zakończeniu usługi',
          step2: 'Pisemnie',
          step2Text: 'Poprzez email na complaints@spectraautoart.nl',
          step3: 'Przetwarzanie',
          step3Text: 'Skontaktujemy się w ciągu 5 dni roboczych',
          step4: 'Rozwiązanie',
          step4Text: 'Dążymy do odpowiedniego rozwiązania w ciągu 30 dni',
          step5: 'Eskalacja',
          step5Text: 'Niezależna komisja ds. sporów w razie potrzeby'
        },
        
        section7: {
          title: '7. Własność Intelektualna',
          intro: 'Wszelkie prawa zastrzeżone. Żadna część tej strony internetowej ani naszych materiałów marketingowych nie może być powielana, przechowywana w zautomatyzowanej bazie danych ani udostępniana publicznie, w jakiejkolwiek formie lub w jakikolwiek sposób, czy to elektroniczny, mechaniczny, poprzez fotokopie, nagrania lub w jakikolwiek inny sposób, bez wcześniejszej pisemnej zgody Spectra AutoArt.',
          trademarks: 'Znaki Towarowe',
          trademarksText: 'Spectra AutoArt™ to nazwa handlowa naszej firmy. Wszystkie inne marki i nazwy handlowe są własnością ich odpowiednich właścicieli.'
        },
        
        section8: {
          title: '8. Prywatność i Ochrona Danych',
          intro: 'Spectra AutoArt jest zarejestrowany w Holenderskim Urzędzie Ochrony Danych jako administrator danych. Nasz numer rejestracyjny zostanie podany po zakończeniu rejestracji.',
          moreInfo: 'Aby uzyskać więcej informacji o tym, jak postępujemy z Twoimi danymi osobowymi, zobacz naszą'
        },
        
        section9: {
          title: '9. Prawo Właściwe',
          content: 'Wszystkie umowy i usługi Spectra AutoArt podlegają prawu holenderskiemu. Spory będą przedstawiane właściwemu sądowi w Tilburgu, chyba że prawo bezwzględnie wyznaczy inny właściwy sąd.'
        },
        
        section10: {
          title: '10. Zmiany',
          content: 'Te informacje prawne mogą ulec zmianie. Zmiany będą ogłaszane za pośrednictwem naszej strony internetowej. Najbardziej aktualna wersja jest zawsze dostępna na tej stronie.'
        },
        
        // GDPR page translations
        gdpr: {
          title: 'Informacje AVG / GDPR',
          lastUpdated: 'Ostatnia aktualizacja: 27 listopada 2025',
          
          section1: {
            title: '1. Ogólne Rozporządzenie o Ochronie Danych (RODO)',
            content: 'Spectra AutoArt w pełni przestrzega Ogólnego Rozporządzenia o Ochronie Danych (RODO), znanego również jako GDPR (General Data Protection Regulation). To rozporządzenie ma zastosowanie do wszystkich firm w Unii Europejskiej, które przetwarzają dane osobowe.'
          },
          
          section2: {
            title: '2. Administrator Danych',
            companyName: 'Nazwa Firmy',
            companyNameValue: 'Spectra AutoArt',
            address: 'Adres',
            addressValue: 'Centrum Tilburg',
            email: 'Email',
            emailValue: 'privacy@spectraautoart.nl',
            kvkNumber: 'Numer Krajowego Rejestru Sądowego',
            kvkNumberValue: '[do zarejestrowania]',
            phone: 'Telefon',
            phoneValue: '+31 6 12345678'
          },
          
          section3: {
            title: '3. Inspektor Ochrony Danych (IOD)',
            intro: 'W sprawach związanych z ochroną danych osobowych można kontaktować się z naszym Inspektorem Ochrony Danych:',
            email: 'Email',
            emailValue: 'iod@spectraautoart.nl',
            phone: 'Telefon',
            phoneValue: '+31 6 12345678'
          },
          
          section4: {
            title: '4. Cele Przetwarzania i Podstawy Prawne',
            intro: 'Przetwarzamy dane osobowe w następujących celach:',
            
            serviceProvision: {
              title: '4.1 Świadczenie Usług',
              purpose: 'Cel: Wykonywanie usług detailingu i stylizacji samochodów',
              legalBasis: 'Podstawa Prawna: Umowa (Art. 6(1)(b) RODO)',
              data: 'Dane: Dane kontaktowe, informacje o pojeździe, dane o spotkaniach'
            },
            
            customerCommunication: {
              title: '4.2 Komunikacja z Klientami',
              purpose: 'Cel: Komunikacja w sprawie spotkań, usług i obsługi posprzedażowej',
              legalBasis: 'Podstawa Prawna: Umowa (Art. 6(1)(b) RODO)',
              data: 'Dane: Imię, email, numer telefonu'
            },
            
            billing: {
              title: '4.3 Fakturowanie i Administracja',
              purpose: 'Cel: Administracja finansowa i deklaracje podatkowe',
              legalBasis: 'Podstawa Prawna: Obowiązek prawny (Art. 6(1)(c) RODO)',
              data: 'Dane: Adres rozliczeniowy, dane płatności, historia transakcji'
            },
            
            marketing: {
              title: '4.4 Marketing (opcjonalny)',
              purpose: 'Cel: Biuletyny informacyjne i działania promocyjne',
              legalBasis: 'Podstawa Prawna: Zgoda (Art. 6(1)(a) RODO)',
              data: 'Dane: Adres email, imię, preferencje'
            }
          },
          
          section5: {
            title: '5. Kategorie Danych Osobowych',
            intro: 'Przetwarzamy następujące kategorie danych osobowych:',
            items: [
              'Dane identyfikacyjne: Imię, adres, dane kontaktowe',
              'Dane pojazdu: Tablica rejestracyjna, marka, model, rok produkcji',
              'Dane finansowe: Adres rozliczeniowy, dane płatności',
              'Dane komunikacyjne: Korespondencja email, rozmowy telefoniczne',
              'Dane strony internetowej: Adres IP, pliki cookie, zachowanie użytkownika'
            ]
          },
          
          section6: {
            title: '6. Okresy Przechowywania',
            intro: 'Stosujemy następujące okresy przechowywania dla różnych kategorii danych:',
            
            customerData: {
              title: '6.1 Dane Klientów',
              period: 'Okres: 7 lat po ostatniej transakcji',
              reason: 'Powód: Obowiązek prawny ustawy podatkowej'
            },
            
            invoiceData: {
              title: '6.2 Dane Fakturowe i Księgowe',
              period: 'Okres: 7 lat',
              reason: 'Powód: Artykuł 52 Ustawy o podatku od wartości dodanej'
            },
            
            marketingData: {
              title: '6.3 Dane Marketingowe',
              period: 'Okres: 2 lata po ostatniej interakcji lub do wypisania się',
              reason: 'Powód: Zgoda może być wycofana w każdym czasie'
            },
            
            websiteLogs: {
              title: '6.4 Logi Strony Internetowej',
              period: 'Okres: 1 rok',
              reason: 'Powód: Bezpieczeństwo i analiza'
            }
          },
          
          section7: {
            title: '7. Twoje Prawa zgodnie z RODO',
            intro: 'Jako osoba, której dane dotyczą, masz następujące prawa:',
            
            rightOfAccess: {
              title: '7.1 Prawo dostępu (Art. 15 RODO)',
              content: 'Masz prawo wiedzieć, czy przetwarzamy Twoje dane osobowe i jeśli tak, to jakie dane to są.'
            },
            
            rightToRectification: {
              title: '7.2 Prawo do sprostowania (Art. 16 RODO)',
              content: 'Możesz żądać poprawienia nieprawidłowych lub niekompletnych danych osobowych.'
            },
            
            rightToErasure: {
              title: '7.3 Prawo do usunięcia (Art. 17 RODO)',
              content: 'W pewnych okolicznościach możesz żądać usunięcia swoich danych osobowych.'
            },
            
            rightToRestriction: {
              title: '7.4 Prawo do ograniczenia przetwarzania (Art. 18 RODO)',
              content: 'Możesz żądać czasowego ograniczenia przetwarzania swoich danych.'
            },
            
            rightToPortability: {
              title: '7.5 Prawo do przenoszenia danych (Art. 20 RODO)',
              content: 'Masz prawo otrzymać swoje dane w ustrukturyzowanym, powszechnie używanym formacie nadającym się do odczytu maszynowego.'
            },
            
            rightToObject: {
              title: '7.6 Prawo sprzeciwu (Art. 21 RODO)',
              content: 'Możesz sprzeciwić się przetwarzaniu swoich danych osobowych.'
            },
            
            rightToWithdraw: {
              title: '7.7 Prawo do wycofania zgody',
              content: 'Możesz wycofać swoją zgodę na przetwarzanie danych w każdym czasie.'
            }
          },
          
          section8: {
            title: '8. Wykonywanie Twoich Praw',
            intro: 'Możesz wykonywać swoje prawa kontaktując się z naszym Inspektorem Ochrony Danych:',
            email: 'Email: iod@spectraautoart.nl',
            phone: 'Telefon: +31 6 12345678',
            address: 'Adres: Spectra AutoArt, Tilburg',
            responseTime: 'Odpowiadamy na Twoją prośbę w ciągu 1 miesiąca. W przypadku złożonych próśb możemy przedłużyć ten okres o 2 miesiące.'
          },
          
          section9: {
            title: '9. Prawo do Złożenia Skargi',
            intro: 'Masz skargi dotyczące przetwarzania Twoich danych osobowych? Możesz skontaktować się z naszym Inspektorem Ochrony Danych. Masz również prawo złożyć skargę do Holenderskiego Urzędu Ochrony Danych:',
            authority: 'Holenderski Urząd Ochrony Danych',
            authorityAddress: 'Skrytka pocztowa 93374, 2509 AJ Haga, Tel: 088 - 1805 250, Strona internetowa: autoriteitpersoonsgegevens.nl'
          },
          
          section10: {
            title: '10. Bezpieczeństwo Danych Osobowych',
            intro: 'Podejmujemy odpowiednie środki techniczne i organizacyjne, aby zabezpieczyć Twoje dane:',
            items: [
              'Szyfrowanie danych podczas przesyłania (SSL/TLS)',
              'Kontrola dostępu i uwierzytelnianie',
              'Regularne aktualizacje oprogramowania bezpieczeństwa',
              'Procedury tworzenia kopii zapasowych i odzyskiwania',
              'Szkolenie personelu w zakresie prywatności i bezpieczeństwa',
              'Bezpieczne przechowywanie dokumentów fizycznych'
            ]
          },
          
          section11: {
            title: '11. Przekazywanie Danych Poza UE',
            content: 'Przetwarzamy Twoje dane wyłącznie w Unii Europejskiej. Jeśli mimo to dojdzie do przekazania poza UE, zapewniamy odpowiednie zabezpieczenia, takie jak standardowe klauzule umowne lub decyzje stosowności.'
          },
          
          section12: {
            title: '12. Zmiany w Niniejszej Polityce',
            content: 'Niniejsza polityka RODO może ulec zmianie. Zmiany będą ogłaszane za pośrednictwem naszej strony internetowej. W przypadku istotnych zmian będziemy aktywnie komunikować się z naszymi klientami.'
          }
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
      dateNotAvailable: 'Această dată nu este disponibilă. Vă rugăm selectați o altă dată.',
      dateOccupied: 'Această dată este ocupată. Vă rugăm selectați o altă dată.',
      dateAvailable: '✓ Dată disponibilă',
      checkingAvailability: 'Se verifică disponibilitatea...',
      available: 'Disponibil',
      occupied: 'Ocupat',
      closed: 'Închis',
      january: 'Ianuarie',
      february: 'Februarie',
      march: 'Martie',
      april: 'Aprilie',
      may: 'Mai',
      june: 'Iunie',
      july: 'Iulie',
      august: 'August',
      september: 'Septembrie',
      october: 'Octombrie',
      november: 'Noiembrie',
      december: 'Decembrie',
      sunday: 'Dum',
      monday: 'Lun',
      tuesday: 'Mar',
      wednesday: 'Mie',
      thursday: 'Joi',
      friday: 'Vin',
      saturday: 'Sâm',
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
        description: 'Servicii premium de detailing și styling auto. Transformă-ți vehiculul cu îngrijirea noastră expertă și atenția la detalii.',
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
      },
      
      // Cookie Policy page translations
      cookiePolicy: {
        title: 'Politica de Cookies',
        lastUpdated: 'Ultima actualizare: 27 noiembrie 2025',
        
        section1: {
          title: '1. Ce sunt cookie-urile?',
          content: 'Cookie-urile sunt fișiere text mici care sunt stocate pe computerul, tableta sau telefonul dvs. mobil atunci când vizitați site-ul nostru web. Acestea sunt utilizate pentru a vă îmbunătăți experiența de utilizare și pentru a colecta informații despre vizita dvs.'
        },
        
        section2: {
          title: '2. Ce cookie-uri folosim?',
          intro: 'Folosim următoarele tipuri de cookie-uri:',
          
          subsection1: {
            title: '2.1 Cookie-uri funcționale (necesare)',
            intro: 'Aceste cookie-uri sunt esențiale pentru funcționarea site-ului nostru web:',
            items: [
              'Preferință limbă: Își amintește limba aleasă de dvs.',
              'ID sesiune: Menține sesiunea dvs. activă în timpul rezervării',
              'Preferințe utilizator: Salvează preferințele dvs.'
            ]
          },
          
          subsection2: {
            title: '2.2 Cookie-uri analitice',
            intro: 'Aceste cookie-uri ne ajută să înțelegem cum vizitatorii folosesc site-ul nostru web:',
            items: [
              'Google Analytics: Analizează traficul site-ului web și comportamentul utilizatorului',
              'Statistici vizitatori: Măsoară popularitatea paginilor',
              'Analiză performanță: Identifică probleme tehnice'
            ]
          },
          
          subsection3: {
            title: '2.3 Cookie-uri de marketing',
            intro: 'Aceste cookie-uri sunt utilizate în scopuri de marketing:',
            items: [
              'Integrare social media: Partajare prin butoane social media',
              'Remarketing: Reclame direcționate (doar cu consimțământ)'
            ]
          }
        },
        
        section3: {
          title: '3. Prezentare generală cookie-uri',
          intro: 'Mai jos găsiți o prezentare generală a cookie-urilor pe care le folosim:',
          tableHeaders: {
            name: 'Nume Cookie',
            type: 'Tip',
            purpose: 'Scop',
            expiry: 'Data expirării'
          },
          cookies: [
            {
              name: 'language_preference',
              type: 'Funcțional',
              purpose: 'Își amintește preferința de limbă',
              expiry: '1 an'
            },
            {
              name: 'session_id',
              type: 'Funcțional',
              purpose: 'Menține sesiunea activă',
              expiry: 'Sesiune'
            },
            {
              name: '_ga',
              type: 'Analitic',
              purpose: 'Google Analytics tracking',
              expiry: '2 ani'
            },
            {
              name: '_gid',
              type: 'Analitic',
              purpose: 'Google Analytics sesiune',
              expiry: '24 ore'
            },
            {
              name: 'cookie_consent',
              type: 'Funcțional',
              purpose: 'Își amintește consimțământul pentru cookie-uri',
              expiry: '1 an'
            }
          ]
        },
        
        section4: {
          title: '4. Gestionarea cookie-urilor',
          intro: 'Puteți gestiona cookie-urile prin setările browserului dvs. Aici găsiți instrucțiuni pentru cele mai populare browsere:',
          browsers: [
            'Google Chrome',
            'Mozilla Firefox',
            'Microsoft Edge',
            'Safari'
          ]
        },
        
        section5: {
          title: '5. Impactul refuzării cookie-urilor',
          intro: 'Dacă refuzați sau ștergeți cookie-urile, acest lucru poate limita funcționalitatea site-ului nostru web:',
          items: [
            'Este posibil să trebuiască să setați repetat preferința dvs. de limbă',
            'Procesul de rezervare poate fi mai puțin fluid',
            'Unele funcții ale site-ului web este posibil să nu funcționeze corect',
            'Nu putem să ne amintim preferințele dvs.'
          ]
        },
        
        section6: {
          title: '6. Cookie-uri ale unor terțe părți',
          intro: 'Unele cookie-uri sunt plasate de către terțe părți:',
          items: [
            'Google Analytics: Pentru analiza site-ului web',
            'Social media: Pentru integrare cu platformele social media'
          ],
          outro: 'Nu avem control asupra modului în care aceste terțe părți folosesc cookie-urile. Consultați politica lor de confidențialitate pentru mai multe informații.'
        },
        
        section7: {
          title: '7. Actualizări ale acestei politici',
          content: 'Această politică de cookie-uri poate fi actualizată atunci când facem modificări în utilizarea noastră de cookie-uri. Vă recomandăm să verificați periodic această politică.'
        },
        
        section8: {
          title: '8. Contact',
          intro: 'Pentru întrebări despre această politică de cookie-uri ne puteți contacta:',
          contact: 'Spectra AutoArt<br>Email: privacy@spectraautoart.nl<br>Telefon: +31 6 12345678'
        }
      },
      
      // Contact & Legal Information page translations
      contactLegal: {
        title: 'Informații de Contact și Legale',
        lastUpdated: 'Ultima actualizare: 27 noiembrie 2025',
        
        section1: {
          title: '1. Informații despre Companie',
          companyName: 'Numele Companiei',
          tradeName: 'Numele Comercial',
          legalForm: 'Forma Juridică',
          located: 'Localizare',
          kvkNumber: 'Numărul Camerei de Comerț',
          vatNumber: 'Numărul TVA',
          companyNameValue: 'Spectra AutoArt',
          tradeNameValue: 'Spectra AutoArt',
          legalFormValue: 'Întreprindere Individuală',
          locatedValue: 'Tilburg, Olanda',
          kvkNumberValue: '[Urmează să fie înregistrat]',
          vatNumberValue: '[Urmează să fie înregistrat]'
        },
        
        section2: {
          title: '2. Informații de Contact',
          generalContact: '2.1 Informații Generale de Contact',
          address: 'Adresă',
          communicationChannels: '2.2 Canale de Comunicare',
          phone: 'Telefon',
          emailGeneral: 'Email General',
          emailAppointments: 'Email Programări',
          emailSupport: 'Email Suport',
          whatsappBusiness: '2.3 WhatsApp Business',
          whatsapp: 'WhatsApp',
          availability: 'Disponibilitate',
          socialMedia: '2.4 Social Media',
          instagram: 'Instagram',
          facebook: 'Facebook',
          linkedin: 'LinkedIn',
          addressValue: 'Spectra AutoArt<br>Centrul Orașului Tilburg<br>[Numele străzii va fi furnizat la înregistrare]<br>[Cod Poștal] Tilburg<br>Olanda',
          phoneValue: '+31 6 12345678',
          emailGeneralValue: 'info@spectraautoart.nl',
          emailAppointmentsValue: 'bookings@spectraautoart.nl',
          emailSupportValue: 'support@spectraautoart.nl',
          whatsappValue: '+31 6 12345678',
          availabilityValue: 'Luni până sâmbătă, 9:00 - 18:00',
          instagramValue: '@spectraautoart',
          facebookValue: 'Spectra AutoArt',
          linkedinValue: 'Spectra AutoArt'
        },
        
        section3: {
          title: '3. Program de Lucru',
          monday: 'Luni',
          tuesday: 'Marți',
          wednesday: 'Miercuri',
          thursday: 'Joi',
          friday: 'Vineri',
          saturday: 'Sâmbătă',
          sunday: 'Duminică',
          closed: 'Închis',
          hoursValue: '9:00 - 18:00',
          saturdayHours: '9:00 - 16:00',
          note: 'Notă',
          noteText: 'Programările în afara orelor de lucru sunt disponibile prin aranjament. Vă rugăm să ne contactați pentru posibilități.'
        },
        
        section4: {
          title: '4. Servicii și Specializări',
          intro: 'Spectra AutoArt se specializează în servicii premium de detailing și styling auto:',
          interiorDetailing: 'Detailing Interior',
          exteriorDetailing: 'Detailing Exterior',
          ambientLighting: 'Iluminat Ambient',
          starlightCeiling: 'Tavan cu Stele',
          ceilingRestoration: 'Restaurare Tavan',
          chromeDelete: 'Chrome Delete',
          trimWrapping: 'Înfășurare Trims',
          autoPolish: 'Polish Auto',
          ceramicProtection: 'Protecție Ceramică',
          interiorDetailingDesc: 'Curățare și protecție completă a interiorului',
          exteriorDetailingDesc: 'Spălare, polish și protecție a vopselei',
          ambientLightingDesc: 'Instalare iluminat ambient în interior',
          starlightCeilingDesc: 'Iluminat de tavan de lux cu stele LED',
          ceilingRestorationDesc: 'Reparație și reînnoire a tavanului',
          chromeDeleteDesc: 'Finisaj negru mat al pieselor cromate',
          trimWrappingDesc: 'Înfășurare de trim-uri interioare și exterioare',
          autoPolishDesc: 'Corecție vopsea și restaurare luciu',
          ceramicProtectionDesc: 'Acoperire durabilă pentru protecția vopselei'
        },
        
        section5: {
          title: '5. Răspundere Legală',
          generalLiability: '5.1 Răspundere Generală',
          generalLiabilityText: 'Spectra AutoArt este răspunzător pentru daunele cauzate în timpul efectuării serviciilor noastre, cu un maxim al valorii facturii serviciului respectiv, cu excepția cazului în care există intenție sau neglijență gravă.',
          exclusions: '5.2 Excluderi',
          exclusionsText: 'Nu suntem răspunzători pentru:',
          existingDefects: 'Daune cauzate de defecte existente ale vehiculului',
          valueDepreciation: 'Deprecierea valorii vehiculului',
          indirectDamage: 'Daune indirecte sau consecințiale',
          postLocationDamage: 'Daune care apar după părăsirea locației noastre',
          personalItemsLoss: 'Pierderea obiectelor personale din vehicul',
          insurance: '5.3 Asigurare',
          insuranceText: 'Spectra AutoArt este asigurat împotriva răspunderii comerciale. Polița noastră de asigurare acoperă daune până la €1.000.000 per eveniment.'
        },
        
        section6: {
          title: '6. Procedura de Plângeri',
          intro: 'Nu sunteți mulțumit de serviciul nostru? Vă rugăm să urmați procedura noastră de plângeri:',
          step1: 'Notificare',
          step1Text: 'În termen de 7 zile de la finalizarea serviciului',
          step2: 'În Scris',
          step2Text: 'Prin email la complaints@spectraautoart.nl',
          step3: 'Procesare',
          step3Text: 'Vă vom contacta în termen de 5 zile lucrătoare',
          step4: 'Soluție',
          step4Text: 'Ne străduim pentru o soluție adecvată în termen de 30 de zile',
          step5: 'Escaladare',
          step5Text: 'Comisie independentă de dispute dacă este necesar'
        },
        
        section7: {
          title: '7. Proprietate Intelectuală',
          intro: 'Toate drepturile rezervate. Nicio parte a acestui site web sau a materialelor noastre de marketing nu poate fi reprodusă, stocată într-o bază de date automatizată sau făcută publică, în orice formă sau în orice mod, fie electronic, mecanic, prin fotocopii, înregistrări sau în orice alt mod, fără permisiunea scrisă prealabilă a Spectra AutoArt.',
          trademarks: 'Mărci Comerciale',
          trademarksText: 'Spectra AutoArt™ este o denumire comercială a companiei noastre. Toate celelalte mărci și denumiri comerciale sunt proprietatea proprietarilor lor respectivi.'
        },
        
        section8: {
          title: '8. Confidențialitate și Protecția Datelor',
          intro: 'Spectra AutoArt este înregistrat la Autoritatea Olandeză pentru Protecția Datelor ca operator de date. Numărul nostru de înregistrare va fi furnizat odată ce înregistrarea este finalizată.',
          moreInfo: 'Pentru mai multe informații despre modul în care gestionăm datele dvs. personale, consultați'
        },
        
        section9: {
          title: '9. Legea Aplicabilă',
          content: 'Toate acordurile și serviciile Spectra AutoArt sunt supuse legii olandeze. Disputele vor fi prezentate instanței competente din Tilburg, cu excepția cazului în care legea imperativă desemnează o altă instanță competentă.'
        },
        
        section10: {
          title: '10. Modificări',
          content: 'Aceste informații legale pot fi modificate. Modificările vor fi anunțate prin intermediul site-ului nostru web. Cea mai actuală versiune este întotdeauna disponibilă pe această pagină.'
        }
      },
      
      // AVG/GDPR Information page translations
      gdpr: {
        title: 'Informații AVG/GDPR',
        lastUpdated: 'Ultima actualizare: 27 noiembrie 2025',
        
        section1: {
          title: '1. Regulamentul General privind Protecția Datelor (GDPR)',
          content: 'Spectra AutoArt respectă pe deplin Regulamentul General privind Protecția Datelor (GDPR), cunoscut și ca GDPR (General Data Protection Regulation). Acest regulament se aplică tuturor companiilor din Uniunea Europeană care procesează date personale.'
        },
        
        section2: {
          title: '2. Operatorul de Date',
          companyName: 'Numele Companiei',
          companyNameValue: 'Spectra AutoArt',
          address: 'Adresă',
          addressValue: 'Centrul orașului Tilburg',
          email: 'Email',
          emailValue: 'privacy@spectraautoart.nl',
          kvkNumber: 'Număr Cameră de Comerț',
          kvkNumberValue: '[înregistrare în curs]',
          phone: 'Telefon',
          phoneValue: '+31 6 12345678'
        },
        
        section3: {
          title: '3. Ofițerul pentru Protecția Datelor (DPO)',
          intro: 'Pentru toate întrebările și solicitările dvs. privind protecția datelor, puteți contacta Ofițerul nostru pentru Protecția Datelor:',
          email: 'Email',
          emailValue: 'dpo@spectraautoart.nl',
          phone: 'Telefon',
          phoneValue: '+31 6 12345678'
        },
        
        section4: {
          title: '4. Scopuri ale procesării și baze legale',
          intro: 'Procesăm datele dvs. personale pentru următoarele scopuri:',
          
          serviceProvision: {
            title: '4.1 Furnizare servicii',
            purpose: 'Scop:',
            purposeValue: 'Executarea serviciilor de detailing și styling auto',
            legalBasis: 'Bază legală:',
            legalBasisValue: 'Contract (art. 6 alin. 1 lit. b GDPR)',
            data: 'Date:',
            dataValue: 'Date de contact, informații despre vehicul, date de programare'
          },
          
          customerCommunication: {
            title: '4.2 Comunicare cu clienții',
            purpose: 'Scop:',
            purposeValue: 'Comunicare despre programări, servicii și post-vânzare',
            legalBasis: 'Bază legală:',
            legalBasisValue: 'Contract (art. 6 alin. 1 lit. b GDPR)',
            data: 'Date:',
            dataValue: 'Nume, email, număr de telefon'
          },
          
          billingAdministration: {
            title: '4.3 Facturare și administrare',
            purpose: 'Scop:',
            purposeValue: 'Administrare financiară și declarații fiscale',
            legalBasis: 'Bază legală:',
            legalBasisValue: 'Obligație legală (art. 6 alin. 1 lit. c GDPR)',
            data: 'Date:',
            dataValue: 'Adresă de facturare, date de plată, istoric tranzacții'
          },
          
          marketing: {
            title: '4.4 Marketing (opțional)',
            purpose: 'Scop:',
            purposeValue: 'Newslettere și promoții',
            legalBasis: 'Bază legală:',
            legalBasisValue: 'Consimțământ (art. 6 alin. 1 lit. a GDPR)',
            data: 'Date:',
            dataValue: 'Adresă email, nume, preferințe'
          }
        },
        
        section5: {
          title: '5. Categorii de date personale',
          intro: 'Procesăm următoarele categorii de date personale:',
          items: [
            'Date de identificare: Nume, adresă, date de contact',
            'Date despre vehicul: Număr de înmatriculare, marcă, model, an fabricație',
            'Date financiare: Adresă de facturare, date de plată',
            'Date de comunicare: Corespondență email, conversații telefonice',
            'Date website: Adresă IP, cookie-uri, comportament utilizator'
          ]
        },
        
        section6: {
          title: '6. Perioade de păstrare',
          intro: 'Aplicăm următoarele perioade de păstrare pentru diferite categorii de date:',
          
          customerData: {
            title: '6.1 Date despre clienți',
            period: 'Perioadă: 7 ani de la ultima tranzacție',
            reason: 'Motiv: Obligație legală fiscală'
          },
          
          invoiceData: {
            title: '6.2 Date de facturare și contabilitate',
            period: 'Perioadă: 7 ani',
            reason: 'Motiv: Articolul 52 din Legea privind taxa pe valoare adăugată'
          },
          
          marketingData: {
            title: '6.3 Date de marketing',
            period: 'Perioadă: 2 ani de la ultima interacțiune sau până la dezabonare',
            reason: 'Motiv: Consimțământul poate fi retras oricând'
          },
          
          websiteLogs: {
            title: '6.4 Log-uri website',
            period: 'Perioadă: 1 an',
            reason: 'Motiv: Securitate și analiză'
          }
        },
        
        section7: {
          title: '7. Drepturile dvs. conform GDPR',
          intro: 'Ca persoană vizată, aveți următoarele drepturi:',
          
          rightOfAccess: {
            title: '7.1 Dreptul la acces (art. 15 GDPR)',
            content: 'Aveți dreptul să știți dacă procesăm datele dvs. personale și, dacă da, care sunt aceste date.'
          },
          
          rightToRectification: {
            title: '7.2 Dreptul la rectificare (art. 16 GDPR)',
            content: 'Puteți solicita corectarea datelor personale incorecte sau incomplete.'
          },
          
          rightToErasure: {
            title: '7.3 Dreptul la ștergere (art. 17 GDPR)',
            content: 'În anumite circumstanțe, puteți solicita ștergerea datelor dvs. personale.'
          },
          
          rightToRestriction: {
            title: '7.4 Dreptul la restricționarea procesării (art. 18 GDPR)',
            content: 'Puteți solicita restricționarea temporară a procesării datelor dvs.'
          },
          
          rightToPortability: {
            title: '7.5 Dreptul la portabilitatea datelor (art. 20 GDPR)',
            content: 'Aveți dreptul să primiți datele dvs. într-un format structurat, utilizat în mod obișnuit și care poate fi citit automat.'
          },
          
          rightToObject: {
            title: '7.6 Dreptul la obiecție (art. 21 GDPR)',
            content: 'Puteți obiecta la procesarea datelor dvs. personale.'
          },
          
          rightToWithdraw: {
            title: '7.7 Dreptul de retragere a consimțământului',
            content: 'Puteți retrage oricând consimțământul dvs. pentru procesarea datelor.'
          }
        },
        
        section8: {
          title: '8. Exercitarea drepturilor dvs.',
          intro: 'Puteți exercita drepturile dvs. contactând Ofițerul nostru pentru Protecția Datelor:',
          email: 'Email: dpo@spectraautoart.nl',
          phone: 'Telefon: +31 6 12345678',
          address: 'Adresă: Spectra AutoArt, Tilburg',
          responseTime: 'Răspundem în termen de 1 lună la solicitarea dvs. Pentru solicitări complexe, putem prelungi acest termen cu 2 luni.'
        },
        
        section9: {
          title: '9. Dreptul la plângere',
          intro: 'Aveți reclamații privind procesarea datelor dvs. personale? Puteți contacta Ofițerul nostru pentru Protecția Daten. De asemenea, aveți dreptul să depuneți o plângere la Autoritatea pentru Protecția Datelor:',
          authority: 'Autoritatea pentru Protecția Datelor',
          authorityAddress: 'Olanda<br>Telefon: 088 - 1805 250<br>Website: autoriteitpersoonsgegevens.nl'
        },
        
        section10: {
          title: '10. Securitatea datelor personale',
          intro: 'Luăm măsuri tehnice și organizatorice adecvate pentru a vă securiza datele:',
          items: [
            'Criptarea datelor în tranzit (SSL/TLS)',
            'Controlul accesului și autentificare',
            'Actualizări regulate ale software-ului de securitate',
            'Proceduri de backup și recuperare',
            'Instruirea angajaților despre confidențialitate și securitate',
            'Stocare securizată a documentelor fizice'
          ]
        },
        
        section11: {
          title: '11. Transferul datelor în afara UE',
          content: 'Procesăm datele dvs. exclusiv în cadrul Uniunii Europene. Dacă totuși există un transfer în afara UE, vom asigura garanții adecvate precum clauze contractuale standard sau decizii de adecvare.'
        },
        
        section12: {
          title: '12. Modificări ale acestei politici',
          content: 'Această politică GDPR poate fi modificată. Modificările vor fi anunțate prin intermediul site-ului nostru web. Pentru modificări semnificative, vom comunica activ către clienții noștri.'
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