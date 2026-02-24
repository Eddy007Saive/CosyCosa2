import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        properties: "Nos Biens",
        services: "Services",
        contact: "Contact",
        book: "Réserver"
      },
      hero: {
        tagline: "CORSE DU SUD",
        title: "Où rêvez-vous d'être ?",
        quote: "Des Lieux uniques pour des moments hors du temps",
        sectors: "3 secteurs",
        criteria: "3 critères",
        subtitle: "Une sélection de propriétés d'exception en Corse du Sud. Expériences sur-mesure et conciergerie premium.",
        cta: "Découvrir nos biens"
      },
      search: {
        title: "Trouvez votre séjour idéal",
        checkIn: "Arrivée",
        checkOut: "Départ",
        guests: "Voyageurs",
        guest: "voyageur",
        guestsPlural: "voyageurs",
        search: "Rechercher",
        selectDate: "Sélectionner"
      },
      categories: {
        title: "Notre Sélection",
        subtitle: "Où rêvez-vous d'être ?",
        vue_mer: "Vue Mer",
        vue_mer_desc: "Des panoramas à couper le souffle sur la Méditerranée",
        plage_a_pieds: "Plage à Pieds",
        plage_a_pieds_desc: "Accédez aux plus belles plages en quelques pas",
        pieds_dans_eau: "Pieds dans l'Eau",
        pieds_dans_eau_desc: "Le luxe ultime: la mer à vos pieds"
      },
      concept: {
        tagline: "NOTRE CONCEPT",
        title: "L'excellence au service de vos attentes",
        p1: "Ancrés dans une démarche locale: confiance, transparence et proximité sont au cœur de nos services.",
        p2: "Nos lieux, soigneusement sélectionnés pour leur caractère unique et confidentiel, garantissent une expérience d'exception.",
        p3: "Avec une attention portée à chaque détail, nous privilégions la qualité à la quantité.",
        quality: "Qualité",
        quality_desc: "Une sélection minutieuse des lieux",
        discretion: "Discrétion",
        discretion_desc: "Un service personnalisé pour un confort absolu",
        authenticity: "Authenticité",
        authenticity_desc: "Une immersion dans des lieux au caractère unique"
      },
      services: {
        tagline: "NOS OFFRES",
        title: "Le Prestige Sur-Mesure",
        subtitle: "Parce que chaque voyage est unique, ORSO vous propose des offres sur mesure, adaptées à vos envies.",
        essentiel: {
          title: "ORSO ESSENTIEL",
          subtitle: "Vos vacances à la carte",
          desc: "Une liberté totale, agrémentée de services à la carte.",
          features: [
            "Concierge privé, chef à domicile, soins bien-être",
            "Transferts & excursions sur mesure",
            "Réservation de services en précommande"
          ]
        },
        premium: {
          title: "ORSO PREMIUM",
          subtitle: "Vos vacances sur mesure",
          desc: "Un service d'exception, une attention sur-mesure.",
          features: [
            "Majordome privé dédié à votre confort",
            "Prise en charge intégrale de votre séjour",
            "Ligne téléphonique 24/7"
          ]
        },
        learnMore: "En savoir plus"
      },
      properties: {
        title: "Nos Propriétés",
        subtitle: "Une collection de lieux d'exception en Corse du Sud",
        filter: "Filtrer par catégorie",
        all: "Toutes",
        from: "À partir de",
        perNight: "/ nuit",
        beds: "chambres",
        baths: "salles de bain",
        guests: "voyageurs max",
        viewProperty: "Voir le bien",
        contactUs: "Nous contacter",
        showcase: "Sur demande"
      },
      property: {
        description: "Description",
        amenities: "Équipements",
        location: "Localisation",
        availability: "Disponibilité",
        bookNow: "Réserver maintenant",
        contactForInfo: "Contacter pour plus d'infos",
        priceFrom: "À partir de",
        perNight: "/ nuit",
        totalPrice: "Prix total",
        nights: "nuits",
        night: "nuit",
        selectDates: "Sélectionnez vos dates",
        guests: "Nombre de voyageurs"
      },
      booking: {
        title: "Finaliser votre réservation",
        summary: "Récapitulatif",
        yourInfo: "Vos informations",
        firstName: "Prénom",
        lastName: "Nom",
        email: "Email",
        phone: "Téléphone",
        specialRequests: "Demandes spéciales",
        confirm: "Confirmer la réservation",
        success: "Réservation confirmée!",
        successMsg: "Vous recevrez un email de confirmation sous peu."
      },
      contact: {
        tagline: "CONTACT",
        title: "Contact",
        subtitle: "Notre équipe est à votre disposition pour répondre à toutes vos questions.",
        form: {
          name: "Votre nom",
          email: "Votre email",
          phone: "Téléphone (optionnel)",
          subject: "Sujet",
          message: "Votre message",
          send: "Envoyer",
          success: "Message envoyé avec succès!",
          error: "Une erreur est survenue. Veuillez réessayer."
        },
        info: {
          title: "Informations",
          address: "Sainte Lucie de Porto Vecchio, Corse du Sud",
          email: "contact@orso-rs.com"
        }
      },
      footer: {
        tagline: "Des séjours d'exception en Corse du Sud",
        quickLinks: "Liens Rapides",
        contact: "Contact",
        legal: "Mentions Légales",
        privacy: "Politique de Confidentialité",
        rights: "Tous droits réservés"
      },
      common: {
        loading: "Chargement...",
        error: "Une erreur est survenue",
        back: "Retour",
        close: "Fermer",
        save: "Enregistrer",
        cancel: "Annuler"
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        properties: "Properties",
        services: "Services",
        contact: "Contact",
        book: "Book"
      },
      hero: {
        tagline: "SOUTHERN CORSICA",
        title: "Where do you dream of being?",
        quote: "Unique places for timeless moments",
        sectors: "3 areas",
        criteria: "3 criteria",
        subtitle: "A selection of exceptional properties in Southern Corsica. Bespoke experiences and premium concierge services.",
        cta: "Discover our properties"
      },
      search: {
        title: "Find your ideal stay",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Guests",
        guest: "guest",
        guestsPlural: "guests",
        search: "Search",
        selectDate: "Select"
      },
      categories: {
        title: "Our Selection",
        subtitle: "Where do you dream of being?",
        vue_mer: "Sea View",
        vue_mer_desc: "Breathtaking panoramas over the Mediterranean",
        plage_a_pieds: "Beach Walking Distance",
        plage_a_pieds_desc: "Access the most beautiful beaches in just a few steps",
        pieds_dans_eau: "Waterfront",
        pieds_dans_eau_desc: "The ultimate luxury: the sea at your feet"
      },
      concept: {
        tagline: "OUR CONCEPT",
        title: "Excellence at the service of your expectations",
        p1: "Rooted in a local approach: trust, transparency and proximity are at the heart of our services.",
        p2: "Our properties, carefully selected for their unique and confidential character, guarantee an exceptional experience.",
        p3: "With attention to every detail, we prioritize quality over quantity.",
        quality: "Quality",
        quality_desc: "A meticulous selection of properties",
        discretion: "Discretion",
        discretion_desc: "Personalized service for absolute comfort",
        authenticity: "Authenticity",
        authenticity_desc: "An immersion in places with unique character"
      },
      services: {
        tagline: "OUR OFFERS",
        title: "Bespoke Prestige",
        subtitle: "Because every journey is unique, ORSO offers you tailor-made packages adapted to your desires.",
        essentiel: {
          title: "ORSO ESSENTIAL",
          subtitle: "Your holidays à la carte",
          desc: "Total freedom, enhanced with à la carte services.",
          features: [
            "Private concierge, private chef, wellness treatments",
            "Bespoke transfers & excursions",
            "Pre-booking of services"
          ]
        },
        premium: {
          title: "ORSO PREMIUM",
          subtitle: "Your bespoke holidays",
          desc: "Exceptional service, tailor-made attention.",
          features: [
            "Private butler dedicated to your comfort",
            "Complete management of your stay",
            "24/7 hotline"
          ]
        },
        learnMore: "Learn more"
      },
      properties: {
        title: "Our Properties",
        subtitle: "A collection of exceptional places in Southern Corsica",
        filter: "Filter by category",
        all: "All",
        from: "From",
        perNight: "/ night",
        beds: "bedrooms",
        baths: "bathrooms",
        guests: "max guests",
        viewProperty: "View property",
        contactUs: "Contact us",
        showcase: "On request"
      },
      property: {
        description: "Description",
        amenities: "Amenities",
        location: "Location",
        availability: "Availability",
        bookNow: "Book now",
        contactForInfo: "Contact for info",
        priceFrom: "From",
        perNight: "/ night",
        totalPrice: "Total price",
        nights: "nights",
        night: "night",
        selectDates: "Select your dates",
        guests: "Number of guests"
      },
      booking: {
        title: "Complete your booking",
        summary: "Summary",
        yourInfo: "Your information",
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        specialRequests: "Special requests",
        confirm: "Confirm booking",
        success: "Booking confirmed!",
        successMsg: "You will receive a confirmation email shortly."
      },
      contact: {
        tagline: "CONTACT",
        title: "Contact",
        subtitle: "Our team is at your disposal to answer all your questions.",
        form: {
          name: "Your name",
          email: "Your email",
          phone: "Phone (optional)",
          subject: "Subject",
          message: "Your message",
          send: "Send",
          success: "Message sent successfully!",
          error: "An error occurred. Please try again."
        },
        info: {
          title: "Information",
          address: "Sainte Lucie de Porto Vecchio, Southern Corsica",
          email: "contact@orso-rs.com"
        }
      },
      footer: {
        tagline: "Exceptional stays in Southern Corsica",
        quickLinks: "Quick Links",
        contact: "Contact",
        legal: "Legal Notice",
        privacy: "Privacy Policy",
        rights: "All rights reserved"
      },
      common: {
        loading: "Loading...",
        error: "An error occurred",
        back: "Back",
        close: "Close",
        save: "Save",
        cancel: "Cancel"
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        properties: "Propiedades",
        services: "Servicios",
        contact: "Contacto",
        book: "Reservar"
      },
      hero: {
        tagline: "CÓRCEGA DEL SUR",
        title: "¿Dónde sueñas estar?",
        quote: "Lugares únicos para momentos fuera del tiempo",
        sectors: "3 sectores",
        criteria: "3 criterios",
        subtitle: "Una selección de propiedades excepcionales en Córcega del Sur. Experiencias a medida y conserjería premium.",
        cta: "Descubrir nuestras propiedades"
      },
      search: {
        title: "Encuentra tu estancia ideal",
        checkIn: "Llegada",
        checkOut: "Salida",
        guests: "Huéspedes",
        guest: "huésped",
        guestsPlural: "huéspedes",
        search: "Buscar",
        selectDate: "Seleccionar"
      },
      categories: {
        title: "Nuestra Selección",
        subtitle: "¿Dónde sueñas estar?",
        vue_mer: "Vista al Mar",
        vue_mer_desc: "Panoramas impresionantes sobre el Mediterráneo",
        plage_a_pieds: "Playa a Pie",
        plage_a_pieds_desc: "Acceda a las playas más hermosas en pocos pasos",
        pieds_dans_eau: "Frente al Mar",
        pieds_dans_eau_desc: "El lujo supremo: el mar a sus pies"
      },
      concept: {
        tagline: "NUESTRO CONCEPTO",
        title: "La excelencia al servicio de sus expectativas",
        p1: "Arraigados en un enfoque local: confianza, transparencia y proximidad están en el corazón de nuestros servicios.",
        p2: "Nuestros lugares, cuidadosamente seleccionados por su carácter único y confidencial, garantizan una experiencia excepcional.",
        p3: "Con atención a cada detalle, priorizamos la calidad sobre la cantidad.",
        quality: "Calidad",
        quality_desc: "Una selección minuciosa de lugares",
        discretion: "Discreción",
        discretion_desc: "Un servicio personalizado para un confort absoluto",
        authenticity: "Autenticidad",
        authenticity_desc: "Una inmersión en lugares con carácter único"
      },
      services: {
        tagline: "NUESTRAS OFERTAS",
        title: "Prestigio a Medida",
        subtitle: "Porque cada viaje es único, ORSO le ofrece paquetes a medida adaptados a sus deseos.",
        essentiel: {
          title: "ORSO ESENCIAL",
          subtitle: "Sus vacaciones a la carta",
          desc: "Libertad total, mejorada con servicios a la carta.",
          features: [
            "Conserje privado, chef privado, tratamientos de bienestar",
            "Traslados y excursiones a medida",
            "Reserva anticipada de servicios"
          ]
        },
        premium: {
          title: "ORSO PREMIUM",
          subtitle: "Sus vacaciones a medida",
          desc: "Servicio excepcional, atención personalizada.",
          features: [
            "Mayordomo privado dedicado a su comodidad",
            "Gestión completa de su estancia",
            "Línea telefónica 24/7"
          ]
        },
        learnMore: "Más información"
      },
      properties: {
        title: "Nuestras Propiedades",
        subtitle: "Una colección de lugares excepcionales en Córcega del Sur",
        filter: "Filtrar por categoría",
        all: "Todas",
        from: "Desde",
        perNight: "/ noche",
        beds: "habitaciones",
        baths: "baños",
        guests: "huéspedes máx",
        viewProperty: "Ver propiedad",
        contactUs: "Contáctenos",
        showcase: "Bajo petición"
      },
      property: {
        description: "Descripción",
        amenities: "Equipamientos",
        location: "Ubicación",
        availability: "Disponibilidad",
        bookNow: "Reservar ahora",
        contactForInfo: "Contactar para info",
        priceFrom: "Desde",
        perNight: "/ noche",
        totalPrice: "Precio total",
        nights: "noches",
        night: "noche",
        selectDates: "Seleccione sus fechas",
        guests: "Número de huéspedes"
      },
      booking: {
        title: "Finalizar su reserva",
        summary: "Resumen",
        yourInfo: "Su información",
        firstName: "Nombre",
        lastName: "Apellido",
        email: "Email",
        phone: "Teléfono",
        specialRequests: "Peticiones especiales",
        confirm: "Confirmar reserva",
        success: "¡Reserva confirmada!",
        successMsg: "Recibirá un email de confirmación en breve."
      },
      contact: {
        tagline: "CONTACTO",
        title: "Contacto",
        subtitle: "Nuestro equipo está a su disposición para responder todas sus preguntas.",
        form: {
          name: "Su nombre",
          email: "Su email",
          phone: "Teléfono (opcional)",
          subject: "Asunto",
          message: "Su mensaje",
          send: "Enviar",
          success: "¡Mensaje enviado con éxito!",
          error: "Ocurrió un error. Por favor intente de nuevo."
        },
        info: {
          title: "Información",
          address: "Sainte Lucie de Porto Vecchio, Córcega del Sur",
          email: "contact@orso-rs.com"
        }
      },
      footer: {
        tagline: "Estancias excepcionales en Córcega del Sur",
        quickLinks: "Enlaces Rápidos",
        contact: "Contacto",
        legal: "Aviso Legal",
        privacy: "Política de Privacidad",
        rights: "Todos los derechos reservados"
      },
      common: {
        loading: "Cargando...",
        error: "Ocurrió un error",
        back: "Volver",
        close: "Cerrar",
        save: "Guardar",
        cancel: "Cancelar"
      }
    }
  },
  it: {
    translation: {
      nav: {
        home: "Home",
        properties: "Proprietà",
        services: "Servizi",
        contact: "Contatto",
        book: "Prenota"
      },
      hero: {
        tagline: "CORSICA DEL SUD",
        title: "Dove sogni di essere?",
        quote: "Luoghi unici per momenti senza tempo",
        sectors: "3 settori",
        criteria: "3 criteri",
        subtitle: "Una selezione di proprietà eccezionali in Corsica del Sud. Esperienze su misura e concierge premium.",
        cta: "Scopri le nostre proprietà"
      },
      search: {
        title: "Trova il tuo soggiorno ideale",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Ospiti",
        guest: "ospite",
        guestsPlural: "ospiti",
        search: "Cerca",
        selectDate: "Seleziona"
      },
      categories: {
        title: "La Nostra Selezione",
        subtitle: "Dove sogni di essere?",
        vue_mer: "Vista Mare",
        vue_mer_desc: "Panorami mozzafiato sul Mediterraneo",
        plage_a_pieds: "Spiaggia a Piedi",
        plage_a_pieds_desc: "Accedi alle spiagge più belle in pochi passi",
        pieds_dans_eau: "Direttamente sul Mare",
        pieds_dans_eau_desc: "Il lusso supremo: il mare ai vostri piedi"
      },
      concept: {
        tagline: "IL NOSTRO CONCETTO",
        title: "L'eccellenza al servizio delle vostre aspettative",
        p1: "Radicati in un approccio locale: fiducia, trasparenza e vicinanza sono al centro dei nostri servizi.",
        p2: "I nostri luoghi, accuratamente selezionati per il loro carattere unico e riservato, garantiscono un'esperienza eccezionale.",
        p3: "Con attenzione a ogni dettaglio, privilegiamo la qualità alla quantità.",
        quality: "Qualità",
        quality_desc: "Una selezione accurata dei luoghi",
        discretion: "Discrezione",
        discretion_desc: "Un servizio personalizzato per un comfort assoluto",
        authenticity: "Autenticità",
        authenticity_desc: "Un'immersione in luoghi dal carattere unico"
      },
      services: {
        tagline: "LE NOSTRE OFFERTE",
        title: "Prestigio Su Misura",
        subtitle: "Perché ogni viaggio è unico, ORSO vi offre pacchetti su misura adattati ai vostri desideri.",
        essentiel: {
          title: "ORSO ESSENZIALE",
          subtitle: "Le vostre vacanze à la carte",
          desc: "Totale libertà, arricchita da servizi à la carte.",
          features: [
            "Concierge privato, chef a domicilio, trattamenti benessere",
            "Trasferimenti ed escursioni su misura",
            "Prenotazione anticipata dei servizi"
          ]
        },
        premium: {
          title: "ORSO PREMIUM",
          subtitle: "Le vostre vacanze su misura",
          desc: "Servizio d'eccezione, attenzione su misura.",
          features: [
            "Maggiordomo privato dedicato al vostro comfort",
            "Gestione completa del vostro soggiorno",
            "Linea telefonica 24/7"
          ]
        },
        learnMore: "Scopri di più"
      },
      properties: {
        title: "Le Nostre Proprietà",
        subtitle: "Una collezione di luoghi eccezionali in Corsica del Sud",
        filter: "Filtra per categoria",
        all: "Tutte",
        from: "Da",
        perNight: "/ notte",
        beds: "camere",
        baths: "bagni",
        guests: "ospiti max",
        viewProperty: "Vedi proprietà",
        contactUs: "Contattaci",
        showcase: "Su richiesta"
      },
      property: {
        description: "Descrizione",
        amenities: "Dotazioni",
        location: "Posizione",
        availability: "Disponibilità",
        bookNow: "Prenota ora",
        contactForInfo: "Contatta per info",
        priceFrom: "Da",
        perNight: "/ notte",
        totalPrice: "Prezzo totale",
        nights: "notti",
        night: "notte",
        selectDates: "Seleziona le date",
        guests: "Numero di ospiti"
      },
      booking: {
        title: "Completa la prenotazione",
        summary: "Riepilogo",
        yourInfo: "I tuoi dati",
        firstName: "Nome",
        lastName: "Cognome",
        email: "Email",
        phone: "Telefono",
        specialRequests: "Richieste speciali",
        confirm: "Conferma prenotazione",
        success: "Prenotazione confermata!",
        successMsg: "Riceverai un'email di conferma a breve."
      },
      contact: {
        tagline: "CONTATTO",
        title: "Contatto",
        subtitle: "Il nostro team è a vostra disposizione per rispondere a tutte le vostre domande.",
        form: {
          name: "Il vostro nome",
          email: "La vostra email",
          phone: "Telefono (opzionale)",
          subject: "Oggetto",
          message: "Il vostro messaggio",
          send: "Invia",
          success: "Messaggio inviato con successo!",
          error: "Si è verificato un errore. Riprova."
        },
        info: {
          title: "Informazioni",
          address: "Sainte Lucie de Porto Vecchio, Corsica del Sud",
          email: "contact@orso-rs.com"
        }
      },
      footer: {
        tagline: "Soggiorni eccezionali in Corsica del Sud",
        quickLinks: "Link Rapidi",
        contact: "Contatto",
        legal: "Note Legali",
        privacy: "Privacy Policy",
        rights: "Tutti i diritti riservati"
      },
      common: {
        loading: "Caricamento...",
        error: "Si è verificato un errore",
        back: "Indietro",
        close: "Chiudi",
        save: "Salva",
        cancel: "Annulla"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'orso_language',
      caches: ['localStorage']
    }
  });

export default i18n;
