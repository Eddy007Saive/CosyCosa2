import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        properties: "Nos Biens",
        proprietaire: "Propriétaires",
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
        intendance: {
          title: "Intendance & Services à domicile",
          subtitle: "Des prestations haut de gamme pour un quotidien sans contraintes.",
          services: [
            "Se faire livrer (Petit déjeuner / presse / vin …)",
            "Se déplacer (Chauffeur privé, hélicoptère, location de voitures…)",
            "Prendre soin de soi (Massages, soins esthétiques, coach…)",
            "Personnel de maison (Chef à domicile, majordome, baby sitter…)"
          ]
        },
        experiences: {
          title: "Expériences & Loisirs",
          subtitle: "Des activités exclusives et immersives pour sublimer chaque instant de votre séjour.",
          services: [
            "Sport (Jet ski, voile, randonnées…)",
            "Aventures (Sortie bateau, balade à cheval…)",
            "Expériences (Cours de cuisine, picnic luxe, escapades…)"
          ]
        },
        custom: {
          title: "Demandes sur mesure",
          subtitle: "Parce que votre imagination est notre seule limite, confiez-nous vos envies et vos idées : nous nous chargeons de tout avec une attention sur-mesure. Qu'il s'agisse d'un tête-à-tête intime, d'un événement en petit comité ou d'une réception d'envergure, privé ou professionnel, nos équipes orchestrent chaque détail pour sublimer votre moment.",
          cta: "Nous contacter"
        },
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
      },
      proprietaire: {
        hero: {
          title: "Êtes-vous propriétaire ?",
          subtitle: "Louez votre propriété et augmentez vos revenus !",
          cta: "Contactez-nous !"
        },
        intro: {
          title: "Un accompagnement sur mesure pour votre villa",
          subtitle: "Intendance locative et suivi de propriété pour vous offrir tranquillité et valorisation de votre bien.",
          desc: "Nous veillons sur votre villa tout au long de l'année, qu'elle accueille des voyageurs ou qu'elle reste votre lieu de séjour."
        },
        mission: "Notre mission",
        locative: {
          title: "Intendance locative de votre villa",
          subtitle: "Confiez-nous votre bien et bénéficiez d'un service d'intendance locative sur mesure.",
          desc: "Nous prenons en charge l'ensemble des aspects liés aux locations afin d'offrir une expérience fluide aux propriétaires comme aux voyageurs.",
          services_title: "Nous nous occupons notamment de :",
          service1: "création, diffusion et optimisation de l'annonce",
          service2: "organisation des plannings, contrats et cautions",
          service3: "sélection et suivi des locataires",
          service4: "accueil des voyageurs et assistance pendant le séjour",
          service5: "coordination du ménage, de la blanchisserie et de l'entretien",
          service6: "suivi de la villa entre les locations",
          mission: "Valoriser votre propriété tout en vous offrant sérénité et tranquillité."
        },
        propriete: {
          title: "Intendance de votre propriété",
          subtitle: "Un accompagnement discret et fiable pour veiller sur votre villa tout au long de l'année.",
          desc: "Lorsque vous êtes absent, nous assurons le suivi de votre propriété et coordonnons les différentes interventions nécessaires à son bon fonctionnement et à sa valorisation.",
          services_title: "Services à la carte :",
          service1: "passages de contrôle réguliers de la propriété",
          service2: "aération et vérifications générales",
          service3: "coordination des prestataires (piscine, jardin, maintenance...)",
          service4: "réception de livraisons ou d'interventions techniques",
          service5: "préparation de la villa avant votre arrivée",
          service6: "organisation et suivi de travaux, rénovations ou projets d'aménagement (maître d'œuvre à disposition)",
          service7: "accompagnement personnalisé selon vos besoins",
          mission: "Préserver la qualité de votre propriété et vous offrir une totale tranquillité d'esprit."
        },
        cta: {
          title: "Parlons de votre villa",
          subtitle: "Chaque propriété étant unique, nous privilégions toujours un premier échange afin de comprendre vos attentes.",
          button: "Nous contacter"
        }
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        properties: "Properties",
        proprietaire: "Owners",
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
        intendance: {
          title: "Home Management & Services",
          subtitle: "High-end services for a stress-free daily life.",
          services: [
            "Delivery services (Breakfast / press / wine…)",
            "Transportation (Private chauffeur, helicopter, car rental…)",
            "Self-care (Massages, beauty treatments, coach…)",
            "Household staff (Private chef, butler, babysitter…)"
          ]
        },
        experiences: {
          title: "Experiences & Leisure",
          subtitle: "Exclusive and immersive activities to enhance every moment of your stay.",
          services: [
            "Sports (Jet ski, sailing, hiking…)",
            "Adventures (Boat trips, horseback riding…)",
            "Experiences (Cooking classes, luxury picnic, getaways…)"
          ]
        },
        custom: {
          title: "Custom Requests",
          subtitle: "Because your imagination is our only limit, entrust us with your desires and ideas: we take care of everything with bespoke attention. Whether it's an intimate dinner for two, a small gathering, or a large-scale reception, private or professional, our teams orchestrate every detail to elevate your moment.",
          cta: "Contact us"
        },
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
      },
      proprietaire: {
        hero: {
          title: "Are you a property owner?",
          subtitle: "Rent out your property and increase your income!",
          cta: "Contact us!"
        },
        intro: {
          title: "Tailored support for your villa",
          subtitle: "Rental management and property monitoring to offer you peace of mind and enhance the value of your property.",
          desc: "We look after your villa throughout the year, whether it welcomes travelers or remains your personal retreat."
        },
        mission: "Our mission",
        locative: {
          title: "Rental management of your villa",
          subtitle: "Entrust us with your property and benefit from a tailor-made rental management service.",
          desc: "We handle all aspects related to rentals to offer a seamless experience for both owners and travelers.",
          services_title: "We take care of:",
          service1: "creating, publishing and optimizing your listing",
          service2: "organizing schedules, contracts and deposits",
          service3: "tenant selection and follow-up",
          service4: "welcoming travelers and assistance during the stay",
          service5: "coordinating cleaning, laundry and maintenance",
          service6: "monitoring the villa between rentals",
          mission: "Enhance the value of your property while offering you serenity and peace of mind."
        },
        propriete: {
          title: "Property management",
          subtitle: "Discreet and reliable support to look after your villa throughout the year.",
          desc: "When you are away, we ensure the follow-up of your property and coordinate the various interventions necessary for its proper functioning and enhancement.",
          services_title: "À la carte services:",
          service1: "regular property inspections",
          service2: "ventilation and general checks",
          service3: "coordination of service providers (pool, garden, maintenance...)",
          service4: "receiving deliveries or technical interventions",
          service5: "preparing the villa before your arrival",
          service6: "organizing and monitoring works, renovations or development projects (project manager available)",
          service7: "personalized support according to your needs",
          mission: "Preserve the quality of your property and offer you complete peace of mind."
        },
        cta: {
          title: "Let's talk about your villa",
          subtitle: "As each property is unique, we always prefer an initial discussion to understand your expectations.",
          button: "Contact us"
        }
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        properties: "Propiedades",
        proprietaire: "Propietarios",
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
        intendance: {
          title: "Gestión del Hogar & Servicios",
          subtitle: "Servicios de alta gama para un día a día sin preocupaciones.",
          services: [
            "Servicios de entrega (Desayuno / prensa / vino…)",
            "Transporte (Chófer privado, helicóptero, alquiler de coches…)",
            "Cuidado personal (Masajes, tratamientos estéticos, coach…)",
            "Personal del hogar (Chef privado, mayordomo, niñera…)"
          ]
        },
        experiences: {
          title: "Experiencias & Ocio",
          subtitle: "Actividades exclusivas e inmersivas para sublimar cada momento de su estancia.",
          services: [
            "Deportes (Jet ski, vela, senderismo…)",
            "Aventuras (Paseos en barco, equitación…)",
            "Experiencias (Clases de cocina, picnic de lujo, escapadas…)"
          ]
        },
        custom: {
          title: "Solicitudes a medida",
          subtitle: "Porque su imaginación es nuestro único límite, confíenos sus deseos e ideas: nos encargamos de todo con una atención personalizada. Ya sea una cena íntima para dos, un evento en pequeño comité o una recepción de gran envergadura, privada o profesional, nuestros equipos orquestan cada detalle para sublimar su momento.",
          cta: "Contáctenos"
        },
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
      },
      proprietaire: {
        hero: {
          title: "¿Es usted propietario?",
          subtitle: "¡Alquile su propiedad y aumente sus ingresos!",
          cta: "¡Contáctenos!"
        },
        intro: {
          title: "Acompañamiento personalizado para su villa",
          subtitle: "Gestión de alquileres y seguimiento de propiedades para ofrecerle tranquilidad y valorización de su bien.",
          desc: "Cuidamos de su villa durante todo el año, ya sea que acoja viajeros o siga siendo su lugar de estancia."
        },
        mission: "Nuestra misión",
        locative: {
          title: "Gestión de alquileres de su villa",
          subtitle: "Confíenos su propiedad y benefíciese de un servicio de gestión de alquileres a medida.",
          desc: "Nos encargamos de todos los aspectos relacionados con los alquileres para ofrecer una experiencia fluida tanto a propietarios como a viajeros.",
          services_title: "Nos encargamos de:",
          service1: "creación, difusión y optimización del anuncio",
          service2: "organización de plannings, contratos y fianzas",
          service3: "selección y seguimiento de inquilinos",
          service4: "recepción de viajeros y asistencia durante la estancia",
          service5: "coordinación de limpieza, lavandería y mantenimiento",
          service6: "seguimiento de la villa entre alquileres",
          mission: "Valorizar su propiedad ofreciéndole serenidad y tranquilidad."
        },
        propriete: {
          title: "Gestión de su propiedad",
          subtitle: "Acompañamiento discreto y fiable para cuidar de su villa durante todo el año.",
          desc: "Cuando está ausente, aseguramos el seguimiento de su propiedad y coordinamos las diferentes intervenciones necesarias para su buen funcionamiento y valorización.",
          services_title: "Servicios a la carta:",
          service1: "visitas de control regulares de la propiedad",
          service2: "ventilación y verificaciones generales",
          service3: "coordinación de proveedores (piscina, jardín, mantenimiento...)",
          service4: "recepción de entregas o intervenciones técnicas",
          service5: "preparación de la villa antes de su llegada",
          service6: "organización y seguimiento de obras, renovaciones o proyectos de acondicionamiento (director de obra disponible)",
          service7: "acompañamiento personalizado según sus necesidades",
          mission: "Preservar la calidad de su propiedad y ofrecerle total tranquilidad."
        },
        cta: {
          title: "Hablemos de su villa",
          subtitle: "Siendo cada propiedad única, siempre privilegiamos un primer intercambio para comprender sus expectativas.",
          button: "Contáctenos"
        }
      }
    }
  },
  it: {
    translation: {
      nav: {
        home: "Home",
        properties: "Proprietà",
        proprietaire: "Proprietari",
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
        intendance: {
          title: "Gestione Casa & Servizi",
          subtitle: "Servizi di alta gamma per un quotidiano senza pensieri.",
          services: [
            "Servizi di consegna (Colazione / stampa / vino…)",
            "Trasporti (Autista privato, elicottero, noleggio auto…)",
            "Cura di sé (Massaggi, trattamenti estetici, coach…)",
            "Personale di casa (Chef privato, maggiordomo, babysitter…)"
          ]
        },
        experiences: {
          title: "Esperienze & Tempo Libero",
          subtitle: "Attività esclusive e coinvolgenti per esaltare ogni momento del vostro soggiorno.",
          services: [
            "Sport (Jet ski, vela, escursionismo…)",
            "Avventure (Gite in barca, equitazione…)",
            "Esperienze (Corsi di cucina, picnic di lusso, fughe…)"
          ]
        },
        custom: {
          title: "Richieste su misura",
          subtitle: "Perché la vostra immaginazione è il nostro unico limite, affidateci i vostri desideri e le vostre idee: ci occupiamo di tutto con un'attenzione su misura. Che si tratti di una cena intima per due, di un evento in piccolo comitato o di un ricevimento di grande portata, privato o professionale, i nostri team orchestrano ogni dettaglio per sublimare il vostro momento.",
          cta: "Contattaci"
        },
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
      },
      proprietaire: {
        hero: {
          title: "Sei un proprietario?",
          subtitle: "Affitta la tua proprietà e aumenta i tuoi guadagni!",
          cta: "Contattaci!"
        },
        intro: {
          title: "Supporto su misura per la tua villa",
          subtitle: "Gestione locativa e monitoraggio della proprietà per offrirti tranquillità e valorizzazione del tuo bene.",
          desc: "Ci prendiamo cura della tua villa durante tutto l'anno, che accolga viaggiatori o rimanga il tuo luogo di soggiorno."
        },
        mission: "La nostra missione",
        locative: {
          title: "Gestione locativa della tua villa",
          subtitle: "Affidaci la tua proprietà e beneficia di un servizio di gestione locativa su misura.",
          desc: "Ci occupiamo di tutti gli aspetti legati agli affitti per offrire un'esperienza fluida sia ai proprietari che ai viaggiatori.",
          services_title: "Ci occupiamo di:",
          service1: "creazione, diffusione e ottimizzazione dell'annuncio",
          service2: "organizzazione di planning, contratti e cauzioni",
          service3: "selezione e follow-up degli inquilini",
          service4: "accoglienza dei viaggiatori e assistenza durante il soggiorno",
          service5: "coordinamento pulizie, lavanderia e manutenzione",
          service6: "monitoraggio della villa tra gli affitti",
          mission: "Valorizzare la tua proprietà offrendoti serenità e tranquillità."
        },
        propriete: {
          title: "Gestione della tua proprietà",
          subtitle: "Supporto discreto e affidabile per prendersi cura della tua villa durante tutto l'anno.",
          desc: "Quando sei assente, assicuriamo il follow-up della tua proprietà e coordiniamo i vari interventi necessari per il suo buon funzionamento e la sua valorizzazione.",
          services_title: "Servizi à la carte:",
          service1: "controlli regolari della proprietà",
          service2: "aerazione e verifiche generali",
          service3: "coordinamento dei fornitori (piscina, giardino, manutenzione...)",
          service4: "ricezione di consegne o interventi tecnici",
          service5: "preparazione della villa prima del tuo arrivo",
          service6: "organizzazione e follow-up di lavori, ristrutturazioni o progetti di arredamento (project manager a disposizione)",
          service7: "supporto personalizzato secondo le tue esigenze",
          mission: "Preservare la qualità della tua proprietà e offrirti totale tranquillità."
        },
        cta: {
          title: "Parliamo della tua villa",
          subtitle: "Essendo ogni proprietà unica, privilegiamo sempre un primo scambio per comprendere le tue aspettative.",
          button: "Contattaci"
        }
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
