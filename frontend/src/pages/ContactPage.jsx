import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Calendar, Send, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSiteImages } from '@/lib/api';
import useSEO from '@/hooks/useSEO';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const [contactImage, setContactImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80');

  useEffect(() => {
    const loadImage = async () => {
      try {
        const data = await getSiteImages();
        if (data.images?.contact_page) {
          setContactImage(data.images.contact_page);
        }
      } catch (error) {
        console.error('Error loading contact image:', error);
      }
    };
    loadImage();
  }, []);

  useSEO({
    title: 'Contact – Conciergerie Cosy Casa en Corse du Sud',
    description: 'Contactez Cosy Casa, votre conciergerie en Corse du Sud. Gestion locative, accueil voyageurs. Porto-Vecchio, Lecci, Pinarello.',
    path: '/contact-conciergerie-cosy-casa'
  });

  return (
    <div className="pt-36" data-testid="contact-page">

      {/* Hero Section - Image + Contact Info */}
      <section className="min-h-[80vh] bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          {/* Left - Image */}
          <div className="relative h-[40vh] lg:h-auto lg:min-h-[80vh]">
            <img
              src={contactImage}
              alt="Contact Cosy Casa"
              className="w-full h-full object-cover"
              data-testid="contact-image"
            />
          </div>

          {/* Right - Contact Info */}
          <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 bg-[#f5f5f3]">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="mb-10">
                <div className="w-12 h-px bg-[#2e2e2e] mb-6" />
                <h1 className="font-serif text-3xl md:text-4xl text-[#2e2e2e] mb-4" data-testid="contact-title">
                  {t('contact.title')}
                </h1>
                <p className="text-gray-600 font-light leading-relaxed">
                  {t('contact.subtitle')}
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2e2e2e] text-white flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Cosy Casa</p>
                    <a
                      href="tel:+33615876470"
                      className="font-serif text-xl text-[#2e2e2e] hover:underline"
                      data-testid="contact-phone"
                    >
                      +33 6 15 87 64 70
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2e2e2e] text-white flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Email</p>
                    <a
                      href="mailto:contact@cosycasa.fr"
                      className="font-serif text-xl text-[#2e2e2e] hover:underline"
                      data-testid="contact-email"
                    >
                      contact@cosycasa.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2e2e2e] text-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Secteur</p>
                    <p className="font-serif text-xl text-[#2e2e2e]">Porto-Vecchio, Corse du Sud</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 mb-10">
                <a
                  href="https://www.facebook.com/profile.php?id=61556104644895"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border border-[#2e2e2e]/20 flex items-center justify-center hover:bg-[#2e2e2e] hover:text-white text-[#2e2e2e] transition-all duration-300"
                  data-testid="contact-facebook"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a
                  href="https://www.instagram.com/cosycasaconciergerie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border border-[#2e2e2e]/20 flex items-center justify-center hover:bg-[#2e2e2e] hover:text-white text-[#2e2e2e] transition-all duration-300"
                  data-testid="contact-instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" strokeWidth={1.5} />
                </a>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <a
                  href="mailto:contact@cosycasa.fr"
                  className="block"
                  data-testid="contact-write-btn"
                >
                  <Button className="w-full bg-[#2e2e2e] text-white hover:bg-black h-14 rounded-none uppercase tracking-widest text-xs font-medium transition-colors">
                    <Send className="w-4 h-4 mr-3" strokeWidth={1.5} />
                    {t('contact.writeUs')}
                  </Button>
                </a>
                <a
                  href="tel:+33615876470"
                  className="block"
                  data-testid="contact-call-btn"
                >
                  <Button variant="outline" className="w-full border-[#2e2e2e] text-[#2e2e2e] hover:bg-[#2e2e2e] hover:text-white h-14 rounded-none uppercase tracking-widest text-xs font-medium transition-colors">
                    <Phone className="w-4 h-4 mr-3" strokeWidth={1.5} />
                    {t('contact.callUs')}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Secteur Géographique */}
      <section className="orso-section bg-white" data-testid="map-section">
        <div className="orso-container">
          <div className="text-center mb-12">
            <p className="orso-caption mb-4">{t('contact.mapTagline')}</p>
            <h2 className="orso-h2">{t('contact.mapTitle')}</h2>
          </div>
          <div className="aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96000!2d9.2!3d41.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d9752c5a50b5a7%3A0x408ab2ae4baa960!2sPorto-Vecchio!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Secteur géographique Cosy Casa"
              data-testid="contact-map"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
