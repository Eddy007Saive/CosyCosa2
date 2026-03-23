import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        properties: "Nos Locations",
        conciergerie: "Conciergerie",
        contact: "Contact",
        book: "Réserver"
      },
      hero: {
        tagline: "CORSE DU SUD",
        title: "Votre Conciergerie En Corse du Sud",
        subtitle: "Valoriser. Accueillir. Enchanter.",
        cta: "Prendre rendez-vous"
      },
      welcome: {
        tagline: "BIENVENUE",
        title: "Expert en Location Courte Durée",
        p1: "Cosy Casa vous propose ses services pour déléguer en toute sérénité et maximiser vos performances !",
        p2: "Fini les tracas opérationnels, place à la tranquillité d'esprit. Votre logement est entre de bonnes mains, pour offrir à vos voyageurs une expérience fluide et sans souci."
      },
      owner: {
        tagline: "PROPRIÉTAIRES",
        title: "Vous êtes propriétaire",
        desc: "Libérez-vous des soucis liés à l'intendance de votre bien grâce à notre service de conciergerie.",
        desc2: "Notre méthodologie et nos outils professionnels vous garantissent une rentabilité maximum et une parfaite tranquillité d'esprit.",
        motto: "Ne rien faire… mais le faire bien !",
        services: {
          s1: "Trouver des locataires",
          s2: "Organiser le planning des réservations",
          s3: "Accueillir et servir les voyageurs",
          s4: "Entretenir votre logement",
          s5: "Palier aux imprévus"
        },
        cta: "Détails de nos services"
      },
      traveler: {
        tagline: "VOYAGEURS",
        title: "Vous êtes voyageur.",
        desc: "Explorez la facilité d'une réservation hors plateformes avec Cosy Casa.",
        desc2: "Notre gamme exclusive de logements vous propose une expérience de voyage sans souci.",
        desc3: "Laissez vous accueillir comme un invité et découvrez nos bonnes adresses, services et idées d'activités.",
        cta: "Découvrir nos biens"
      },
      testimonials: {
        title: "Témoignages",
        items: [
          { text: "Excellent contact, Julie est très professionnelle et soucieuse du détail. A recommander !", author: "Stéphane" },
          { text: "Magnifique, à l'écoute, conseil, prestation à la hauteur.", author: "Lilou" },
          { text: "Une collaboration fiable et efficace. Le fonctionnement est simple et l'accès à notre tableau de bord permet de suivre en temps réel l'activité de notre logement. Un revenu régulier, devenu passif grâce à Cosy Casa.", author: "Thomas" },
          { text: "Nous faisions les choses nous-mêmes et la location nous prenait un temps fou. Sans compter les désagréments et problèmes rencontrés. Depuis que nous avons confié notre logement à Cosy Casa, nous sommes libérés et ravis de la prise en main : Nos revenus ont augmentés en ne faisant plus rien.", author: "Marie Christine" },
          { text: "Nous avons fait appel à Julie pour la location estivale de notre bien. Très à l'écoute, disponible et fiable. Je recommande !", author: "Noemi" }
        ]
      },
      blog: {
        title: "Nos tendances",
        lecci: {
          title: "Conciergerie Cosy Casa à Lecci",
          excerpt: "Cosy Casa Conciergerie Lecci vous propose un accompagnement sur mesure pour la gestion locative de vos biens en courte durée."
        },
        pinarello: {
          title: "Conciergerie Cosy Casa à Pinarello",
          excerpt: "Cosy Casa Conciergerie Pinarello vous propose un accompagnement personnalisé pour simplifier la gestion locative de vos biens."
        },
        corse: {
          title: "Conciergerie Cosy Casa en Corse",
          excerpt: "Cosy Casa Conciergerie vous propose un accompagnement sur mesure pour la gestion locative de vos biens partout en Corse."
        }
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
      properties: {
        title: "Nos Locations",
        subtitle: "Logements disponibles à la location en Corse du Sud",
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
      categories: {
        title: "Notre Sélection",
        subtitle: "Nos logements en Corse du Sud",
        vue_mer: "Vue Mer",
        vue_mer_desc: "Des panoramas à couper le souffle sur la Méditerranée",
        plage_a_pieds: "Plage à Pieds",
        plage_a_pieds_desc: "Accédez aux plus belles plages en quelques pas",
        pieds_dans_eau: "Pieds dans l'Eau",
        pieds_dans_eau_desc: "Le luxe ultime: la mer à vos pieds"
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
      conciergerie: {
        hero: {
          title: "Conciergerie Corse",
          subtitle: "Confiez la gestion de votre bien en Corse à une conciergerie locale, experte et engagée."
        },
        intro: "Cosy Casa Conciergerie vous propose un accompagnement sur mesure pour la gestion locative de vos biens en courte durée. Confiez l'organisation de votre location à une équipe expérimentée pour garantir à vos hôtes un séjour fluide, agréable et sans accroc.",
        intro2: "Avec notre conciergerie haut de gamme, bénéficiez d'un service de qualité combinant sérénité et performance locative optimale.",
        offers: {
          title: "Nos offres Cosy Casa conciergerie",
          evaluation: {
            title: "Évaluation de votre projet",
            desc: "Avant toute mise en location, nous réalisons une étude approfondie de votre bien en Corse. Cette phase inclut une analyse détaillée du marché local ainsi qu'un diagnostic précis des atouts de votre logement. À partir de ces éléments, nous élaborons une stratégie tarifaire sur mesure, pensée pour optimiser la rentabilité."
          },
          team: {
            title: "Une équipe dynamique et réactive",
            desc: "Cosy Casa s'appuie sur une équipe passionnée par l'hospitalité et experte en gestion locative saisonnière. À l'écoute de vos attentes, nous mettons en œuvre des solutions personnalisées avec pour objectif votre entière satisfaction."
          },
          network: {
            title: "Un réseau de partenaires",
            desc: "Cosy Casa travaille avec un réseau de prestataires locaux répartis sur toute la Corse, sélectionnés avec soin pour leur sérieux et leur expertise. Ménage, blanchisserie, maintenance : chaque service est assuré par des professionnels fiables."
          },
          quality: {
            title: "Gage de qualité",
            desc: "Avec plusieurs années d'expérience dans la conciergerie haut de gamme et la gestion de biens touristiques en Corse, Cosy Casa est devenu un acteur reconnu du secteur."
          }
        },
        advantages: {
          title: "Vos avantages avec la conciergerie Cosy Casa",
          time: {
            title: "Gain de temps et d'argent",
            desc: "Notre rémunération est directement liée aux performances de votre location. C'est pourquoi l'équipe Cosy Casa met tout en œuvre pour maximiser vos revenus locatifs, en s'appuyant sur une stratégie tarifaire dynamique et une gestion optimisée."
          },
          simple: {
            title: "Service simplifié",
            desc: "Avec Cosy Casa, vous profitez d'un service fluide et tout-en-un. Création des annonces, gestion du calendrier, communication avec les voyageurs, accueil et suivi : nous nous occupons de tout, de A à Z."
          },
          engagement: {
            title: "Engagement et responsabilité",
            desc: "Nous veillons à l'entretien irréprochable de votre bien grâce à des prestataires compétents, rigoureux et sélectionnés avec soin."
          }
        },
        cta: "Prendre rendez-vous"
      },
      contact: {
        tagline: "CONTACT",
        title: "Nous contacter",
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
          address: "Porto-Vecchio, Corse du Sud",
          email: "contact@cosycasa.fr"
        }
      },
      footer: {
        tagline: "Conciergerie en Corse du Sud – Services premium pour propriétaires et vacanciers.",
        quickLinks: "Liens Rapides",
        contact: "Contact",
        legal: "Mentions Légales",
        privacy: "Politique de Confidentialité",
        rights: "Tous droits réservés",
        googleMyBusiness: "Voir sur Google"
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
        properties: "Rentals",
        conciergerie: "Concierge",
        contact: "Contact",
        book: "Book"
      },
      hero: {
        tagline: "SOUTHERN CORSICA",
        title: "Your Concierge Service In Southern Corsica",
        subtitle: "Enhance. Welcome. Enchant.",
        cta: "Book an appointment"
      },
      welcome: {
        tagline: "WELCOME",
        title: "Short-Term Rental Expert",
        p1: "Cosy Casa offers you services to delegate with peace of mind and maximize your performance!",
        p2: "No more operational hassles, welcome peace of mind. Your property is in good hands, offering your travelers a smooth and worry-free experience."
      },
      owner: {
        tagline: "OWNERS",
        title: "You are an owner",
        desc: "Free yourself from the worries of managing your property with our concierge service.",
        desc2: "Our methodology and professional tools guarantee you maximum profitability and perfect peace of mind.",
        motto: "Do nothing... but do it well!",
        services: {
          s1: "Find tenants",
          s2: "Organize booking schedule",
          s3: "Welcome and serve travelers",
          s4: "Maintain your property",
          s5: "Handle unexpected events"
        },
        cta: "Details of our services"
      },
      traveler: {
        tagline: "TRAVELERS",
        title: "You are a traveler.",
        desc: "Explore the ease of booking off-platform with Cosy Casa.",
        desc2: "Our exclusive range of properties offers you a worry-free travel experience.",
        desc3: "Let yourself be welcomed as a guest and discover our recommended addresses, services, and activity ideas.",
        cta: "Discover our properties"
      },
      testimonials: {
        title: "Testimonials",
        items: [
          { text: "Excellent contact, Julie is very professional and attentive to detail. Highly recommended!", author: "Stéphane" },
          { text: "Wonderful, attentive, great advice, top-notch service.", author: "Lilou" },
          { text: "A reliable and efficient collaboration. The system is simple and the dashboard allows real-time tracking of our property's activity. Regular income, now passive thanks to Cosy Casa.", author: "Thomas" },
          { text: "We used to do everything ourselves and the rental took up a huge amount of time. Not to mention the inconveniences. Since entrusting our property to Cosy Casa, we are freed and delighted: our income has increased while doing nothing.", author: "Marie Christine" },
          { text: "We called on Julie for the summer rental of our property. Very attentive, available and reliable. I recommend!", author: "Noemi" }
        ]
      },
      blog: {
        title: "Our trends",
        lecci: {
          title: "Cosy Casa Concierge in Lecci",
          excerpt: "Cosy Casa Concierge Lecci offers you tailored support for the rental management of your short-term properties."
        },
        pinarello: {
          title: "Cosy Casa Concierge in Pinarello",
          excerpt: "Cosy Casa Concierge Pinarello offers personalized support to simplify the rental management of your properties."
        },
        corse: {
          title: "Cosy Casa Concierge in Corsica",
          excerpt: "Cosy Casa Concierge offers tailored support for the rental management of your properties throughout Corsica."
        }
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
      properties: {
        title: "Our Rentals",
        subtitle: "Properties available for rent in Southern Corsica",
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
      categories: {
        title: "Our Selection",
        subtitle: "Our properties in Southern Corsica",
        vue_mer: "Sea View",
        vue_mer_desc: "Breathtaking panoramas over the Mediterranean",
        plage_a_pieds: "Beach Walking Distance",
        plage_a_pieds_desc: "Access the most beautiful beaches in just a few steps",
        pieds_dans_eau: "Waterfront",
        pieds_dans_eau_desc: "The ultimate luxury: the sea at your feet"
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
      conciergerie: {
        hero: {
          title: "Corsica Concierge",
          subtitle: "Entrust the management of your property in Corsica to a local, expert and committed concierge."
        },
        intro: "Cosy Casa Concierge offers tailored support for the rental management of your short-term properties. Entrust the organization of your rental to an experienced team to guarantee your guests a smooth, pleasant and hassle-free stay.",
        intro2: "With our premium concierge service, benefit from quality service combining serenity and optimal rental performance.",
        offers: {
          title: "Our Cosy Casa concierge offers",
          evaluation: {
            title: "Project evaluation",
            desc: "Before any rental, we carry out a thorough study of your property in Corsica. This phase includes a detailed analysis of the local market and a precise diagnosis of your property's assets."
          },
          team: {
            title: "A dynamic and responsive team",
            desc: "Cosy Casa relies on a team passionate about hospitality and expert in seasonal rental management. Attentive to your expectations, we implement personalized solutions."
          },
          network: {
            title: "A network of partners",
            desc: "Cosy Casa works with a network of local service providers throughout Corsica, carefully selected for their reliability and expertise."
          },
          quality: {
            title: "Quality guarantee",
            desc: "With several years of experience in premium concierge and tourist property management in Corsica, Cosy Casa has become a recognized player in the sector."
          }
        },
        advantages: {
          title: "Your advantages with Cosy Casa concierge",
          time: {
            title: "Save time and money",
            desc: "Our compensation is directly linked to the performance of your rental. That's why the Cosy Casa team does everything to maximize your rental income."
          },
          simple: {
            title: "Simplified service",
            desc: "With Cosy Casa, you enjoy a smooth, all-in-one service. Ad creation, calendar management, traveler communication, welcome and follow-up: we take care of everything."
          },
          engagement: {
            title: "Commitment and responsibility",
            desc: "We ensure the impeccable maintenance of your property through competent, rigorous and carefully selected service providers."
          }
        },
        cta: "Book an appointment"
      },
      contact: {
        tagline: "CONTACT",
        title: "Contact us",
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
          address: "Porto-Vecchio, Southern Corsica",
          email: "contact@cosycasa.fr"
        }
      },
      footer: {
        tagline: "Concierge service in Southern Corsica – Premium services for owners and vacationers.",
        quickLinks: "Quick Links",
        contact: "Contact",
        legal: "Legal Notice",
        privacy: "Privacy Policy",
        rights: "All rights reserved",
        googleMyBusiness: "View on Google"
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
        properties: "Alquileres",
        conciergerie: "Conserjería",
        contact: "Contacto",
        book: "Reservar"
      },
      hero: {
        tagline: "CÓRCEGA DEL SUR",
        title: "Su Conserjería En Córcega del Sur",
        subtitle: "Valorizar. Acoger. Encantar.",
        cta: "Pedir cita"
      },
      welcome: {
        tagline: "BIENVENIDO",
        title: "Experto en Alquiler de Corta Duración",
        p1: "Cosy Casa le ofrece sus servicios para delegar con toda tranquilidad y maximizar su rendimiento.",
        p2: "Se acabaron las complicaciones operativas, bienvenida la tranquilidad. Su alojamiento está en buenas manos."
      },
      owner: {
        tagline: "PROPIETARIOS",
        title: "Es usted propietario",
        desc: "Libérese de las preocupaciones de gestión de su propiedad con nuestro servicio de conserjería.",
        desc2: "Nuestra metodología y herramientas profesionales le garantizan una rentabilidad máxima.",
        motto: "No hacer nada… ¡pero hacerlo bien!",
        services: { s1: "Encontrar inquilinos", s2: "Organizar el planning", s3: "Acoger y servir viajeros", s4: "Mantener su alojamiento", s5: "Paliar los imprevistos" },
        cta: "Detalles de nuestros servicios"
      },
      traveler: {
        tagline: "VIAJEROS",
        title: "Es usted viajero.",
        desc: "Explore la facilidad de reservar fuera de plataformas con Cosy Casa.",
        desc2: "Nuestra gama exclusiva de alojamientos le ofrece una experiencia de viaje sin preocupaciones.",
        desc3: "Déjese acoger como un invitado y descubra nuestras direcciones, servicios e ideas de actividades.",
        cta: "Descubrir nuestras propiedades"
      },
      testimonials: {
        title: "Testimonios",
        items: [
          { text: "Excelente contacto, Julie es muy profesional y atenta al detalle. ¡La recomiendo!", author: "Stéphane" },
          { text: "Magnífico, a la escucha, buen consejo, servicio a la altura.", author: "Lilou" },
          { text: "Una colaboración fiable y eficaz. Ingresos regulares gracias a Cosy Casa.", author: "Thomas" },
          { text: "Desde que confiamos nuestro alojamiento a Cosy Casa, estamos liberados y encantados.", author: "Marie Christine" },
          { text: "Recurrimos a Julie para el alquiler de verano. Muy atenta, disponible y fiable.", author: "Noemi" }
        ]
      },
      blog: {
        title: "Nuestras tendencias",
        lecci: { title: "Conserjería Cosy Casa en Lecci", excerpt: "Acompañamiento a medida para la gestión locativa en Lecci." },
        pinarello: { title: "Conserjería Cosy Casa en Pinarello", excerpt: "Acompañamiento personalizado en Pinarello." },
        corse: { title: "Conserjería Cosy Casa en Córcega", excerpt: "Acompañamiento por toda Córcega." }
      },
      search: { title: "Encuentre su estancia ideal", checkIn: "Llegada", checkOut: "Salida", guests: "Huéspedes", guest: "huésped", guestsPlural: "huéspedes", search: "Buscar", selectDate: "Seleccionar" },
      properties: { title: "Nuestros Alquileres", subtitle: "Alojamientos disponibles en Córcega del Sur", filter: "Filtrar", all: "Todos", from: "Desde", perNight: "/ noche", beds: "habitaciones", baths: "baños", guests: "huéspedes máx", viewProperty: "Ver propiedad", contactUs: "Contáctenos", showcase: "Bajo petición" },
      categories: { title: "Nuestra Selección", subtitle: "Nuestros alojamientos", vue_mer: "Vista al Mar", vue_mer_desc: "Panoramas sobre el Mediterráneo", plage_a_pieds: "Playa a Pie", plage_a_pieds_desc: "Las playas más bellas a pocos pasos", pieds_dans_eau: "Frente al Mar", pieds_dans_eau_desc: "El lujo supremo" },
      property: { description: "Descripción", amenities: "Equipamientos", location: "Ubicación", availability: "Disponibilidad", bookNow: "Reservar ahora", contactForInfo: "Contactar", priceFrom: "Desde", perNight: "/ noche", totalPrice: "Precio total", nights: "noches", night: "noche", selectDates: "Seleccione sus fechas", guests: "Número de huéspedes" },
      booking: { title: "Finalizar reserva", summary: "Resumen", yourInfo: "Su información", firstName: "Nombre", lastName: "Apellido", email: "Email", phone: "Teléfono", specialRequests: "Peticiones especiales", confirm: "Confirmar reserva", success: "¡Reserva confirmada!", successMsg: "Recibirá un email de confirmación." },
      conciergerie: {
        hero: { title: "Conserjería Córcega", subtitle: "Confíe la gestión de su propiedad a una conserjería local, experta y comprometida." },
        intro: "Cosy Casa le ofrece un acompañamiento a medida para la gestión locativa de sus bienes.",
        intro2: "Con nuestra conserjería premium, benefíciese de un servicio de calidad.",
        offers: { title: "Nuestras ofertas", evaluation: { title: "Evaluación del proyecto", desc: "Estudio completo de su propiedad y el mercado local." }, team: { title: "Equipo dinámico y reactivo", desc: "Equipo apasionado y experto en gestión locativa." }, network: { title: "Red de socios", desc: "Red de proveedores locales seleccionados." }, quality: { title: "Garantía de calidad", desc: "Años de experiencia en conserjería premium." } },
        advantages: { title: "Sus ventajas con Cosy Casa", time: { title: "Ahorre tiempo y dinero", desc: "Maximizamos sus ingresos con tarifas dinámicas." }, simple: { title: "Servicio simplificado", desc: "Gestión completa de A a Z." }, engagement: { title: "Compromiso y responsabilidad", desc: "Mantenimiento impecable de su propiedad." } },
        cta: "Pedir cita"
      },
      contact: { tagline: "CONTACTO", title: "Contáctenos", subtitle: "Nuestro equipo está a su disposición.", form: { name: "Su nombre", email: "Su email", phone: "Teléfono (opcional)", subject: "Asunto", message: "Su mensaje", send: "Enviar", success: "¡Mensaje enviado!", error: "Error. Inténtelo de nuevo." }, info: { title: "Información", address: "Porto-Vecchio, Córcega del Sur", email: "contact@cosycasa.fr" } },
      footer: { tagline: "Conserjería en Córcega del Sur – Servicios premium.", quickLinks: "Enlaces", contact: "Contacto", legal: "Aviso Legal", privacy: "Privacidad", rights: "Todos los derechos reservados" },
      common: { loading: "Cargando...", error: "Error", back: "Volver", close: "Cerrar", save: "Guardar", cancel: "Cancelar" }
    }
  },
  it: {
    translation: {
      nav: {
        home: "Home",
        properties: "Affitti",
        conciergerie: "Concierge",
        contact: "Contatto",
        book: "Prenota"
      },
      hero: {
        tagline: "CORSICA DEL SUD",
        title: "Il Vostro Concierge In Corsica del Sud",
        subtitle: "Valorizzare. Accogliere. Incantare.",
        cta: "Prenota un appuntamento"
      },
      welcome: {
        tagline: "BENVENUTI",
        title: "Esperti in Affitti Brevi",
        p1: "Cosy Casa vi offre i suoi servizi per delegare in tutta serenità e massimizzare le prestazioni!",
        p2: "Basta problemi operativi, benvenuta la tranquillità. Il vostro alloggio è in buone mani."
      },
      owner: {
        tagline: "PROPRIETARI",
        title: "Sei un proprietario",
        desc: "Liberatevi dalle preoccupazioni di gestione con il nostro servizio di concierge.",
        desc2: "La nostra metodologia garantisce massima redditività e tranquillità.",
        motto: "Non fare nulla… ma farlo bene!",
        services: { s1: "Trovare inquilini", s2: "Organizzare il planning", s3: "Accogliere i viaggiatori", s4: "Mantenere l'alloggio", s5: "Gestire gli imprevisti" },
        cta: "Dettagli dei nostri servizi"
      },
      traveler: {
        tagline: "VIAGGIATORI",
        title: "Sei un viaggiatore.",
        desc: "Esplora la facilità di prenotare fuori dalle piattaforme con Cosy Casa.",
        desc2: "La nostra gamma esclusiva di alloggi offre un'esperienza senza pensieri.",
        desc3: "Lasciatevi accogliere come ospiti e scoprite i nostri indirizzi, servizi e idee di attività.",
        cta: "Scopri le nostre proprietà"
      },
      testimonials: {
        title: "Testimonianze",
        items: [
          { text: "Ottimo contatto, Julie è molto professionale e attenta ai dettagli. Da consigliare!", author: "Stéphane" },
          { text: "Magnifico, all'ascolto, buoni consigli, servizio all'altezza.", author: "Lilou" },
          { text: "Collaborazione affidabile ed efficace. Reddito regolare grazie a Cosy Casa.", author: "Thomas" },
          { text: "Da quando abbiamo affidato il nostro alloggio a Cosy Casa, siamo liberi e soddisfatti.", author: "Marie Christine" },
          { text: "Ci siamo rivolti a Julie per l'affitto estivo. Molto attenta e affidabile.", author: "Noemi" }
        ]
      },
      blog: {
        title: "Le nostre tendenze",
        lecci: { title: "Concierge Cosy Casa a Lecci", excerpt: "Accompagnamento su misura per la gestione locativa a Lecci." },
        pinarello: { title: "Concierge Cosy Casa a Pinarello", excerpt: "Accompagnamento personalizzato a Pinarello." },
        corse: { title: "Concierge Cosy Casa in Corsica", excerpt: "Accompagnamento su misura in tutta la Corsica." }
      },
      search: { title: "Trova il tuo soggiorno ideale", checkIn: "Check-in", checkOut: "Check-out", guests: "Ospiti", guest: "ospite", guestsPlural: "ospiti", search: "Cerca", selectDate: "Seleziona" },
      properties: { title: "I Nostri Affitti", subtitle: "Alloggi disponibili in Corsica del Sud", filter: "Filtra", all: "Tutti", from: "Da", perNight: "/ notte", beds: "camere", baths: "bagni", guests: "ospiti max", viewProperty: "Vedi proprietà", contactUs: "Contattaci", showcase: "Su richiesta" },
      categories: { title: "La Nostra Selezione", subtitle: "I nostri alloggi", vue_mer: "Vista Mare", vue_mer_desc: "Panorami sul Mediterraneo", plage_a_pieds: "Spiaggia a Piedi", plage_a_pieds_desc: "Le spiagge più belle a pochi passi", pieds_dans_eau: "Sul Mare", pieds_dans_eau_desc: "Il lusso supremo" },
      property: { description: "Descrizione", amenities: "Dotazioni", location: "Posizione", availability: "Disponibilità", bookNow: "Prenota ora", contactForInfo: "Contatta", priceFrom: "Da", perNight: "/ notte", totalPrice: "Prezzo totale", nights: "notti", night: "notte", selectDates: "Seleziona le date", guests: "Numero di ospiti" },
      booking: { title: "Completa la prenotazione", summary: "Riepilogo", yourInfo: "I tuoi dati", firstName: "Nome", lastName: "Cognome", email: "Email", phone: "Telefono", specialRequests: "Richieste speciali", confirm: "Conferma", success: "Prenotazione confermata!", successMsg: "Riceverai un'email a breve." },
      conciergerie: {
        hero: { title: "Concierge Corsica", subtitle: "Affidate la gestione della vostra proprietà a un concierge locale, esperto e impegnato." },
        intro: "Cosy Casa offre un accompagnamento su misura per la gestione locativa dei vostri beni.",
        intro2: "Con il nostro concierge premium, qualità e serenità garantite.",
        offers: { title: "Le nostre offerte", evaluation: { title: "Valutazione del progetto", desc: "Studio approfondito della proprietà e del mercato." }, team: { title: "Team dinamico e reattivo", desc: "Team appassionato e esperto in gestione locativa." }, network: { title: "Rete di partner", desc: "Fornitori locali selezionati con cura." }, quality: { title: "Garanzia di qualità", desc: "Anni di esperienza nel concierge premium." } },
        advantages: { title: "I vostri vantaggi con Cosy Casa", time: { title: "Risparmio di tempo e denaro", desc: "Massimizziamo i vostri ricavi con tariffe dinamiche." }, simple: { title: "Servizio semplificato", desc: "Gestione completa dalla A alla Z." }, engagement: { title: "Impegno e responsabilità", desc: "Manutenzione impeccabile della proprietà." } },
        cta: "Prenota un appuntamento"
      },
      contact: { tagline: "CONTATTO", title: "Contattaci", subtitle: "Il nostro team è a vostra disposizione.", form: { name: "Il vostro nome", email: "La vostra email", phone: "Telefono (opzionale)", subject: "Oggetto", message: "Il vostro messaggio", send: "Invia", success: "Messaggio inviato!", error: "Errore. Riprova." }, info: { title: "Informazioni", address: "Porto-Vecchio, Corsica del Sud", email: "contact@cosycasa.fr" } },
      footer: { tagline: "Concierge in Corsica del Sud – Servizi premium.", quickLinks: "Link Rapidi", contact: "Contatto", legal: "Note Legali", privacy: "Privacy", rights: "Tutti i diritti riservati" },
      common: { loading: "Caricamento...", error: "Errore", back: "Indietro", close: "Chiudi", save: "Salva", cancel: "Annulla" }
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
      lookupLocalStorage: 'cosycasa_language',
      caches: ['localStorage']
    }
  });

export default i18n;
